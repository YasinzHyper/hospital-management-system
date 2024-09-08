const httpStatus = require('http-status');
const AppointmentService = require('../service/AppointmentService');
const logger = require('../config/logger');

class AppointmentController {
  async createAppointment(req, res) {
    try {
      const appointment = await AppointmentService.createAppointment(req.body);
      res.status(httpStatus.CREATED).json(appointment);
    } catch (error) {
      logger.error('Error in createAppointment controller:', error);
      res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getAppointmentById(req, res) {
    try {
      const appointment = await AppointmentService.getAppointmentById(req.params.id);
      if (!appointment) {
        return res.status(httpStatus.NOT_FOUND).json({ message: 'Appointment not found' });
      }
      res.status(httpStatus.OK).json(appointment);
    } catch (error) {
      logger.error(`Error in getAppointmentById controller for id ${req.params.id}:`, error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  async getAllAppointments(req, res) {
    try {
      const filters = {
        date: req.query.date ? new Date(req.query.date) : null,
        status: req.query.status,
        doctorId: req.query.doctorId,
        patientId: req.query.patientId
      };
      const appointments = await AppointmentService.getAllAppointments(filters);
      res.status(httpStatus.OK).json(appointments);
    } catch (error) {
      logger.error('Error in getAllAppointments controller:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  async updateAppointment(req, res) {
    try {
      const updatedAppointment = await AppointmentService.updateAppointment(req.params.id, req.body);
      if (!updatedAppointment) {
        return res.status(httpStatus.NOT_FOUND).json({ message: 'Appointment not found' });
      }
      res.status(httpStatus.OK).json(updatedAppointment);
    } catch (error) {
      logger.error(`Error in updateAppointment controller for id ${req.params.id}:`, error);
      res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteAppointment(req, res) {
    try {
      const result = await AppointmentService.deleteAppointment(req.params.id);
      if (!result) {
        return res.status(httpStatus.NOT_FOUND).json({ message: 'Appointment not found' });
      }
      res.status(httpStatus.NO_CONTENT).send();
    } catch (error) {
      logger.error(`Error in deleteAppointment controller for id ${req.params.id}:`, error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}

module.exports = new AppointmentController();