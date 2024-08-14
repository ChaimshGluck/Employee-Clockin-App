import db from '../db.js';

export async function userLogin() {

};

export async function userClockin(userId) {
    try {
        const timestamp = new Date();
        let query = 'INSERT INTO TimeEntries (employee_id, clock_in) VALUES ($1, $2)';
        await db.none(query, [userId, timestamp]);
        console.log(`User ${userId} clocked in at ${timestamp}`);
    } catch (error) {
        console.error('Error clocking in:', error);
    }
}

export async function userClockout() {

};

export async function getEmployeeRecords() {

};