const mongoose = require('mongoose')
//const validator = require('validator')

var TourSchema = new mongoose.Schema({
    tour_name: {
        type: String,
        required: true,
        trim: true
    },
    start_date: {
        type: String,
        required: true,
        trim: true,
    },
    duration: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Duration must be a postive number')
            }
        }
    },
    cost: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Cost must be a postive number')
            }
        }
    },
    Guide: { 
        required: true,
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Guide' 
    },
    path: {
        type: Array,
        memebers :{name : String, country: String }
    }
}, { timestamps: true }
);

const Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour