const PatientDao = require('../dao/PatientDao');
const logger = require('../config/logger');

class PatientService {
    constructor() {
        this.patientDao = new PatientDao();
    }

    async createPatient(patientData) {
        return this.patientDao.create(patientData);
    }

    async searchPatients(searchParams) {
        try {
            const result = await this.patientDao.searchPatients(searchParams);
            return {
                rows: result.rows,
                count: result.count
            };
        } catch (error) {
            logger.error('Error in searchPatients service:', error);
            throw error;
        }
    }

    async getPatientById(id) {
        return this.patientDao.findById(id);
    }

    async deletePatient(id) {
        const deletedCount = await this.patientDao.deleteByWhere({ id });
        return deletedCount > 0; // Return true if a patient was deleted, false otherwise
    }

    async findByName(name) {
        return this.patientDao.findByName(name);
    }

    async findByContactNumber(contact) {
        return this.patientDao.findByContactNumber(contact);
    }

    async findByPanNo(panNo) {
        return this.patientDao.findByPanNo(panNo);
    }

    async findByAdmissionDateRange(startDate, endDate) {
        return this.patientDao.findByAdmissionDateRange(startDate, endDate);
    }

    async findBySurgeryDateRange(startDate, endDate) {
        return this.patientDao.findBySurgeryDateRange(startDate, endDate);
    }

    async findByAgeRange(minAge, maxAge) {
        return this.patientDao.findByAgeRange(minAge, maxAge);
    }

    async findByBMIRange(minBMI, maxBMI) {
        return this.patientDao.findByBMIRange(minBMI, maxBMI);
    }
    async updatePatient(id, patientData) {
        try {
            logger.info(`Attempting to update patient with ID: ${id}`);
            const updatedPatient = await this.patientDao.updateById(id, patientData);
            logger.info(`Update result: ${JSON.stringify(updatedPatient)}`);
            if (updatedPatient[0] === 0) {
                logger.warn(`No patient found with ID: ${id}`);
                return null;
            }
            const patient = await this.getPatientById(id);
            logger.info(`Updated patient: ${JSON.stringify(patient)}`);
            return patient;
        } catch (error) {
            logger.error(`Error updating patient with ID ${id}: ${error.message}`);
            throw error;
        }
    }
}

module.exports = PatientService;