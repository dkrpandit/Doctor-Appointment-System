// models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  consultationFee: {
    type: Number,
    required: true
  },
  discountPercentage: {
    type: Number,
    default: 20 // Default 20% discount for first-time patients
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// models/Patient.js
const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    transactions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// models/Appointment.js
const appointmentSchema = new mongoose.Schema({
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
  dateTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  originalFee: {
    type: Number,
    required: true
  },
  discountApplied: {
    type: Number,
    default: 0
  },
  finalFee: {
    type: Number,
    required: true
  },
  isFirstVisit: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// models/DiscountTracker.js
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

// models/Transaction.js
const transactionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = {
  Doctor: mongoose.model('Doctor', doctorSchema),
  Patient: mongoose.model('Patient', patientSchema),
  Appointment: mongoose.model('Appointment', appointmentSchema),
  DiscountTracker: mongoose.model('DiscountTracker', discountTrackerSchema),
  Transaction: mongoose.model('Transaction', transactionSchema)
};