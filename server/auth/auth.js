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
    
    if (req.path === '/login') return next();
    
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
        req.user = user;
        next();
    })(req, res, next);
}

export default passport;