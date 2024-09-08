const express = require('express');
const PatientController = require('../controllers/PatientController');
const PatientValidator = require('../validator/PatientValidator');
const auth = require('../middlewares/auth');

const router = express.Router();

const patientController = new PatientController();
const patientValidator = new PatientValidator();

router.post('/', auth(['admin', 'doctor', 'nurse']), patientValidator.patientCreateValidator, patientController.createPatient);
router.get('/', auth(['admin', 'doctor', 'nurse']), patientController.searchPatients);
router.get('/:id', auth(['admin', 'doctor', 'nurse']), patientController.getPatientById);
router.put('/:id', auth(['admin', 'doctor', 'nurse']), patientValidator.patientCreateValidator, patientController.updatePatient);
router.delete('/:id', auth(['admin', 'doctor']), patientController.deletePatient);

module.exports = router;