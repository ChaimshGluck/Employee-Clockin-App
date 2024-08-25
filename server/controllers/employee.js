import db from '../db.js';
import bcrypt from 'bcryptjs';
import { timeentries } from '../drizzle/schema.js';
import { eq, desc } from 'drizzle-orm';

export async function userLogin(employee) {
    try {
        const query = 'SELECT employee_id, email, password FROM employees where email = $1';
        const employeeRecord = await db.oneOrNone(query, [employee.email]);
        if (!employeeRecord) { throw new Error('Invalid email or password') };

        const isPasswordCorrect = await bcrypt.compare(employee.password, employeeRecord.password);

        if (isPasswordCorrect) {
            console.log(`employee ${employeeRecord.employee_id} logged in`);
            return { ok: true, employeeId: employeeRecord.employee_id };
        } else {
            throw new Error('Invalid email or password')
        }
    } catch (error) {
        console.error('Error logging in:', error);
        return { ok: false, error: error.message };
    }
};

export async function userClockin(employeeId) {
    try {
        const queryCheck = 'SELECT entry_id FROM TimeEntries WHERE employee_id = $1 AND clock_out IS NULL';
        const currentlyClockedIn = await db.oneOrNone(queryCheck, [employeeId]);
        if (currentlyClockedIn) {
            throw new Error('Employee is currently clocked in');
        }

        const timestamp = new Date();
        const query = 'INSERT INTO TimeEntries (employee_id, clock_in) VALUES ($1, $2)';
        await db.none(query, [employeeId, timestamp]);
        console.log(`employee ${employeeId} clocked in at ${timestamp}`);
        return { ok: true };

    } catch (error) {
        console.error('Error clocking in:', error);
        return { ok: false, error: error.message };
    }
}

export async function userClockout(employeeId) {
    try {
        const queryCheck = 'SELECT clock_out FROM TimeEntries WHERE employee_id = $1 AND clock_out IS NULL';
        const entryExists = await db.oneOrNone(queryCheck, [employeeId]);
        if (!entryExists) {
            throw new Error('Employee is not clocked in')
        }

        const timestamp = new Date();
        const query = 'UPDATE TimeEntries SET clock_out = $1 WHERE clock_out IS NULL AND employee_id = $2 returning clock_out';
        const result = await db.one(query, [timestamp, employeeId]);
        console.log(`employee ${employeeId} clocked out at ${result.clock_out}`);
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