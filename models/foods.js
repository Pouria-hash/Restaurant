const mongoose = require('mongoose')
const { Schema } = mongoose


const foodSchema = new Schema({
    category: {
        type: String,
        enum: ['food'],
        required: true
    },
    name: { type: String, required: true },
    price: {
        type: Number,
        required: true
    },
    image: { type: String, required: true },
    qty: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
    },
    description: { type: String, required: true },
    numRating: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]

},
    {
        timestamps: true
    }
)

const Food = mongoose.model('Food', foodSchema)

module.exports = Food