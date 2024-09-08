const jwt = require('jsonwebtoken');
const moment = require('moment');
const { Op } = require('sequelize');
const config = require('../config/config');
const { tokenTypes } = require('../config/tokens');
const TokenDao = require('../dao/TokenDao');
const RedisService = require('./RedisService');

class TokenService {
    constructor() {
        this.tokenDao = new TokenDao();
        this.redisService = new RedisService();
    }


    /**
     * Save a multiple token
     * @param {Object} tokens
     * @returns {Promise<Token>}
     */

    saveMultipleTokens = async (tokens) => {
        return this.tokenDao.bulkCreate(tokens);
    };

    removeTokenById = async (id) => {
        return this.tokenDao.remove({ id });
    };


    generateToken(userUuid, expires, type, secret = config.jwt.secret) {
        if (!userUuid) {
            throw new Error('User UUID is required to generate a token');
        }
        const payload = {
            sub: userUuid,
            iat: moment().unix(),
            exp: expires.unix(),
            type,
        };
        return jwt.sign(payload, secret);
    }

    async generateAuthTokens(user) {
        if (!user || !user.uuid) {
            throw new Error('Valid user object with UUID is required to generate auth tokens');
        }
        const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
        const accessToken = this.generateToken(user.uuid, accessTokenExpires, tokenTypes.ACCESS);

        const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
        const refreshToken = this.generateToken(user.uuid, refreshTokenExpires, tokenTypes.REFRESH);

        await this.saveToken(accessToken, user.uuid, accessTokenExpires, tokenTypes.ACCESS);
        await this.saveToken(refreshToken, user.uuid, refreshTokenExpires, tokenTypes.REFRESH);

        return {
            access: {
                token: accessToken,
                expires: accessTokenExpires.toDate(),
            },
            refresh: {
                token: refreshToken,
                expires: refreshTokenExpires.toDate(),
            },
        };
    }

    async saveToken(token, userUuid, expires, type, blacklisted = false) {
        const tokenDoc = await this.tokenDao.create({
            token,
            user_uuid: userUuid,
            expires: expires.toDate(),
            type,
            blacklisted,
        });
        return tokenDoc;
    }

    async verifyToken(token, type) {
        try {
            const payload = jwt.verify(token, config.jwt.secret);
            const tokenDoc = await this.tokenDao.findOne({
                token,
                type,
                user_uuid: payload.sub,
                blacklisted: false,
            });
            if (!tokenDoc) {
                throw new Error('Token not found');
            }
            return tokenDoc;
        } catch (error) {
            throw new Error('Token verification failed');
        }
    }
}

module.exports = TokenService;
