import express from 'express';
import { registerUser, updateEmployee, deleteEmployee, getAllRecords } from '../controllers/hr.js';
const router = express.Router();
export default router;

router.post('/register', async (req, res) => {
    const result = await registerUser(req.body);
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

router.get('/employees', async (req, res) => {
    const result = await getAllRecords();
    res.json(result);
})