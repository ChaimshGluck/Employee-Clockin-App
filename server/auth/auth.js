import passport from 'passport';
import LocalStrategy from 'passport-local';
import CookieStrategy from 'passport-cookie';
import jwt from 'jsonwebtoken';
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

export function checkRole(requiredRoles) {
    return (req, res, next) => {
        if (req.path === '/register') return next();

        const userRole = req.user.role;
        if (!requiredRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
        }

        next();
    };
}

export function authenticateJWT(req, res, next) {
    const token = req.cookies['project2024-token'];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }

            req.user = decoded.user; // attach the user info from the token to the req object
            next();
        });
    } else {
        return res.status(401).json({ message: 'No token provided, please log in.' });
    }
}


export default passport;