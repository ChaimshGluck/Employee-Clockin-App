import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import { activateAccount, employeeClockin, employeeClockout, getEmployee, getEmployeeRecords } from '../controllers/employee.js';
import passport, { authenticateCookie } from '../auth/auth.js';
const router = express.Router();
export default router;

router.use(authenticateCookie);

router.post('/login', (req, res) => {

    // Passport's local strategy will authenticate the user
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            console.error('Error logging in:', err);
            return res.status(500).json({ ok: false, message: 'Unable to log in' });
        }

        if (!user) {
            console.log('Error logging in:', info.message);
            return res.status(401).json({ ok: false, message: info.message });
        }

        const token = jwt.sign({ user: { id: user.employeeId, email: user.email, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('token:', token);
        res.cookie('project2024-token', token, { httpOnly: true, secure: false, path: '/', maxAge: 3600000 });
        return res.json({ ok: true, token, employee: user });
    })(req, res)
})

router.post('/clockin', async (req, res) => {
    const result = await employeeClockin(req.query.employeeId);
    console.log('Clockin result:', result);
    if (!result.ok) {
        return res.status(400).json(result);
    }
    res.json(result);
})

router.patch('/clockout', async (req, res) => {
    const result = await employeeClockout(req.query.employeeId);
    if (!result.ok) {
        return res.status(400).json(result);
    }
    res.json(result);
})

router.get('/records', async (req, res) => {
    console.log('Authenticated user:', req.user);
    const result = await getEmployeeRecords(req.user.id);
    res.json(result);
});

router.get('/profile', async (req, res) => {
    console.log('Authenticated user:', req.user);
    const result = await getEmployee(req.user.id);
    res.json(result);
});

router.get('/activate/:token', async (req, res) => {
    const result = await activateAccount(req.params.token);
    res.json(result);
});