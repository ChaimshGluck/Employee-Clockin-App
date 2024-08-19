import db from '../db.js';

export async function userLogin() {

};

export async function userClockin(employeeId) {
    try {
        const timestamp = new Date();
        const query = 'INSERT INTO TimeEntries (employee_id, clock_in) VALUES ($1, $2) returning entry_id';
        const entry = await db.one(query, [employeeId, timestamp]);
        console.log(`User ${employeeId} clocked in at ${timestamp}`);
        return { entry_id: entry.entry_id };
    } catch (error) {
        console.error('Error clocking in:', error);
        return {ok: false, error: error.message};
    }
}

export async function userClockout(entryId) {
    try {
        const timestamp = new Date();
        const query = 'UPDATE TimeEntries SET clock_out = $1 where entry_id = $2 returning employee_id, clock_out'
        const result = await db.one(query, [timestamp, entryId]);
        console.log(`User ${result.employee_id} clocked out at ${result.clock_out}`);
        return {ok: true};
    } catch (error) {
        console.error('Error clocking out:', error);
        return {ok: false, error: error.message};
    }
};

export async function getEmployeeRecords(employeeId) {
    try {
        const query = 'SELECT entry_id, clock_in, clock_out, total_hours, entry_date FROM timeentries WHERE employee_id = $1';
        const result = await db.manyOrNone(query, [employeeId]);
        return {ok: true, employeeRecords: result};
    } catch (error) {
        console.error('Error getting employee records', error);
        return {ok: false, error: error.message};
    }
};