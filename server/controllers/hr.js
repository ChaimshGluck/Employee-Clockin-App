import db from '../db.js';

export async function registerUser(emplyee){
    try {
        const query = 'INSERT INTO employees (first_name, last_name, email, date_hired) VALUES ($1, $2, $3, CURRENT_DATE)';
        await db.none(query, [
            emplyee.firstName,
            emplyee. lastName,
            emplyee.email
        ]);
        console.log(`registered employee ${emplyee.firstName} ${emplyee.lastName}`)
        return {ok: true}
    } catch (error) {
        console.log('Error registering employee:', error)
    }
};

export async function updateEmployee(){
};

export async function deleteEmployee(emplyeeId){
    try {
        const query = 'DELETE FROM employees WHERE employee_id = $1'
        await db.none(query, [emplyeeId])
        console.log(`delete employee ${emplyeeId}`)
    } catch (error) {
        console.log('Error deleting employee:', error)
    }
};

export async function getAllRecords(){
    
};