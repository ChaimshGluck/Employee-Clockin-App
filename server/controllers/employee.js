import db from '../db.js';

export async function userLogin(){

};

export async function userClockin(userId) {
    try {
        const timestamp = new Date();
        db.query = 'INSERT INTO clockins (user_id, clockin_time) VALUES (?, ?)';
        await db.run(query, [userId, timestamp]);
        console.log(`User ${userId} clocked in at ${timestamp}`);
    } catch (error) {
        console.error('Error clocking in:', error);
    }
}

export async function userClockout(){

};

export async function getEmployeeRecords(){
    
};