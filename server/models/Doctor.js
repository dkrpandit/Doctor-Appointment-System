const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const doctorSchema = new mongoose.Schema({
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
    specialist: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    introduction: {
        type: String,
        required: true
    },
    consultationFee: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    discountPercentage: {
        type: Number,
        default: 20
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash the password before saving
doctorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare passwords
doctorSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Doctor', doctorSchema);
