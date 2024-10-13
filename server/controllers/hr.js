import db from '../db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import 'dotenv/config';
import nodemailer from 'nodemailer';
import { sql } from 'drizzle-orm';
import { employees, roles, timeentries } from '../drizzle/schema.js';
import { asc, desc, eq } from 'drizzle-orm';
import { handleError } from './utils.js';

export async function registerEmployee(employee) {
    const activationToken = crypto.randomBytes(20).toString('hex');

    try {
        const emailResponse = await sendActivationEmail(employee.email, activationToken);
        console.log('emailResponse:', emailResponse);
    } catch (error) {
        return handleError('error sending email:', error.message)
    }

    try {
        const passhash = await bcrypt.hash(employee.password, 10);
        const roleName = employee.isHr ? 'HR' : 'employee';
        const role = await getRole(roleName);

        const [result] = await db.insert(employees).values({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            password: passhash,
            roleId: role.roleId,
            dateHired: new Date().toISOString().split('T')[0],
            activationToken: activationToken,
            activationTokenExpires: Date.now() + (60 * 60 * 1000)
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

export async function sendActivationEmail(email, activationToken) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'chaimshglick@gmail.com',
            pass: process.env.GMAIL_PASS
        },
    });

    const mailOptions = {
        from: 'chaimshglick@gmail.com',
        to: email,
        subject: 'Activate Your Account',
        html: `<p>Click the following link to activate your account:</p>
           <a href="${process.env.FE_URL}/employee/activate/${activationToken}">Activate Account</a>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return 'Email sent: ' + info.response;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email: ' + error.message);
    };
}

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
        return { ok: true, employeeRecords: result };

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

export async function getEmployee(employeeIdToUpdate) {
    try {
        const [result] = await db.select({
            firstName: employees.firstName,
            lastName: employees.lastName,
            email: employees.email,
            hrPermission: roles.roleName,
        })
            .from(employees).leftJoin(roles, eq(employees.roleId, roles.roleId))
            .where(eq(employees.employeeId, employeeIdToUpdate))
        if (result) {
            result.hrPermission = result.hrPermission === 'HR';
            return { ok: true, fetchedEmployee: result };
        } else throw new Error('Employee ID doesn\'t exist')
    } catch (error) {
        return handleError('Error getting employee info:', error)
    }
}

export async function updateEmployee(employee) {
    console.log('incoming employee to update:', employee)
    try {
        const roleName = employee.isHr ? 'HR' : 'employee';
        const role = await getRole(roleName);

        const updatedEmployee = {
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            roleId: role.roleId,
        }

        if (employee.password) {
            updatedEmployee.password = await bcrypt.hash(employee.password, 10);
        }

        const [result] = await db.update(employees)
            .set(updatedEmployee)
            .where(eq(employees.employeeId, employee.employeeId))
            .returning({
                firstName: employees.firstName,
                lastName: employees.lastName,
            })
        console.log(`updated employee ${result.firstName} ${result.lastName}`)
        return { ok: true, employeeId: employee.employeeId };
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
        return { ok: true, employeeId: employeeId };
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