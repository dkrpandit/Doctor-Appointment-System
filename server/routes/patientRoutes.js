const express = require('express');
const router = express.Router();
const { registerPatient, loginPatient,addMoney } = require('../controllers/patientControllers');

router.post('/register', registerPatient);
router.post('/login', loginPatient);
router.post('/add-money', addMoney);

module.exports = router;