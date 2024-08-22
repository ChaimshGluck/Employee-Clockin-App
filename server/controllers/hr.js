import db from '../db.js';
import bcrypt from 'bcryptjs';

export async function registerUser(employee){
    try {
        const passhash = await bcrypt.hash(employee.password, 10);
        const query = 'INSERT INTO employees (first_name, last_name, email, password, date_hired) VALUES ($1, $2, $3, $4, CURRENT_DATE) returning *';
        const result = await db.one(query, [
            employee.firstName,
            employee. lastName,
            employee.email,
            passhash
        ]);
        console.log(`registered employee ${result.first_name} ${result.last_name}, id is ${result.employee_id}`)
        return {ok: true, employeeId: result.employee_id}
    } catch (error) {
        console.log('Error registering employee:', error);
        return {ok: false, error: error.message};
    }
};

export async function updateEmployee(){
};

export async function deleteEmployee(employeeId){
    try {
        const query = 'DELETE FROM employees WHERE employee_id = $1'
        await db.none(query, [employeeId])
        console.log(`deleted employee ${employeeId}`);
        return {ok: true};
    } catch (error) {
        console.error('Error deleting employee:', error);
        return {ok: false, error: error.message};
    }
};

export async function getAllRecords(){
    try {
        const query = 'SELECT entry_id, employee_id, clock_in, clock_out, total_hours, entry_date FROM timeentries ORDER BY employee_id, entry_date DESC';
        const result = await db.manyOrNone(query);
        return {ok: true, employeesRecords: result};
    } catch (error) {
        console.error('Error getting all clockin records', error);
        return {ok: false, error: error.message};
    }
};