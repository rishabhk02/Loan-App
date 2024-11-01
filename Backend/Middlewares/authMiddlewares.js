const jwt = require('jsonwebtoken');

async function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        const payload = jwt.verify(token, process.env.JWT_SECRETE_KEY);
        req.user = {
            userId: payload.userId,
            role: payload.role
        };
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function adminMiddleware(req, res, next) {
    try {
        if (req.user.role === 'ADMIN') {
            next();
        }else{
            return res.status(401).json({ message: 'Unauthorized access' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    authMiddleware,
    adminMiddleware
};