const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const { authenticate, authorize } = require('./middleware/auth');

const app = express();
app.use(express.json());

// Імітація бази даних користувачів (паролі захешовано за допомогою bcrypt.hashSync('password', 10))
const users = [
    {
        id: 1,
        email: 'admin@example.com',
        // Хеш від пароля "admin123"
        passwordHash: '$2b$10$X8M1M24KjVGA56vD9f9FdujVwR6A/n787hA/6pCqC.KjFf1m67fTq', 
        role: 'admin'
    },
    {
        id: 2,
        email: 'user@example.com',
        // Хеш від пароля "user123"
        passwordHash: '$2b$10$Uv0V3B9Zf/yR9OqE4cW9UuxBvF.0v7HwUf8K8b2GvDkKjFf1m67fTq', 
        role: 'user'
    }
];

// 1. Ендпоінт POST /login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Пошук користувача в "базі даних"
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Перевірка пароля (порівняння відкритого пароля з хешем)
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Генерація JWT (payload містить userId та role)
    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Токен діє 1 годину
    );

    return res.json({ accessToken: token });
});

// 4. Захищений ендпоінт GET /admin (доступний лише для admin)
app.get('/admin', authenticate, authorize('admin'), (req, res) => {
    res.json({
        message: 'Welcome to the Admin Dashboard!',
        user: req.user // Містить дані з токена
    });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
