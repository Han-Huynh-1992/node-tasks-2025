const jwt = require('jsonwebtoken');
const SECRET_KEY = 'Key123';

module.exports = function (req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // 'Bearer TOKEN'
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};
