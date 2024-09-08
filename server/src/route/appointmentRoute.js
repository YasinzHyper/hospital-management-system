const express = require('express');
const AppointmentController = require('../controllers/AppointmentController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/', auth(['admin', 'doctor', 'nurse']), AppointmentController.createAppointment);
router.get('/', auth(['admin', 'doctor', 'nurse']), AppointmentController.getAllAppointments);
router.get('/:id', auth(['admin', 'doctor', 'nurse']), AppointmentController.getAppointmentById);
router.put('/:id', auth(['admin', 'doctor', 'nurse']), AppointmentController.updateAppointment);
router.delete('/:id', auth(['admin', 'doctor']), AppointmentController.deleteAppointment);

module.exports = router;