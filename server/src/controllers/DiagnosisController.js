const httpStatus = require('http-status');
const DiagnosisService = require('../service/DiagnosisService');
const logger = require('../config/logger');

class DiagnosisController {
    constructor() {
        this.diagnosisService = new DiagnosisService();
    }

    addDiagnosis = async (req, res) => {
        try {
            const diagnosis = await this.diagnosisService.addDiagnosis(req.body);
            res.status(httpStatus.CREATED).send(diagnosis);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_REQUEST).send(e.message);
        }
    };

    getPatientDiagnoses = async (req, res) => {
        try {
            const { 
                page,
                pageSize,
                startDate,
                endDate,
                keyword
            } = req.query;

            const patientId = req.params.patientId;

            const result = await this.diagnosisService.getPatientDiagnoses(patientId, {
                page: parseInt(page) || 1,
                pageSize: parseInt(pageSize) || 10,
                startDate,
                endDate,
                keyword
            });

            res.status(httpStatus.OK).send({
                diagnoses: result.rows,
                totalCount: result.count,
                page: parseInt(page) || 1,
                pageSize: parseInt(pageSize) || 10
            });
        } catch (e) {
            logger.error('Error in getPatientDiagnoses:', e);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e.message);
        }
    };
}

module.exports = DiagnosisController;