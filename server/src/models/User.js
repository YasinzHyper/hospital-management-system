const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.appointment, { foreignKey: 'doctor_id' });
        }
    }

    User.init(
        {
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                unique: true,
            },
            first_name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: DataTypes.STRING,
            role: {
                type: DataTypes.ENUM('admin', 'doctor', 'nurse', 'receptionist'),
                allowNull: false,
            },
            status: DataTypes.INTEGER,
            email_verified: DataTypes.INTEGER,
            address: DataTypes.STRING,
            phone_number: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'user',
            underscored: true,
        },
    );
    return User;
};