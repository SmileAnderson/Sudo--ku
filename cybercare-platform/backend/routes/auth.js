// backend/routes/auth.js - Authentication routes
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readData, writeData } = require('../middleware/dataStorage');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { idno, email, password } = req.body;
    
    if (!idno || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userData = await readData('users.json');
    const user = userData.users.find(u => u.idno === idno && u.email === email);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token directly, skipping all MFA steps
    const token = jwt.sign(
      { userId: user.id, email: user.email, companyId: user.companyId },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        companyName: user.companyName,
        companyId: user.companyId,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { idno, email, password, companyName } = req.body;
    
    if (!idno || !email || !password || !companyName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    if (!/^\d{13}$/.test(idno)) {
      return res.status(400).json({ message: 'IDNO must be exactly 13 digits' });
    }

    const userData = await readData('users.json');
    
    const existingUser = userData.users.find(u => u.email === email || u.idno === idno);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or IDNO already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      id: `user_${Date.now()}`,
      idno,
      email,
      passwordHash,
      companyName,
      companyId: `comp_${Date.now()}`,
      role: 'admin',
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    userData.users.push(newUser);
    await writeData('users.json', userData);

    res.status(201).json({ 
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        companyName: newUser.companyName
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify JWT token middleware (unchanged)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Protected route example
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userData = await readData('users.json');
    const user = userData.users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      companyName: user.companyName,
      companyId: user.companyId,
      role: user.role,
      lastLogin: user.lastLogin
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout endpoint
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = { router, authenticateToken };