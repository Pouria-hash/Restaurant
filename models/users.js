const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')


const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    image: String,
    cart: {
        items: [{
            foodId: {
                type: Schema.Types.ObjectId,
                ref: "Food",
                required: true
            },
            qty: {
                type: Number,
                required: true
            }
        }],
        shipping: {
            address: String,
            city: String,
            state: String,
            postalCode: Number
        },
        paymentMethod: {
            type: String,
            enum: ["stripe", "paypal"],
            default: "stripe"
        },
        shippingPrice: {
            type: Number,
        },
        totalPrice: {
            type: Number,
        }
    }
})

userSchema.methods.addToCart = function (food, foodQty) {
    const existItem = this.cart.items.find(x => x.foodId.toString() === food._id.toString())
    let newQty = 1
    const updatedCartItems = [...this.cart.items]
    if (existItem) {
        const indexOfExistItem = this.cart.items.indexOf(existItem)
        // newQty = Number(this.cart.items[indexOfExistItem].qty) + Number(foodQty);
        updatedCartItems[indexOfExistItem].qty = foodQty;
    } else {
        updatedCartItems.push({
            foodId: food._id,
            qty: foodQty
        })
    }
    const updatedCart = {
        items: updatedCartItems
    }
    this.cart = updatedCart
    return this.save()
}

userSchema.methods.removeFromCart = function (itemId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item._id.toString() !== itemId.toString()
    })
    this.cart.items = updatedCartItems
    return this.save()
}

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', userSchema)

module.exports = User