import db from '../db.js';

export async function userLogin() {

};

export async function userClockin(emplyeeId) {
    try {
        const timestamp = new Date();
        const query = 'INSERT INTO TimeEntries (employee_id, clock_in) VALUES ($1, $2) returning entry_id';
        const entry = await db.one(query, [emplyeeId, timestamp]);
        console.log(`User ${emplyeeId} clocked in at ${timestamp}`);
        return { entry_id: entry.entry_id };
    } catch (error) {
        console.error('Error clocking in:', error);
    }
}

export async function userClockout(entryId) {
    try {
        const timestamp = new Date();
        const query = 'UPDATE TimeEntries SET clock_out = $1 where entry_id = $2'
        await db.none(query, [timestamp, entryId])
        console.log(`User clocked out at ${timestamp}`)
    } catch (error) {
        console.error('Error clocking out:', error);
    }
};

export async function getEmployeeRecords() {

};