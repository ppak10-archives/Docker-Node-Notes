/**
 * auth.js
 * Routes for user authentication
 */

/**
 * Node Modules
 */

const express = require('express');
const router = express.Router();

/**
 * Helpers
 */

const authHelpers = require('../helpers/auth.helpers');
const handleRes = require('../helpers/response.helpers').handleResponse;

/**
 * Register Route
 */

router.post('/register', authHelpers.loginRedirect, async (req, res) => {
  try {
    const newUser = await authHelpers.createUser(req, res);
    if (newUser) {
      handleRes(res, 200, 'REGISTER_SUCCESS', newUser.dataValues.username);
    }
  } catch (err) {
    handleRes(res, 500, 'REGISTER_SERVER_ERROR', err);
  }
});

/**
 * Login Route
 */

router.post('/login', authHelpers.loginRedirect, async (req, res) => {
  try {
    const user = await authHelpers.loginUser(req, res);
    if (user) {
      req.session.user = user.dataValues;
      handleRes(res, 200, 'LOGIN_SUCCESS', user.dataValues.username);
    }
  } catch (err) {
    handleRes(res, 500, 'LOGIN_SERVER_ERROR', err);
  }
});

/**
 * Logout Route
 */
router.get('/logout', authHelpers.loginRequired, (req, res) => {
  try {
    if (req.session.cookie) {
      res.clearCookie('connect.sid');
      handleRes(res, 200, 'LOGOUT_SUCCESS');
    } else {
      handleRes(res, 404, 'LOGOUT_COOKIE_ERROR');
    }
  } catch (err) {
    handleRes(res, 500, 'LOGOUT_SERVER_ERROR', err);
  }
});

module.exports = router;

// const authController = require('../controllers/auth');

// module.exports = (app, passport) => {
//   app.get('/signup', authController.signup);
//   app.get('/signin', authController.signin);
//   app.post('/signup', passport.authenticate('local-signup', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/signup',
//   }));
//   app.get('/dashboard', isLoggedIn, authController.dashboard);
//   app.get('/logout', authController.logout);
//   app.post('/signin', passport.authenticate('local-signin', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/signin',
//   }));

//   /**
//    * Checks that user is logged in, otherwise redirects
//    * @param {*} req 
//    * @param {*} res 
//    * @param {*} next 
//    */
//   function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     res.redirect('/signin');
//   }
// }