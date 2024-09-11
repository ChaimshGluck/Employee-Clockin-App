import express from 'express';
import { registerEmployee, updateEmployee, deleteEmployee, getAllRecords, getAllEmployees } from '../controllers/hr.js';
const router = express.Router();
export default router;

router.post('/register', async (req, res) => {
    const result = await registerEmployee(req.body);
    res.json(result);
})

router.patch('/employee/:id', async (req, res) => {
    const result = await updateEmployee(req.params.id);
    res.json(result);
})

router.delete(`/employee/:id`, async (req, res) => {
    const result = await deleteEmployee(req.params.id);
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