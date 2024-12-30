const express = require('express');
const router = express.Router();
const { getPatientFinancialReport, getDoctorFinancialReport } = require('../controllers/financialReportControllers');

router.get('/patient/:patientId', getPatientFinancialReport);
router.get('/doctor/:doctorId', getDoctorFinancialReport);

module.exports = router;