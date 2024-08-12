import express from 'express';
import { userLogin, userClockin, userClockout, getEmployeeRecords } from '../controllers/employee';
const router = express.Router();
export default router;

router.post('/login', async (req, res) => {
    const result = await userLogin(req.query);
    res.json(result);
})

router.post('/clockin', async (req, res) => {
    const result = await userClockin();
    res.json(result);
})

router.patch('/clockout', async (req, res) => {
    const result = await userClockout();
    res.json(result);
})

router.get('/records', async (req, res) => {
    const result = await getEmployeeRecords();
    res.json(result);
})