const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const Order = require('../models/order')
const User = require('../models/users')
const ExpressError = require('../utils/ExpressError')
const { isLoggedIn, isAdmin } = require('../utils/middleware')


router.get('/', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const orders = await Order.find({})
    res.render('admin/orders', { orders })
}))

router.put('/:id/delivered', isLoggedIn, isAdmin, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id)
    order.isDelivered = true
    order.deliveredAt = Date.now()
    await order.save()
    res.redirect('/admin/orders')
}))


module.exports = router