const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'Please login first');
    return res.redirect('/login');
  }

  const user = await User.findById(req.session.user._id);
  if (!user || !user.isActive) {
    req.flash('error', 'Account is inactive or not found');
    req.session.destroy();
    return res.redirect('/login');
  }

  req.user = user;
  next();
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'super-admin') {
    req.flash('error', 'Access denied');
    return res.redirect('/');
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
