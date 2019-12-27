const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { authenticated } = require('../config/auth');

// User Model
const User = require('../Models/User');

// login page
router.get('/login', authenticated, (req, res) => res.render('login'));

// register page
router.get('/register', authenticated, (req, res) => res.render('register'));

// Resgister handle
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //check resquire fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  //check passwords match
  if (password !== password2) {
    errors.push({ msg: 'Password do not match' });
  }

  //check pass length
  if (password.length < 6) {
    errors.push({ msg: 'password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // validation passed
    User.findOne({ email: email }).then(user => {
      if (user) {
        // User Exists
        errors.push({ msg: 'Email is already registered' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        //Hash Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to hashed
            newUser.password = hash;
            //save user
            newUser
              .save()
              .then(user => {
                req.flash('success_msg', 'You are now register and can log in');
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          }),
        );

        // console.log(newUser)
        // res.send('hello')
      }
    });
  }
});

// Login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});

//logout handle
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_msg', 'You are Logged Out');
  res.redirect('/users/login');
});

module.exports = router;
