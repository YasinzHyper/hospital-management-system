const SuperDao = require('./SuperDao');
const models = require('../models');

const Token = models.token;

class TokenDao extends SuperDao {
    constructor() {
        super(Token);
    }

    async remove(where) {
        return Token.destroy({ where });
    }
    async findOne(where) {
        return Token.findOne({ where });
    }

    async create(tokenData) {
        return Token.create(tokenData);
    }
    async deleteByToken(token) {
        console.log('Deleting token:', token);
        const result = await Token.destroy({ where: { token } });
        console.log('Delete result:', result);
        return result;
    }
}

module.exports = TokenDao;
