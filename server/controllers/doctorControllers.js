const Doctor = require('../models/Doctor');
const generateToken = require('../utils/generateToken');

const registerDoctor = async (req, res) => {
    try {
        const { name, email, password, specialist, experience, introduction, consultationFee, discountPercentage, userType } = req.body;
        if (!userType || !['doctor', 'patient'].includes(userType)) {
            return res.status(400).json({ message: 'Invalid user type' });
        }
        // Check if the doctor already exists
        const doctorExists = await Doctor.findOne({ email });

        if (doctorExists) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // Create a new doctor
        const doctor = await Doctor.create({
            name,
            email,
            password,
            specialist,
            experience,
            introduction,
            consultationFee,
            discountPercentage
        });
        const tokenData = { _id: doctor._id, userType: userType }
        if (doctor) {
            res.status(201).json({
                name: doctor.name,
                token: generateToken(tokenData)
            });
        } else {
            res.status(400).json({ message: 'Invalid doctor data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginDoctor = async (req, res) => {
    try {
        const { email, password, userType } = req.body;
        if (!userType || !['doctor', 'patient'].includes(userType)) {
            return res.status(400).json({ message: 'Invalid user type' });
        }
        // Check if the doctor exists
        const doctor = await Doctor.findOne({ email });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Check if the password matches
        const isPasswordMatch = await doctor.matchPassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate and return a JWT token
        const tokenData = { _id: doctor._id, userType: userType }
        res.status(200).json({
            name: doctor.name,
            token: generateToken(tokenData),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getDoctors = async (req, res) => {
    try {
        // Fetch all doctors from the database
        const doctors = await Doctor.find({});

        // Check if any doctors exist
        if (!doctors || doctors.length === 0) {
            return res.status(404).json({ message: 'No doctors found' });
        }

        // Respond with the list of doctors
        res.status(200).json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { registerDoctor, loginDoctor, getDoctors };
