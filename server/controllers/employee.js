import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { employees, roles, timeentries } from '../drizzle/schema.js';
import { eq, desc, isNull, and, gt } from 'drizzle-orm';
import { handleError } from './utils.js';

export async function verify(username, password, cb) {
    try {
        const [employeeRecord] = await db.select({
            employeeId: employees.employeeId,
            firstName: employees.firstName,
            lastName: employees.lastName,
            email: employees.email,
            password: employees.password,
            role: roles.roleName,
            isActive: employees.isActive,
            dateHired: employees.dateHired
        })
            .from(employees).leftJoin(roles, eq(employees.roleId, roles.roleId))
            .where(eq(employees.email, username))
        if (!employeeRecord) {
            return cb(null, false, { message: 'Invalid email or password' })
        };

        if (!employeeRecord.isActive) {
            return cb(null, false, { message: 'Account is not active. Please check your email for activation instructions.' })
        }

        const [clockInTime] = await db.select({ clockIn: timeentries.clockIn })
            .from(timeentries).where(and(eq(timeentries.employeeId, employeeRecord.employeeId), isNull(timeentries.clockOut)))

        employeeRecord.isClockedIn = !!clockInTime;
        if (clockInTime) {
            employeeRecord.clockInTime = clockInTime.clockIn;
        }

        employeeRecord.fullName = `${employeeRecord.firstName} ${employeeRecord.lastName}`;
        const isPasswordCorrect = await bcrypt.compare(password, employeeRecord.password);
        if (isPasswordCorrect) {
            console.log(`employee ${employeeRecord.employeeId} logged in`);
            employeeRecord.password = '';
            return cb(null, employeeRecord);

        } else {
            return cb(null, false, { message: 'Invalid email or password' })
        }
    } catch (error) {
        return cb(error);
    }
}

export function verifyCookie(token, done) {
    console.log('verifyCookie called with token:', token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        return done(null, decoded.user);
    } catch (error) {
        console.error('Error verifying cookie:', error);
        return done(error, null);
    }
}

export async function employeeClockin(employeeId) {
    try {

        const timestamp = new Date().toLocaleString();
        const [clockinRecord] = await db.insert(timeentries).values({
            employeeId: employeeId,
            clockIn: timestamp
        })
            .returning({ entryId: timeentries.entryId });
        console.log(clockinRecord)
        console.log(`employee ${employeeId} clocked in at ${timestamp}, entryId ${clockinRecord.entryId}`);
        return { ok: true, entryId: clockinRecord.entryId };

    } catch (error) {
        return handleError('Error clocking in:', error.message);
    }
}

export async function employeeClockout(employeeId) {
    try {
        const [entryExists] = await db.select({ entryId: timeentries.entryId }).from(timeentries)
            .where(and(eq(timeentries.employeeId, employeeId), isNull(timeentries.clockOut)));

        const timestamp = new Date().toLocaleString();
        await db.update(timeentries).set({ clockOut: timestamp })
            .where(eq(entryExists.entryId, timeentries.entryId))
        console.log(`employee ${employeeId} clocked out at ${timestamp}, entryId ${entryExists.entryId}`);
        return { ok: true, entryId: entryExists.entryId };

    } catch (error) {
        return handleError('Error clocking in:', error.message);
    }
};

export async function getEmployeeRecords(employeeId) {
    try {
        const result = await db.select({
            entryId: timeentries.entryId,
            clockIn: timeentries.clockIn,
            clockOut: timeentries.clockOut,
            totalHours: timeentries.totalHours,
            entryDate: timeentries.entryDate
        })
            .from(timeentries).where(eq(timeentries.employeeId, employeeId)).orderBy(desc(timeentries.clockIn))
        return { ok: true, employeeRecords: result };

    } catch (error) {
        return handleError('Error getting employee records', error);
    }
};

export async function getEmployee(employeeId) {
    console.log('employeeId:', employeeId)
    try {
        const [result] = await db.select({
            firstName: employees.firstName,
            lastName: employees.lastName,
            email: employees.email,
            hrPermission: roles.roleName,
        })
            .from(employees).leftJoin(roles, eq(employees.roleId, roles.roleId))
            .where(eq(employees.employeeId, employeeId))
        if (result) {
            result.hrPermission = result.hrPermission === 'HR';
            return { ok: true, fetchedEmployee: result };
        } else throw new Error('Employee ID not found')
    } catch (error) {
        return handleError('Error getting employee info:', error)
    }
}

export async function activateAccount(token) {
    console.log('activating account with token:', token);
    try {
        const [result] = await db.select({
            employeeId: employees.employeeId,
            activationToken: employees.activationToken,
            activationTokenExpires: employees.activationTokenExpires,
            isActive: employees.isActive
        }).from(employees)
            .where(and(eq(employees.activationToken, token), gt(employees.activationTokenExpires, Date.now())));

        if (!result) {
            throw new Error('Your activation token has expired or is invalid');
        }

        if (result.isActive) {
            throw new Error('Account is already active');
        }

        await db.update(employees).set({
            isActive: true
        })
            .where(eq(result.employeeId, employees.employeeId));
        return { ok: true };
    } catch (error) {
        return handleError('Error activating account:', error);
    }
}