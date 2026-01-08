const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'member',
        enum: ['admin', 'member']
    },
    insta_id: {
        type: String
    },
    post: {
        type: String
    },
    profile_image: {
        type: String
    },
    order_index: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

module.exports = mongoose.model('User', userSchema);
