import passport from 'passport';
import LocalStrategy from 'passport-local';
import CookieStrategy from 'passport-cookie';
import { verify, verifyCookie } from "../controllers/employee.js";

const localStrategy = new LocalStrategy(verify);
passport.use(localStrategy);

const cookieStrategy = new CookieStrategy({
    cookieName: 'project2024-token',
    signed: false,
}, (token, done) => verifyCookie(token, done));
passport.use('cookie', cookieStrategy);

export function authenticateCookie(req, res, next) {
    console.log('Incoming request path:', req.path);

    if (req.path === '/login' || req.path === '/register') return next();

    if (!req.cookies['project2024-token']) {
        console.log('No cookie provided');
        return res.status(401).json({ message: 'Unauthorized - No cookie provided' });
    }

    console.log('Cookies received:', req.cookies);
    passport.authenticate('cookie', { session: false }, (err, user, info) => {
        console.log('Cookie authentication result:', { err, user, info });
        if (err) {
            console.error('Authentication error:', err);
            return res.status(401).json({ message: 'Authentication error' });
        }
        if (!user) {
            console.log('User not authenticated');
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (req.query.employeeId && user.id != req.query.employeeId) {
            console.log('Token does not match user');
            return res.status(401).json({ message: 'Unauthorized - Token does not match user' });
        }

        req.user = user;
        next();
    })(req, res, next);
}

export function checkHR(req, res, next) {
    if (req.path === '/register') return next();

    const userRole = req.user.role;
    if (userRole !== 'HR') {
        return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
    }

    next();
};

export default passport;