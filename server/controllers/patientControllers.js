const Patient = require('../models/Patient');
const generateToken = require('../utils/generateToken');
const Transaction = require('../models/Transaction');
// Register a new patient
const registerPatient = async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    if (!userType || !['doctor', 'patient'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }
    // Check if the patient already exists
    const patientExists = await Patient.findOne({ email });
    if (patientExists) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Create a new patient
    const patient = await Patient.create({
      name,
      email,
      password,
    });
    const tokenData = { _id: patient._id, userType: userType }
    if (patient) {
      res.status(201).json({
        name: patient.name,
        token: generateToken(tokenData)
      });
    } else {
      res.status(400).json({ message: 'Invalid patient data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login a patient
const loginPatient = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!userType || !['doctor', 'patient'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }
    // Check if the patient exists
    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' }); // Corrected error message
    }

    // Check if the password matches
    const isPasswordMatch = await patient.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate and return a JWT token
    const tokenData = { _id: patient._id, userType: userType }
    res.status(200).json({
      name: patient.name,
      token: generateToken(tokenData),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addMoney = async (req, res) => {
  try {
    const { id, amount, description } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount should be greater than zero" });
    }

    // Find patient by ID
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Calculate new wallet balance
    const newBalance = patient.wallet.balance + amount;

    // Create a new transaction
    const transaction = new Transaction({
      patient: id,
      type: 'credit',
      amount,
      description: description || 'Money added to wallet',
      balance: newBalance,
    });

    // Save the transaction
    const savedTransaction = await transaction.save();

    // Push the transaction's ObjectId to the patient's wallet.transactions array
    patient.wallet.transactions.push(savedTransaction._id);

    // Update the wallet balance
    patient.wallet.balance = newBalance;

    // Save the updated patient document
    await patient.save();

    // Respond with success
    res.status(200).json({
      message: "Money added successfully",
      wallet: patient.wallet,
      transaction: savedTransaction,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};





module.exports = { registerPatient, loginPatient, addMoney };
