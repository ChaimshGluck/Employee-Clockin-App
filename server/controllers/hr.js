import db from '../db.js';
import bcrypt from 'bcryptjs';
import { sql } from 'drizzle-orm';
import { employees, roles, timeentries } from '../drizzle/schema.js';
import { asc, desc, eq } from 'drizzle-orm';
import { handleError } from '../utils.js';

export async function registerEmployee(employee) {
    try {
        const passhash = await bcrypt.hash(employee.password, 10);
        const [result] = await db.insert(employees).values({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            password: passhash,
            roleId: employee.isHr ? 1 : 2,
            dateHired: new Date().toISOString().split('T')[0]
        })
            .returning({
                firstName: employees.firstName,
                lastName: employees.lastName,
                employeeId: employees.employeeId,
                roleId: employees.roleId
            })

        const [role] = await db.select({ roleName: roles.roleName }).from(roles).where(eq(roles.roleId, result.roleId));
        console.log(`registered ${role.roleName == 'hr' ? 'HR ' : ''}employee ${result.firstName} ${result.lastName}, id is ${result.employeeId}`)
        return { ok: true, employeeId: result.employeeId }

    } catch (error) {
        if (error.code === '23505') {
            return handleError('Error registering employee:', 'Email already in use.')
        }
        return handleError('Error registering employee:', error);
    }
};

export async function updateEmployee() {
};

export async function deleteEmployee(employeeId) {
    try {
        await db.delete(employees).where(eq(employees.employeeId, employeeId));
        console.log(`deleted employee ${employeeId}`);
        return { ok: true };

    } catch (error) {
        return handleError('Error deleting employee:', error);
    }
};

export async function getAllRecords() {
    try {
        const result = await db.select({
            entryId: timeentries.entryId,
            employeeId: timeentries.employeeId,
            fullName: sql`CONCAT(${employees.firstName}, ' ', ${employees.lastName})`,
            clockIn: timeentries.clockIn,
            clockOut: timeentries.clockOut,
            totalHours: timeentries.totalHours,
            entryDate: timeentries.entryDate
        })
            .from(timeentries).leftJoin(employees, eq(timeentries.employeeId, employees.employeeId))
            .orderBy(asc(timeentries.employeeId), desc(timeentries.entryDate))
        return { ok: true, employeesRecords: result };

    } catch (error) {
        return handleError('Error getting all clockin records:', error);
    }
};