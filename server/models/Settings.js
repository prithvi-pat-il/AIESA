const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    main_event_name: {
        type: String,
        default: 'AIESA Annual Event'
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

module.exports = mongoose.model('Settings', settingsSchema);
