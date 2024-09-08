const { Op } = require('sequelize');
const SuperDao = require('./SuperDao');
const models = require('../models');
const logger = require('../config/logger');

const Diagnosis = models.diagnosis_summary;

class DiagnosisDao extends SuperDao {
    constructor() {
        super(Diagnosis);
    }

    /**
     * Add a new diagnosis summary for a patient
     * @param {Object} diagnosisData - The diagnosis data
     * @returns {Promise<Diagnosis>}
     */
    async addDiagnosis(diagnosisData) {
        return Diagnosis.create(diagnosisData);
    }

    /**
     * Get diagnosis summaries for a patient with filtering and search
     * @param {number} patientId - The patient's ID
     * @param {Object} params - Search and filter parameters
     * @param {Date} [params.startDate] - Start date for filtering
     * @param {Date} [params.endDate] - End date for filtering
     * @param {string} [params.keyword] - Keyword for searching in summary and medications
     * @param {number} [params.page=1] - Page number for pagination
     * @param {number} [params.pageSize=10] - Number of items per page
     * @returns {Promise<{rows: Diagnosis[], count: number}>}
     */
    async getPatientDiagnoses(patientId, params) {
        const {
            startDate,
            endDate,
            keyword,
            page = 1,
            pageSize = 10
        } = params;

        const whereClause = { patient_id: patientId };

        if (startDate && endDate) {
            whereClause.createdAt = { [Op.between]: [startDate, endDate] };
        }

        if (keyword) {
            whereClause[Op.or] = [
                { summary: { [Op.like]: `%${keyword}%` } },
                { medications: { [Op.like]: `%${keyword}%` } }
            ];
        }

        try {
            const result = await Diagnosis.findAndCountAll({
                where: whereClause,
                order: [['createdAt', 'DESC']],
                limit: pageSize,
                offset: (page - 1) * pageSize
            });

            return {
                rows: result.rows,
                count: result.count
            };
        } catch (error) {
            logger.error('Error in getPatientDiagnoses:', error);
            throw error;
        }
    }
}

module.exports = DiagnosisDao;