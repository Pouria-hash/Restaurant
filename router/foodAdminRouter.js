const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const Food = require('../models/foods')
const User = require('../models/users')
const ExpressError = require('../utils/ExpressError')
const { isLoggedIn, isAdmin } = require('../utils/middleware')


router.get('/', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const foods = await Food.find({})
    res.render('admin/foods', { foods })
}))


router.get('/new', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    res.render('foods/new')
}))

router.post('/', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const food = new Food(req.body)
    food.user = req.user._id
    await food.save()
    req.flash('success', 'New food successfuly create')
    res.redirect('/foods')
}))

router.put('/:id', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const food = await Food.findById(id)
    if (food) {
        await Food.findByIdAndUpdate(id, req.body)
        req.flash('success', "Food updated successfully")
        res.redirect(`/admin/foods`)
    } else {
        throw new ExpressError('Food not found', 404)
    }

}))

router.get('/:id/edit', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const { id } = req.params
    const food = await Food.findById(id)
    if (food) {
        res.render('foods/edit', { food })
    } else {
        throw new ExpressError('Food not found', 404)
    }
}))



router.delete('/:id', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Food.findByIdAndDelete(id)
    req.flash('success', "Food deleted successfully")
    res.redirect('/admin/foods')
}))


module.exports = router