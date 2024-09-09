import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import { employeeClockin, employeeClockout, getEmployeeRecords } from '../controllers/employee.js';
import passport, { authenticateCookie } from '../auth/auth.js';
const router = express.Router();
export default router;

router.use(authenticateCookie);

router.post('/login', (req, res) => {

    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            console.log('Error logging in:', err);
            return res.status(400).json({ ok: false, error: err.message });
        }

        if (!user) {
            console.log('Error logging in:', info.message);
            return res.status(400).json({ ok: false, error: info.message });
        }
        const token = jwt.sign({ user: { id: user.employeeId, email: user.email } }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('token:', token);
        res.cookie('project2024-token', token, { httpOnly: true, secure: false, path: '/' });
        return res.json({ ok: true, employeeId: user.employeeId, role: user.roleId });
    })(req, res)
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
    console.log('Authenticated user:', req.user);
    const result = await getEmployeeRecords(req.user.id);
    res.json(result);
});