const express = require('express');
const wrapAsync = require('../../../YelpCamp/YelpCamp/utility/wrapAsync');
const router = express.Router();
const User = require('../models/users');
const { isLoggedIn, validateUser, isAdmin } = require('../utils/middleware');

router.get('/users', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const users = await User.find({})
    res.render('admin/users', { users })
}))

router.get('/users/:id/edit', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id)
    res.render('admin/user-edit', { user })
}))


router.put('/users/:id/edit', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body)
    res.redirect('/admin/users')
}))

router.get('/users/:id/delete', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    await User.findByIdAndDelete(req.params.id)
    req.flash('success', 'user deleted')
    res.redirect('/admin/users')

}))


module.exports = router