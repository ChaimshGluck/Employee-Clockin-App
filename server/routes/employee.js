import express from 'express';
import { employeeLogin, employeeClockin, employeeClockout, getEmployeeRecords } from '../controllers/employee.js';
const router = express.Router();
export default router;

router.post('/login', async (req, res) => {
    const result = await employeeLogin(req.query);
    res.json(result);
})

router.post('/clockin', async (req, res) => {
    const result = await employeeClockin(req.query.employeeId);
    res.json(result);
})

router.patch('/clockout', async (req, res) => {
    const result = await employeeClockout(req.query.employeeId);
    res.json(result);
})

router.get('/records', async (req, res) => {
    const result = await getEmployeeRecords(req.query.employeeId);
    res.json(result);
})