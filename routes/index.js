const express = require('express');
const router = express.Router();
const { ensureAuthenticated, authenticated } = require('../config/auth');

// welcome page
router.get('/', authenticated, (req, res) => res.render('welcome'));

//dashboard page
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    name: req.user.name,
  }),
);

module.exports = router;
