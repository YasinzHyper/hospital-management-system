const SuperDao = require('./SuperDao');
const models = require('../models');

const User = models.user;

class UserDao extends SuperDao {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        console.log('Finding user by email:', email);
        const user = await User.findOne({ where: { email } });
        console.log('User found:', user);
        return user;
    }

    async isEmailExists(email) {
        return User.count({ where: { email } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }

    async createWithTransaction(user, transaction) {
        return User.create(user, { transaction });
    }

    async findOneByWhere(where) {
        try {
            return await User.findOne({ where });
        } catch (error) {
            console.error('Error in findOneByWhere:', error);
            throw error;
        }
    }
}

module.exports = UserDao;
