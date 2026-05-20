const jwt = require('jsonwebtoken');

// 2. Middleware для автентифікації (перевірка JWT)
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Перевіряємо наявність заголовка та префікса Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Верифікація токена за допомогою секретного ключа
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Записуємо дані з токена (userId, role) у req.user
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

// 3. Middleware для авторизації (RBAC)
const authorize = (requiredRole) => {
    return (req, res, next) => {
        // Перевіряємо, чи після автентифікації у користувача є потрібна роль
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'Forbidden. You do not have permission.' });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
