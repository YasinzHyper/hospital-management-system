const express = require('express');
const DiagnosisController = require('../controllers/DiagnosisController');
const auth = require('../middlewares/auth');

const router = express.Router();

const diagnosisController = new DiagnosisController();

router.post('/', auth(['doctor']), diagnosisController.addDiagnosis);
router.get('/patient/:patientId', auth(['doctor', 'nurse']), diagnosisController.getPatientDiagnoses);

module.exports = router;