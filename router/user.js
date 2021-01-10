const express = require('express')
const router = express.Router();
const passport = require('passport')
const wrapAsync = require('../utility/wrapAsync')
const user = require('../controller/userCont');


router.route('/register')
    .get(user.registerForm)
    .post(wrapAsync(user.creatNewUser))

router.route('/login')
    .get(user.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.loginUser)

router.get('/logout', user.logoutUser)

module.exports = router;
