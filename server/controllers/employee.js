import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { employees, roles, timeentries } from '../drizzle/schema.js';
import { eq, desc, isNull, and } from 'drizzle-orm';
import { handleError } from './utils.js';

export async function verify(username, password, cb) {
    try {
        const [employeeRecord] = await db.select({
            employeeId: employees.employeeId,
            firstName: employees.firstName,
            lastName: employees.lastName,
            email: employees.email,
            password: employees.password,
            role: roles.roleName
        })
            .from(employees).leftJoin(roles, eq(employees.roleId, roles.roleId))
            .where(eq(employees.email, username))
        if (!employeeRecord) {
            return cb(null, false, { message: 'Invalid email or password' })
        };
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
        return done(null, false);
    }
}

export async function employeeClockin(employeeId) {
    try {
        const [currentlyClockedIn] = await db.select({ entryId: timeentries.entryId })
            .from(timeentries).where(and(eq(timeentries.employeeId, employeeId), isNull(timeentries.clockOut)))
        if (currentlyClockedIn) {
            throw new Error('Employee is currently clocked in');
        }

        const timestamp = new Date().toLocaleString();
        await db.insert(timeentries).values({
            employeeId: employeeId,
            clockIn: timestamp
        })
        console.log(`employee ${employeeId} clocked in at ${timestamp}`);
        return { ok: true };

    } catch (error) {
        return handleError('Error clocking in:', error.message);
    }
}

export async function employeeClockout(employeeId) {
    try {
        const [entryExists] = await db.select({ entryId: timeentries.entryId }).from(timeentries)
            .where(and(eq(timeentries.employeeId, employeeId), isNull(timeentries.clockOut)));
        console.log(entryExists)
        if (!entryExists) {
            throw new Error('Employee is not clocked in')
        }

        const timestamp = new Date().toLocaleString();
        await db.update(timeentries).set({ clockOut: timestamp })
            .where(eq(entryExists.entryId, timeentries.entryId))
        console.log(`employee ${employeeId} clocked out at ${timestamp}`);
        return { ok: true };

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