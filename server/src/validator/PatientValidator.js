const Joi = require('joi');
const httpStatus = require('http-status');
const ApiError = require('../helper/ApiError');

class PatientValidator {
    async patientCreateValidator(req, res, next) {
        const schema = Joi.object({
            name: Joi.string().required(),
            gender: Joi.string().valid('Male', 'Female', 'Third Gender').required(),
            age: Joi.number().integer().min(0).required(),
            weight: Joi.number().min(0),
            height: Joi.number().min(0),
            bmi: Joi.number().min(0),
            address: Joi.string().required(),
            contact1: Joi.string().required(),
            contact2: Joi.string(),
            panNo: Joi.string(),
            surgeryDetails: Joi.object({
                surgeonName: Joi.string().required(),
                surgeryName: Joi.string().required(),
                operationDate: Joi.date().required(),
                operationTime: Joi.string().required(),
                anestheticType: Joi.string().valid('Local', 'General', 'Spinal').required(),
                surgeryType: Joi.string().required(),
                implant: Joi.string(),
                others: Joi.string(),
            }).required(),
            billingInfo: Joi.object({
                dateOfAdmission: Joi.date().required(),
                timeOfAdmission: Joi.string().required(),
                numberOfDays: Joi.number().integer().min(1).required(),
                emergencyOrPlanned: Joi.string().valid('Emergency', 'Planned').required(),
                roomType: Joi.string().valid('Deluxe', 'Super Deluxe', 'Suite', 'Semi Suite').required(),
                roomNumber: Joi.string().required(),
                acceptedPackage: Joi.string(),
                paymentMode: Joi.string().valid('Cashless', 'Claim', 'Non Insurance').required(),
                insuranceName: Joi.string().when('paymentMode', { is: 'Cashless', then: Joi.required() }),
                sumAssured: Joi.number().when('paymentMode', { is: 'Cashless', then: Joi.required() }),
                advancePayment: Joi.number(),
                contactWithTPA: Joi.boolean(),
                totalAmount: Joi.number().required(),
            }).required(),
            admissionDate: Joi.date().required(),
            admissionTime: Joi.string().required(),
            surgeryDate: Joi.date().required(),
        });

        const options = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };

        const { error, value } = schema.validate(req.body, options);

        if (error) {
            const errorMessage = error.details
                .map((details) => details.message)
                .join(', ');
            return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
        }

        req.body = value;
        return next();
    }

    // ... keep other validator methods as they are
}

module.exports = PatientValidator;