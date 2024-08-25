import db from '../db.js';
import bcrypt from 'bcryptjs';
import { employees, timeentries } from '../drizzle/schema.js';
import { eq, desc, isNull, and } from 'drizzle-orm';

export async function employeeLogin(employee) {
    try {
        const [employeeRecord] = await db.select({
            employeeId: employees.employeeId,
            email: employees.email,
            password: employees.password
        })
            .from(employees).where(eq(employees.email, employee.email))
        console.log(employeeRecord)
        if (!employeeRecord) { throw new Error('Invalid email or password') };

        const isPasswordCorrect = await bcrypt.compare(employee.password, employeeRecord.password);

        if (isPasswordCorrect) {
            console.log(`employee ${employeeRecord.employeeId} logged in`);
            return { ok: true, employeeId: employeeRecord.employeeId };
        } else {
            throw new Error('Invalid email or password')
        }
    } catch (error) {
        console.error('Error logging in:', error);
        return { ok: false, error: error.message };
    }
};

export async function employeeClockin(employeeId) {
    try {
        const [currentlyClockedIn] = await db.select({ entryId: timeentries.entryId })
            .from(timeentries).where(and(eq(timeentries.employeeId, employeeId), isNull(timeentries.clockOut)))
        if (currentlyClockedIn) {
            throw new Error('Employee is currently clocked in');
        }

        const timestamp = new Date().toISOString();
        await db.insert(timeentries).values({
            employeeId: employeeId,
            clockIn: timestamp
        })
        console.log(`employee ${employeeId} clocked in at ${timestamp}`);
        return { ok: true };

    } catch (error) {
        console.error('Error clocking in:', error);
        return { ok: false, error: error.message };
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

        const timestamp = new Date().toISOString();
        await db.update(timeentries).set({ clockOut: timestamp })
            .where(eq(entryExists.entryId, timeentries.entryId))
        console.log(`employee ${employeeId} clocked out at ${timestamp}`);
        return { ok: true };

    } catch (error) {
        console.error('Error clocking out:', error);
        return { ok: false, error: error.message };
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
            .from(timeentries).where(eq(timeentries.employeeId, employeeId)).orderBy(desc(timeentries.entryDate))
        return { ok: true, employeeRecords: result };

    } catch (error) {
        console.error('Error getting employee records', error);
        return { ok: false, error: error.message };
    }
};