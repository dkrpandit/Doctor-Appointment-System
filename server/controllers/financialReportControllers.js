const Transaction = require('../models/Transaction');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// Get patient's financial report
const getPatientFinancialReport = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { startDate, endDate } = req.query;

        // Validate patient existence
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Create date range filter
        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Get all appointments with discount info
        const appointments = await Appointment.find({
            patient: patientId,
            ...dateFilter
        })
        .populate('doctor', 'name specialist consultationFee')
        .sort({ dateTime: -1 });

        // Get all patient's transactions
        const transactions = await Transaction.find({
            patient: patientId,
            ...dateFilter
        }).sort({ createdAt: -1 });

        // Calculate summary statistics
        const summary = {
            totalAppointments: appointments.length,
            totalSpent: transactions.reduce((sum, t) => sum + (t.type === 'debit' ? t.amount : 0), 0),
            totalDiscountsReceived: appointments.reduce((sum, a) => sum + a.discountApplied, 0),
            averageDiscountPerAppointment: appointments.length > 0 
                ? (appointments.reduce((sum, a) => sum + a.discountApplied, 0) / appointments.length).toFixed(2)
                : 0,
            currentWalletBalance: patient.wallet.balance
        };

        // Format detailed transaction history
        const transactionHistory = transactions.map(t => ({
            date: t.createdAt,
            type: t.type,
            amount: t.amount,
            description: t.description,
            balance: t.balance
        }));

        // Format appointment history with discount details
        const appointmentHistory = appointments.map(a => ({
            date: a.dateTime,
            doctorName: a.doctor.name,
            specialist: a.doctor.specialist,
            originalFee: a.originalFee,
            discountApplied: a.discountApplied,
            finalFee: a.finalFee,
            status: a.status
        }));

        res.json({
            patientName: patient.name,
            summary,
            appointmentHistory,
            transactionHistory
        });

    } catch (error) {
        console.error('Error generating patient financial report:', error);
        res.status(500).json({ 
            message: 'Error generating financial report',
            error: error.message 
        });
    }
};

// Get doctor's financial report
const getDoctorFinancialReport = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { startDate, endDate } = req.query;

        // Validate doctor existence
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Create date range filter
        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.dateTime = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Get all doctor's appointments
        const appointments = await Appointment.find({
            doctor: doctorId,
            ...dateFilter
        })
        .populate('patient', 'name')
        .sort({ dateTime: -1 });

        // Calculate summary statistics
        const totalEarnings = appointments.reduce((sum, a) => sum + a.finalFee, 0);
        const totalDiscountsGiven = appointments.reduce((sum, a) => sum + a.discountApplied, 0);
        const firstTimePatients = appointments.filter(a => a.isFirstVisit).length;

        // Group appointments by month for trend analysis
        const monthlyStats = appointments.reduce((acc, app) => {
            const month = app.dateTime.toLocaleString('default', { month: 'long', year: 'numeric' });
            if (!acc[month]) {
                acc[month] = {
                    appointments: 0,
                    earnings: 0,
                    discounts: 0
                };
            }
            acc[month].appointments += 1;
            acc[month].earnings += app.finalFee;
            acc[month].discounts += app.discountApplied;
            return acc;
        }, {});

        // Calculate discount statistics
        const discountStats = {
            totalDiscountsGiven,
            averageDiscountPerAppointment: appointments.length > 0 
                ? (totalDiscountsGiven / appointments.length).toFixed(2)
                : 0,
            firstTimePatients,
            discountPercentage: doctor.discountPercentage
        };

        // Format appointment history
        const appointmentHistory = appointments.map(a => ({
            date: a.dateTime,
            patientName: a.patient.name,
            originalFee: a.originalFee,
            discountApplied: a.discountApplied,
            finalFee: a.finalFee,
            isFirstVisit: a.isFirstVisit,
            status: a.status
        }));

        res.json({
            doctorName: doctor.name,
            specialist: doctor.specialist,
            summary: {
                totalAppointments: appointments.length,
                totalEarnings,
                averageEarningPerAppointment: appointments.length > 0 
                    ? (totalEarnings / appointments.length).toFixed(2)
                    : 0,
                firstTimePatients
            },
            discountStats,
            monthlyStats,
            appointmentHistory
        });

    } catch (error) {
        console.error('Error generating doctor financial report:', error);
        res.status(500).json({ 
            message: 'Error generating financial report',
            error: error.message 
        });
    }
};

module.exports = {
    getPatientFinancialReport,
    getDoctorFinancialReport
};