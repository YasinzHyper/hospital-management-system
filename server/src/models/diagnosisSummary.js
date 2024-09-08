const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DiagnosisSummary extends Model {
    static associate(models) {
      DiagnosisSummary.belongsTo(models.patient, { foreignKey: 'patient_id' });
    }
  }

  DiagnosisSummary.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      medications: {
        type: DataTypes.JSON,  // Change this to JSON type
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'diagnosis_summary',
      underscored: true,
    }
  );

  return DiagnosisSummary;
};