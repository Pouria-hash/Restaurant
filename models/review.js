const mongoose = require('mongoose')
const { Schema } = mongoose


const reviewSchema = new Schema({
    rating: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

const Review = mongoose.model('Review', reviewSchema)


module.exports = Review