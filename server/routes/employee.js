import express from 'express';
import { userLogin, userClockin, userClockout, getEmployeeRecords } from '../controllers/employee.js';
const router = express.Router();
export default router;

router.post('/login', async (req, res) => {
    const result = await userLogin(req.query);
    res.json(result);
})

router.post('/clockin', async (req, res) => {
    const result = await userClockin(req.query.employeeId);
    res.json(result);
})

router.patch('/clockout', async (req, res) => {
    const result = await userClockout(req.query.entryId);
    res.json(result);
})

router.get('/records', async (req, res) => {
    const result = await getEmployeeRecords(req.query.employeeId);
    res.json(result);
})