import express from 'express';
import { registerEmployee, updateEmployee, deleteEmployee, getAllRecords, getAllEmployees, getEmployee } from '../controllers/hr.js';
const router = express.Router();
export default router;

router.post('/register', async (req, res) => {
    const result = await registerEmployee(req.body);
    res.json(result);
})

router.get('/all-records', async (req, res) => {
    const result = await getAllRecords();
    res.json(result);
})

router.get('/employees', async (req, res) => {
    const result = await getAllEmployees();
    res.json(result);
})

router.get('/employee', async (req, res) => {
    const result = await getEmployee(req.query.employeeId);
    res.json(result);
})

router.patch('/update', async (req, res) => {
    const result = await updateEmployee(req.body);
    res.json(result);
})

router.delete('/delete', async (req, res) => {
    const result = await deleteEmployee(req.query.employeeId);
    res.json(result);
})