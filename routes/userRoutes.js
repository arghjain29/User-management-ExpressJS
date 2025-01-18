const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// Home Page
router.get('/', (req, res) => {
  const messages = {
    success: req.flash('success'),
    error: req.flash('error')
  };
  res.render('index', { user: req.session.user, messages });
});

// Register Page
router.get('/register', (req, res) => {
  const errorMessage = req.flash('error');
  res.render('register', { message: errorMessage.length > 0 ? errorMessage[0] : undefined });
});


router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    if (!name || !email || !password || !phone) {
      req.flash('error', 'All fields are required');
      return res.redirect('/register');
    }
    
    if (await User.findOne({ email })) {
      req.flash('error', 'Email already exists');
      return res.redirect('/register');
    }

    const user = new User({ name, email, password, phone });
    await user.save();
    req.flash('success', 'Registration successful! Please login.');
    res.redirect('/login');
  } catch (err) {
    req.flash('error', 'Error during registration');
    res.redirect('/register');
  }
});

// Login Page
router.get('/login', (req, res) => {
  const successMessage = req.flash('success');
  const errorMessage = req.flash('error');
  res.render('login', {
    message: errorMessage.length > 0 ? errorMessage[0] : undefined,
    success: successMessage.length > 0 ? successMessage[0] : undefined,
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      req.flash('error', 'Email and password are required');
      return res.redirect('/login');
    }
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    if (!user.isActive) {
      req.flash('error', 'Account is deactivated');
      return res.redirect('/login');
    }

    req.session.user = user;
    res.redirect('/dashboard');
  } catch (err) {
    req.flash('error', 'Error during login');
    res.redirect('/login');
  }
});

// Dashboard
router.get('/dashboard', authMiddleware, (req, res) => {
  const messages = req.flash('success');
  const errors = req.flash('error');
  res.render('dashboard', { user: req.user, messages, errors });
});


// See Profile
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      // If no user data is found, throw an error
      throw new Error('User data not available. Please log in again.');
    }
    // Render the profile view with the user data
    res.render('profile', { user: req.user });
  } catch (err) {
    // Pass the error to the centralized error handler
    next(err);
  }
});

// Render edit profile page
router.get('/profile/edit', authMiddleware, (req, res) => {
  res.render('edit-profile', { user: req.user });
});


// Update Profile
router.post('/update-profile', authMiddleware, async (req, res) => {
  const { name, phone } = req.body;

  try {
    req.user.name = name || req.user.name;
    req.user.phone = phone || req.user.phone;
    await req.user.save();
    req.flash('success', 'Profile updated successfully');
    res.redirect('/dashboard');
  } catch (err) {
    req.flash('error', 'Error updating profile');
    res.redirect('/dashboard');
  }
});

// GET route for deactivating account - show confirmation page
router.get('/deactivate', authMiddleware, (req, res) => {
  res.render('deactivate'); // Render a deactivation confirmation page
});

// POST route for deactivating account
router.post('/deactivate', authMiddleware, async (req, res) => {
  try {
    req.user.isActive = false; 
    await req.user.save(); 
    req.flash('success', 'Account deactivated successfully'); 
    res.redirect('/'); 
    req.session.destroy(); 
  } catch (err) {
    req.flash('error', 'Error deactivating account'); 
    res.redirect('/dashboard');
  }
});


// Super Admin: Get All Users
router.get('/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.render('users', { users });
  } catch (err) {
    req.flash('error', 'Error fetching users');
    res.redirect('/');
  }
});

// Logout
router.get('/logout', (req, res) => {
  res.redirect('/');
  req.session.destroy();
});

module.exports = router;
