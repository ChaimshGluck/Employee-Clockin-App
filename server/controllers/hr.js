import { totalmem } from 'os';
import db from '../db.js';
import bcrypt from 'bcryptjs';
import { timeentries } from '../drizzle/schema.js';
import { asc, desc } from 'drizzle-orm';

export async function registerUser(employee) {
    try {
        const passhash = await bcrypt.hash(employee.password, 10);
        const query = 'INSERT INTO employees (first_name, last_name, email, password, date_hired) VALUES ($1, $2, $3, $4, CURRENT_DATE) returning *';
        const result = await db.one(query, [
            employee.firstName,
            employee.lastName,
            employee.email,
            passhash
        ]);
        console.log(`registered employee ${result.first_name} ${result.last_name}, id is ${result.employee_id}`)
        return { ok: true, employeeId: result.employee_id }
    } catch (error) {
        console.log('Error registering employee:', error);
        return { ok: false, error: error.message };
    }
};

export async function updateEmployee() {
};

export async function deleteEmployee(employeeId) {
    try {
        const query = 'DELETE FROM employees WHERE employee_id = $1'
        await db.none(query, [employeeId])
        console.log(`deleted employee ${employeeId}`);
        return { ok: true };
    } catch (error) {
        console.error('Error deleting employee:', error);
        return { ok: false, error: error.message };
    }
};

export async function getAllRecords() {
    try {
        const result = await db.select({
            entryId: timeentries.entryId,
            employeeId: timeentries.employeeId,
            clockIn: timeentries.clockIn,
            clockOut: timeentries.clockOut,
            totalHours: timeentries.totalHours,
            entryDate: timeentries.entryDate
        })
            .from(timeentries).orderBy(asc(timeentries.employeeId), desc(timeentries.entryDate))
        return { ok: true, employeesRecords: result };
    } catch (error) {
        console.error('Error getting all clockin records', error);
        return { ok: false, error: error.message };
    }
};