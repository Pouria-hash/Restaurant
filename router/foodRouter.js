const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const Food = require('../models/foods')
const User = require('../models/users')
const ExpressError = require('../utils/ExpressError')
const { isLoggedIn, isAdmin } = require('../utils/middleware')

router.get('/', wrapAsync(async (req, res) => {
    const foods = await Food.find({})
    if (foods.length) {
        res.render('foods/index', { foods })
    } else {
        throw new ExpressError('Foods not found', 404)
    }
}))


router.get('/menu', isLoggedIn, wrapAsync(async (req, res) => {
    const category = req.query.category || "food"
    const foods = await Food.find({})
    if (foods.length) {
        const user = await User.findById(req.user._id).populate({
            path: "cart",
            populate: {
                path: "items",
                populate: {
                    path: "foodId"
                }
            }
        })
        res.render('foods/menu', { foods, category, user })
    } else {
        throw new ExpressError('Foods not found', 404)
    }
}))




router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const food = await Food.findById(id)
    if (food) {
        res.render('foods/show', { food })
    } else {
        throw new ExpressError('Food not found', 404)
    }
}))


router.post('/:id/cart', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { foodQty } = req.body;
    const food = await Food.findById(id);
    const cart = await req.user.addToCart(food, foodQty)
    console.log(cart)
    res.redirect('/foods/menu')
}))


module.exports = router