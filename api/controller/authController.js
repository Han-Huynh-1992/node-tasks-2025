const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'Key123';

module.exports = function (app) {
    // Register
    app.post('/api/register', async (req, res) => {
        try {
            const { name, email, password } = req.body;
            if (!email || !password || !name) return res.status(400).json({ message: 'All fields are required.' });
            if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) return res.status(400).json({ message: 'Email already exists.' });

            const hashedPassword = await bcrypt.hash(password, 10);

            const maxId = await User.max('id');
            const newId = (maxId || 0) + 1;

            const newUser = await User.create({
                id: newId,
                name,
                email,
                password: hashedPassword
            });

            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Login
    app.post('/api/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: 'Invalid email or password.' });

            const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, SECRET_KEY, { expiresIn: '1d' });

            res.cookie('token', token, { httpOnly: true });
            res.status(200).json({ message: 'Login successful' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};
