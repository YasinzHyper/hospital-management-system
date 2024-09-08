const DiagnosisDao = require('../dao/DiagnosisDao');
const logger = require('../config/logger');

class DiagnosisService {
    constructor() {
        this.diagnosisDao = new DiagnosisDao();
    }

    async addDiagnosis(diagnosisData) {
        try {
            return await this.diagnosisDao.addDiagnosis(diagnosisData);
        } catch (error) {
            logger.error('Error in addDiagnosis service:', error);
            throw error;
        }
    }

    async getPatientDiagnoses(patientId, searchParams) {
        try {
            const result = await this.diagnosisDao.getPatientDiagnoses(patientId, searchParams);
            return {
                rows: result.rows,
                count: result.count
            };
        } catch (error) {
            logger.error('Error in getPatientDiagnoses service:', error);
            throw error;
        }
    }
}

module.exports = DiagnosisService;