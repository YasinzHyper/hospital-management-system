const httpStatus = require('http-status');
const PatientService = require('../service/PatientService');
const logger = require('../config/logger');

class PatientController {
    constructor() {
        this.patientService = new PatientService();
    }

    createPatient = async (req, res) => {
        try {
            const patient = await this.patientService.createPatient(req.body);
            res.status(httpStatus.CREATED).send(patient);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_REQUEST).send(e.message);
        }
    };

    searchPatients = async (req, res) => {
        try {
          const { 
            page,
            pageSize,
            sortField,
            sortOrder,
            name,
            contact1,
            panNo,
            gender,
            admissionDateStart,
            admissionDateEnd,
            surgeryDateStart,
            surgeryDateEnd
          } = req.query;
    
          const result = await this.patientService.searchPatients({
            page: parseInt(page) || 1,
            pageSize: parseInt(pageSize) || 10,
            sortField: sortField || 'createdAt',
            sortOrder: sortOrder || 'DESC',
            name,
            contact1,
            panNo,
            gender,
            admissionDateStart,
            admissionDateEnd,
            surgeryDateStart,
            surgeryDateEnd
          });
    
          res.status(httpStatus.OK).send({
            patients: result.rows,
            totalCount: result.count,
            page: parseInt(page) || 1,
            pageSize: parseInt(pageSize) || 10
          });
        } catch (e) {
          logger.error('Error in searchPatients:', e);
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e.message);
        }
      };

    getPatientById = async (req, res) => {
        try {
            const patient = await this.patientService.getPatientById(req.params.id);
            if (!patient) {
                return res.status(httpStatus.NOT_FOUND).send('Patient not found');
            }
            res.status(httpStatus.OK).send(patient);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_REQUEST).send(e.message);
        }
    };

    updatePatient = async (req, res) => {
        try {
            const patient = await this.patientService.updatePatient(req.params.id, req.body);
            if (!patient) {
                return res.status(httpStatus.NOT_FOUND).send('Patient not found');
            }
            res.status(httpStatus.OK).send(patient);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_REQUEST).send(e.message);
        }
    };

    deletePatient = async (req, res) => {
        try {
            const result = await this.patientService.deletePatient(req.params.id);
            if (!result) {
                return res.status(httpStatus.NOT_FOUND).send('Patient not found');
            }
            res.status(httpStatus.NO_CONTENT).send();
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_REQUEST).send(e.message);
        }
    };
}

module.exports = PatientController;