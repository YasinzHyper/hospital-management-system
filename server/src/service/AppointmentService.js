const AppointmentDao = require('../dao/AppointmentDao');
const logger = require('../config/logger');

class AppointmentService {
  async createAppointment(appointmentData) {
    try {
      return await AppointmentDao.create(appointmentData);
    } catch (error) {
      logger.error('Error in createAppointment service:', error);
      throw error;
    }
  }

  async getAppointmentById(id) {
    try {
      return await AppointmentDao.findById(id);
    } catch (error) {
      logger.error(`Error in getAppointmentById service for id ${id}:`, error);
      throw error;
    }
  }

  async getAllAppointments(filters) {
    try {
      return await AppointmentDao.findAll(filters);
    } catch (error) {
      logger.error('Error in getAllAppointments service:', error);
      throw error;
    }
  }

  async updateAppointment(id, updateData) {
    try {
      return await AppointmentDao.update(id, updateData);
    } catch (error) {
      logger.error(`Error in updateAppointment service for id ${id}:`, error);
      throw error;
    }
  }

  async deleteAppointment(id) {
    try {
      return await AppointmentDao.delete(id);
    } catch (error) {
      logger.error(`Error in deleteAppointment service for id ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new AppointmentService();