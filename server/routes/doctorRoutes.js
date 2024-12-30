const express = require('express');
const router = express.Router();
const { registerDoctor, loginDoctor ,getDoctors} = require('../controllers/doctorControllers');

router.post('/register', registerDoctor);
router.post('/login', loginDoctor);
router.get('/get-doctors', getDoctors);

module.exports = router;