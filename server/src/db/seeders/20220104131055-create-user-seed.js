const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('users', [
            {
                uuid: uuidv4(),
                first_name: 'John',
                last_name: 'Doe',
                email: 'user@example.com',
                role: 'admin',
                status: 1,
                email_verified: 1,
                password: bcrypt.hashSync('123456', 8),
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                uuid: uuidv4(),
                first_name: 'Jane',
                last_name: 'Smith',
                email: 'doctor@example.com',
                role: 'doctor',
                status: 1,
                email_verified: 1,
                password: bcrypt.hashSync('123456', 8),
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                uuid: uuidv4(),
                first_name: 'Alice',
                last_name: 'Johnson',
                email: 'nurse@example.com',
                role: 'nurse',
                status: 1,
                email_verified: 1,
                password: bcrypt.hashSync('123456', 8),
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', null, {});
    },
};
