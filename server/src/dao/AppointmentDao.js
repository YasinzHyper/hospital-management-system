const { Op } = require('sequelize');
const { appointment, patient } = require('../models');

class AppointmentDao {
  async create(appointmentData) {
    return appointment.create(appointmentData);
  }

  async findById(id) {
    return appointment.findByPk(id, {
      include: [{ model: patient, as: 'patient' }]
    });
  }

  async findAll(filters = {}) {
    const where = {};
    if (filters.date) {
      where.appointmentDate = {
        [Op.gte]: filters.date,
        [Op.lt]: new Date(filters.date.getTime() + 24 * 60 * 60 * 1000)
      };
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.patientId) {
      where.patientId = filters.patientId;
    }

    return appointment.findAll({
      where,
      include: [{ model: patient, as: 'patient' }],
      order: [['appointmentDate', 'ASC']]
    });
  }

  async update(id, updateData) {
    const [updatedRowsCount, updatedRows] = await appointment.update(updateData, {
      where: { id },
      returning: true
    });
    return updatedRows[0];
  }

  async delete(id) {
    return appointment.destroy({ where: { id } });
  }
}

module.exports = new AppointmentDao();