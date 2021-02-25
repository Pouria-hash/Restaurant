const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync')
const Food = require('../models/foods')
const User = require('../models/users')
const Order = require('../models/order')
const ExpressError = require('../utils/ExpressError')
const { isLoggedIn, isAdmin } = require('../utils/middleware')

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

const stripe = require('stripe')("sk_test_51INFNJBt4WY41fkQH2qG03y6FB3xVXKx8u2YWN3mFAr9KVKOnlXRbbA429Vml57zSyyNnOQfL8aJ5CW5Tim5xNni00cLPvTZ6o")
const YOUR_DOMAIN = 'http://localhost:3000'

router.get('/create-checkout-session/:orderId', isLoggedIn, wrapAsync(async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate({
        path: "orderItems",
        populate: {
            path: "foodId"
        }
    })


    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: req.user.email,
        client_reference_id: orderId,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: "order",
                        images: [order.orderItems[0].foodId.image],
                    },
                    unit_amount: order.totalPrice * 100,
                },
                quantity: 1
            },
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/order/${orderId}/success`,
        cancel_url: `${req.protocol}://${req.get('host')}/order/`,
    });

    res.status(200).json(session)
}))

router.get('/order/:id/success', isLoggedIn, wrapAsync(async (req, res) => {

    const order = await Order.findById(req.params.id)
    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        await order.save()
        res.redirect(`/order/${req.params.id}`)
    } else {
        throw new Error('Order not found')
    }

}))


module.exports = router