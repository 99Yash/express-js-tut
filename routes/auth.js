const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.get('/login', (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
});

module.exports = router;
