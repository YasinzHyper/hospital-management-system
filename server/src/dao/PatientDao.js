const { Op } = require('sequelize');
const SuperDao = require('./SuperDao');
const models = require('../models');
const logger = require('../config/logger');

const Patient = models.patient;

class PatientDao extends SuperDao {
    constructor() {
        super(Patient);
    }

    /**
     * Find a patient by name
     * @param {string} name - The name of the patient
     * @returns {Promise<Patient>}
     */
    async findByName(name) {
        return Patient.findOne({ where: { name } });
    }

    /**
     * Find patients by surgery date
     * @param {Date} date - The surgery date
     * @returns {Promise<Patient[]>}
     */
    async findBySurgeryDate(date) {
        return Patient.findAll({ where: { surgeryDate: date } });
    }

    /**
     * Search patients with various criteria
     * @param {Object} params - Search parameters
     * @param {string} [params.name] - Patient name
     * @param {string} [params.contact] - Contact number
     * @param {string} [params.panNo] - PAN number
     * @param {Date} [params.admissionDateStart] - Admission date start range
     * @param {Date} [params.admissionDateEnd] - Admission date end range
     * @param {Date} [params.surgeryDateStart] - Surgery date start range
     * @param {Date} [params.surgeryDateEnd] - Surgery date end range
     * @param {number} [params.page=1] - Page number for pagination
     * @param {number} [params.pageSize=10] - Number of items per page
     * @param {string} [params.sortField='createdAt'] - Field to sort by
     * @param {string} [params.sortOrder='DESC'] - Sort order ('ASC' or 'DESC')
     * @returns {Promise<{rows: Patient[], count: number}>}
     */
    async searchPatients(params) {
        const {
          page = 1,
          pageSize = 10,
          sortField = 'createdAt',
          sortOrder = 'DESC',
          name,
          contact1,
          panNo,
          gender,
          admissionDateStart,
          admissionDateEnd,
          surgeryDateStart,
          surgeryDateEnd
        } = params;
    
        const whereClause = {};
    
        if (name) {
          whereClause.name = { [Op.like]: `%${name}%` };
        }
        if (contact1) {
          whereClause.contact1 = { [Op.like]: `%${contact1}%` };
        }
        if (panNo) {
          whereClause.panNo = { [Op.like]: `%${panNo}%` };
        }
        if (gender) {
          whereClause.gender = gender;
        }
        if (admissionDateStart && admissionDateEnd) {
          whereClause.admissionDate = { [Op.between]: [admissionDateStart, admissionDateEnd] };
        }
        if (surgeryDateStart && surgeryDateEnd) {
          whereClause.surgeryDate = { [Op.between]: [surgeryDateStart, surgeryDateEnd] };
        }
    
        // Validate sortField to prevent SQL injection
        const validSortFields = ['name', 'age', 'admissionDate', 'surgeryDate', 'createdAt', 'updatedAt'];
        const actualSortField = validSortFields.includes(sortField) ? sortField : 'createdAt';
    
        // Validate sortOrder
        const actualSortOrder = sortOrder === 'ASC' ? 'ASC' : 'DESC';
    
        const order = [[actualSortField, actualSortOrder]];
    
        try {
          const result = await Patient.findAndCountAll({
            where: whereClause,
            order,
            limit: pageSize,
            offset: (page - 1) * pageSize
          });
    
          return {
            rows: result.rows,
            count: result.count
          };
        } catch (error) {
          console.error('Error in searchPatients:', error);
          throw error;
        }
      }

    /**
     * Find patients by contact number
     * @param {string} contact - Contact number
     * @returns {Promise<Patient[]>}
     */
    async findByContactNumber(contact) {
        return Patient.findAll({
            where: {
                [Op.or]: [
                    { contact1: contact },
                    { contact2: contact }
                ]
            }
        });
    }

    /**
     * Find a patient by PAN number
     * @param {string} panNo - PAN number
     * @returns {Promise<Patient>}
     */
    async findByPanNo(panNo) {
        return Patient.findOne({ where: { panNo } });
    }

    /**
     * Find patients by admission date range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<Patient[]>}
     */
    async findByAdmissionDateRange(startDate, endDate) {
        return Patient.findAll({
            where: {
                admissionDate: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
    }
    async updateById(id, data) {
        try {
            logger.info(`Attempting to update patient with ID: ${id}`);
            const [updatedRowsCount, updatedRows] = await Patient.update(data, {
                where: { id: id },
                returning: true
            });
            logger.info(`Update result: ${updatedRowsCount} rows affected`);
            return [updatedRowsCount, updatedRows];
        } catch (error) {
            logger.error(`Error in PatientDao.updateById: ${error.message}`);
            throw error;
        }
    }
    /**
     * Find patients by surgery date range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<Patient[]>}
     */
    async findBySurgeryDateRange(startDate, endDate) {
        return Patient.findAll({
            where: {
                surgeryDate: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
    }

    /**
     * Find patients by age range
     * @param {number} minAge - Minimum age
     * @param {number} maxAge - Maximum age
     * @returns {Promise<Patient[]>}
     */
    async findByAgeRange(minAge, maxAge) {
        return Patient.findAll({
            where: {
                age: {
                    [Op.between]: [minAge, maxAge]
                }
            }
        });
    }

    /**
     * Find patients by BMI range
     * @param {number} minBMI - Minimum BMI
     * @param {number} maxBMI - Maximum BMI
     * @returns {Promise<Patient[]>}
     */
    async findByBMIRange(minBMI, maxBMI) {
        return Patient.findAll({
            where: {
                bmi: {
                    [Op.between]: [minBMI, maxBMI]
                }
            }
        });
    }
}

module.exports = PatientDao;