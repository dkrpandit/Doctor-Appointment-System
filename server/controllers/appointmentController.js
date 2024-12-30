const Appointment = require('../models/Appointment');
const DiscountTracker = require('../models/DiscountTracker');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Transaction = require('../models/Transaction');

const createAppointment = async (req, res) => {
    try {
        const { doctorId, patientId, dateTime } = req.body;

        // Validate required fields
        if (!doctorId || !patientId || !dateTime) {
            return res.status(400).json({
                message: 'Missing required fields: doctorId, patientId, and dateTime are required'
            });
        }

        // Validate date format and ensure it's in the future
        const appointmentDate = new Date(dateTime);
        if (isNaN(appointmentDate) || appointmentDate < new Date()) {
            return res.status(400).json({
                message: 'Invalid date or date is in the past'
            });
        }

        // Check if doctor exists and is available
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        if (!doctor.available) {
            return res.status(400).json({ message: 'Doctor is not available for appointments' });
        }

        // Check if patient exists
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Check for existing appointments at the same time
        const existingAppointment = await Appointment.findOne({
            doctor: doctorId,
            dateTime: appointmentDate,
            status: { $ne: 'cancelled' }
        });

        if (existingAppointment) {
            return res.status(409).json({
                message: 'Doctor already has an appointment at this time'
            });
        }

        // Calculate fees and check discount eligibility
        const originalFee = doctor.consultationFee;
        let discountApplied = 0;
        let finalFee = originalFee;
        let isFirstVisit = false;

        // Check for existing discount tracker
        const discountTracker = await DiscountTracker.findOne({ 
            doctor: doctorId, 
            patient: patientId 
        });

        if (!discountTracker) {
            // First visit - create tracker and apply discount
            isFirstVisit = true;
            const newDiscountTracker = new DiscountTracker({
                doctor: doctorId,
                patient: patientId,
                discountUsed: true,
                usedAt: new Date()
            });
            await newDiscountTracker.save();

            // Calculate discount
            discountApplied = (originalFee * doctor.discountPercentage) / 100;
            finalFee = originalFee - discountApplied;
        }

        // Check if patient has sufficient balance
        if (patient.wallet.balance < finalFee) {
            return res.status(400).json({
                message: 'Insufficient wallet balance',
                required: finalFee,
                available: patient.wallet.balance
            });
        }

        // Create and save the appointment
        const appointment = new Appointment({
            doctor: doctorId,
            patient: patientId,
            dateTime: appointmentDate,
            originalFee,
            discountApplied,
            finalFee,
            isFirstVisit,
            status: 'scheduled'
        });

        await appointment.save();

        // Create transaction record
        const transaction = new Transaction({
            patient: patientId,
            appointment: appointment._id,
            type: 'debit',
            amount: finalFee,
            description: `Appointment booking with Dr. ${doctor.name} (${doctor.specialist})`,
            balance: patient.wallet.balance - finalFee
        });

        await transaction.save();

        // Update patient wallet
        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId,
            { 
                $inc: { 'wallet.balance': -finalFee },
                $push: { 'wallet.transactions': transaction._id }
            },
            { new: true }
        );

        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment: {
                id: appointment._id,
                doctorName: doctor.name,
                specialist: doctor.specialist,
                dateTime: appointment.dateTime,
                originalFee,
                discountApplied,
                finalFee,
                isFirstVisit,
                walletBalanceRemaining: updatedPatient.wallet.balance
            }
        });

    } catch (error) {
        console.error('Appointment creation error:', error);
        
        // Handle duplicate key error for DiscountTracker
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Discount tracker already exists for this doctor-patient pair'
            });
        }

        res.status(500).json({ 
            message: 'Error creating appointment',
            error: error.message 
        });
    }
};

// Get all appointments
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('doctor')
            .populate('patient');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
};

// Get a single appointment by ID
const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findById(id)
            .populate('doctor')
            .populate('patient');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointment', error });
    }
};

// Update an appointment
const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const appointment = await Appointment.findByIdAndUpdate(id, updatedData, { new: true });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating appointment', error });
    }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findByIdAndDelete(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting appointment', error });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
};