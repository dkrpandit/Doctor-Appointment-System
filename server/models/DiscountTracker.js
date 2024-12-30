const mongoose = require('mongoose');
const discountTrackerSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  discountUsed: {
    type: Boolean,
    default: false
  },
  usedAt: {
    type: Date
  }
});
// Create a compound unique index to ensure one discount per doctor-patient pair
discountTrackerSchema.index({ doctor: 1, patient: 1 }, { unique: true });

module.exports = mongoose.model('DiscountTracker', discountTrackerSchema);