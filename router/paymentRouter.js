const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const Food = require('../models/foods')
const User = require('../models/users')
const Order = require('../models/order')
const ExpressError = require('../utils/ExpressError')
const { isLoggedIn, isAdmin } = require('../utils/middleware')



router.delete('/cart/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await req.user.removeFromCart(id)
    res.redirect('/foods/menu')
}))

router.put('/api/addprice', isLoggedIn, wrapAsync(async (req, res) => {
    const { total, shipping } = req.body;
    const cart = req.user.cart;
    cart.totalPrice = total;
    cart.shippingPrice = shipping;
    await req.user.save()
    res.redirect('/shipping')
}))

router.get('/shipping', isLoggedIn, (req, res) => {
    let show = true
    if (req.user.cart.shipping.address) {
        show = true
    } else {
        show = false
    }
    const cart = req.user.cart
    res.render('payment/shipping', { show, cart })
})

router.put('/shipping', isLoggedIn, wrapAsync(async (req, res) => {
    const { address, city, state, postalCode } = req.body;
    const cart = req.user.cart
    cart.shipping = {
        address: address,
        city,
        state,
        postalCode
    }
    await req.user.save()
    res.redirect('/shipping')
}))

router.put('/payment', isLoggedIn, wrapAsync(async (req, res) => {
    const { paymentMethod } = req.body;
    req.user.cart.paymentMethod = paymentMethod;
    await req.user.save()
    res.redirect('/orderplace')
}))

router.get('/orderplace', isLoggedIn, wrapAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: "cart",
        populate: {
            path: "items",
            populate: {
                path: "foodId"
            }
        }
    })
    const cart = user.cart
    if (cart.items.length > 0) {
        res.render('payment/orderplace', { cart })
    } else {
        req.flash('error', 'cart is empty')
        res.redirect('/foods/menu')
    }
}))

router.get('/order/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params
    const order = await Order.findById(id).populate({
        path: "orderItems",
        populate: { path: "foodId" }
    })
    res.render('payment/order', { order })
}))

router.post('/order', isLoggedIn, wrapAsync(async (req, res) => {
    const cart = req.user.cart;
    const {
        shippingPrice,
        totalPrice,
        paymentMethod,
        shipping,
        items
    } = cart
    const order = new Order({
        user: req.user._id,
        orderItems: items,
        shippingAddress: shipping,
        paymentMethod: paymentMethod,
        shippingPrice: shippingPrice,
        totalPrice: totalPrice
    })
    await order.save()
    req.user.cart = {}
    await req.user.save()
    res.redirect(`/order/${order._id}`)
}))

module.exports = router