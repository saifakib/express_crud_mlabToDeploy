const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load User Model
require('../models/User');
const User = require('../models/User');

// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
    /*let email = req.body.email;
      let password =req.body.password;
      User.findOne({email})
          .then(user =>{
              if(user){
                  bcrypt.compare(password, user.password, (req, res) =>{
                      if(err) throw err;
                      if(res){
                          req.flash('success_msg', "Login Successful");
                          res.redirect('/user/register');
                      }
                      else{
                          req.flash('error_msg', 'login unseccessful');
                          res.redirect('/login')
                      }
                  });
              }
              else{
                  req.flash('error_msg', 'login unseccessful');
                  res.redirect('/login')
              }
          })
  */
});

// Register Form POST
router.post('/register', (req, res) => {
  let errors = [];

  if(req.body.password !== req.body.password2){
    errors.push({text:'Passwords do not match'});
  }

  if(req.body.password.length < 4){
    errors.push({text:'Password must be at least 4 characters'});
  }

  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({email: req.body.email})
      .then(user => {
        if(user){
          req.flash('error_msg', 'Email already regsitered');
          res.redirect('/users/register');
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});

// Logout User
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;