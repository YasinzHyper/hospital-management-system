const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Patient extends Model {
        static associate(models) {
            Patient.hasMany(models.appointment, { foreignKey: 'patient_id' });
        }
    }

    Patient.init(
        {
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            gender: {
                type: DataTypes.ENUM('Male', 'Female', 'Third Gender'),
                allowNull: false,
            },
            age: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            weight: DataTypes.FLOAT,
            height: DataTypes.FLOAT,
            bmi: DataTypes.FLOAT,
            address: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            contact1: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            contact2: DataTypes.STRING,
            panNo: DataTypes.STRING,
            surgeryDetails: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            billingInfo: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            admissionDate: DataTypes.DATE,
            admissionTime: DataTypes.TIME,
            surgeryDate: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'patient',
            underscored: true,
        },
    );
    return Patient;
};