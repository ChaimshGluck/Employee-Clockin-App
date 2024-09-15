import db from '../db.js';
import bcrypt from 'bcryptjs';
import { sql } from 'drizzle-orm';
import { employees, roles, timeentries } from '../drizzle/schema.js';
import { asc, desc, eq } from 'drizzle-orm';
import { handleError } from './utils.js';

export async function registerEmployee(employee) {
    try {
        const passhash = await bcrypt.hash(employee.password, 10);
        const roleName = employee.isHr ? 'HR' : 'employee'

        const role = await getRole(roleName);
        const [result] = await db.insert(employees).values({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            password: passhash,
            roleId: role.roleId,
            dateHired: new Date().toISOString().split('T')[0]
        })
            .returning({
                firstName: employees.firstName,
                lastName: employees.lastName,
                employeeId: employees.employeeId,
            })
        console.log(`registered ${role.roleName == 'HR' ? 'HR ' : ''}employee ${result.firstName} ${result.lastName}, id is ${result.employeeId}`)
        return { ok: true, employeeId: result.employeeId }

    } catch (error) {
        if (error.code === '23505') {
            return handleError('Error registering employee:', 'Email already in use')
        }
        return handleError('Error registering employee:', error);
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
            .orderBy(desc(timeentries.clockIn))
        return { ok: true, employeesRecords: result };

    } catch (error) {
        return handleError('Error getting all clockin records:', error);
    }
};

export async function getAllEmployees() {
    try {
        const result = await db.select({
            employeeId: employees.employeeId,
            firstName: employees.firstName,
            lastName: employees.lastName,
            email: employees.email,
            role: roles.roleName,
            dateHired: employees.dateHired
        }).from(employees).leftJoin(roles, eq(employees.roleId, roles.roleId))
            .orderBy(desc(employees.employeeId))
        return { ok: true, employees: result };
    } catch (error) {
        return handleError('Error getting all employees:', error)
    }
}

export async function getEmployee(employeeIdtoUpdate) {
    try {
        const [result] = await db.select({
            firstName: employees.firstName,
            lastName: employees.lastName,
            email: employees.email,
            role: roles.roleName,
            dateHired: employees.dateHired
        })
            .from(employees).leftJoin(roles, eq(employees.roleId, roles.roleId))
            .where(eq(employees.employeeId, employeeIdtoUpdate))
        return { ok: true, fetchedEmployee: result };
    } catch (error) {
        return handleError('Error getting employee info:', error)
    }
}

export async function updateEmployee(employee) {
    console.log(employee)
    try {
        const passhash = await bcrypt.hash(employee.password, 10);
        const roleName = employee.isHr ? 'HR' : 'employee';
        const role = await getRole(roleName);
        console.log(passhash, role)

        const [result] = await db.update(employees)
            .set({
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                password: passhash,
                roleId: role.roleId,
            })
            .where(eq(employees.employeeId, employee.employeeId))
            .returning({
                firstName: employees.firstName,
                lastName: employees.lastName,
            })
        console.log(`updated employee ${result.firstName} ${result.lastName}`)
        return { ok: true }
    } catch (error) {
        if (error.code === '23505') {
            return handleError('Error updating employee:', 'Email already in use.')
        }
        return handleError('Error updating employee:', error);
    }
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

async function getRole(roleName) {
    try {
        const [role] = await db.select({
            roleId: roles.roleId,
            roleName: roles.roleName
        })
            .from(roles).where(eq(roles.roleName, roleName))
        return role;
    } catch (error) {
        return handleError('Error getting role:', error)
    }
}