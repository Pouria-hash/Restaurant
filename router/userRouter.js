const express = require('express');
const passport = require('passport');
const wrapAsync = require('../../../YelpCamp/YelpCamp/utility/wrapAsync');
const router = express.Router();
const User = require('../models/users');
const Order = require('../models/order');
const { isLoggedIn, validateUser } = require('../utils/middleware');


router.get('/register', (req, res) => {
    res.render('user/register')
})

router.post('/register', validateUser, async (req, res) => {
    const { username, password, confirmPassword, email } = req.body;
    if (password !== confirmPassword) {
        req.flash('error', "Confirm Password is incorrect")
        res.redirect('/register')
    } else {
        const user = new User({ username, email });
        const registerUser = await User.register(user, password)
        req.logIn(registerUser, err => {
            if (err) return next(err)
        })
        req.flash('success', "successfuly registered")
        res.redirect('/')
    }
})

router.get('/login', (req, res) => {
    res.render('user/login')
})

router.post('/login', passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), (req, res) => {
    const foundPath = req.session.returnTo || '/'
    delete req.session.returnTo
    req.flash('success', "Welcome back")
    res.redirect(foundPath)
})

router.get('/profile', isLoggedIn, wrapAsync(async (req, res) => {
    const currentUser = req.user
    const orders = await Order.find({ user: currentUser._id })
    res.render('user/profile', { currentUser, orders })
}))

router.post('/profile', isLoggedIn, wrapAsync(async (req, res) => {
    const { username, email } = req.body
    await User.findByIdAndUpdate(req.user._id, { username, email })
    req.flash('success', 'successfuly updated profile')
    res.redirect('/profile')
}))

router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('success', 'Bye')
    res.redirect('/')
})



module.exports = router;