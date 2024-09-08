const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const UserDao = require('../dao/UserDao');
const TokenDao = require('../dao/TokenDao');
const { tokenTypes } = require('../config/tokens');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const RedisService = require('./RedisService');

class AuthService {
    constructor() {
        this.userDao = new UserDao();
        this.tokenDao = new TokenDao();
        this.redisService = new RedisService();
    }

    /**
     * Create a user
     * @param {String} email
     * @param {String} password
     * @returns {Promise<{response: {code: *, message: *, status: boolean}, statusCode: *}>}
     */
    async loginWithEmailPassword(email, password) {
        console.log('Attempting login for email:', email);
        const user = await this.userDao.findByEmail(email);
        
        if (!user) {
            console.log('No user found with email:', email);
            throw new Error('No user found with this email');
        }
        
        console.log('User found:', user);
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid password for user:', email);
            throw new Error('Invalid password');
        }
        
        if (!user.uuid) {
            console.error('User object is missing UUID:', user);
            throw new Error('User object is missing UUID');
        }
        
        return user;
    }

    async logout(accessToken, refreshToken) {
        console.log('Logging out - Access Token:', accessToken);
        console.log('Logging out - Refresh Token:', refreshToken);

        if (!accessToken || !refreshToken) {
            throw new Error('Both access token and refresh token are required for logout');
        }

        const accessTokenDoc = await this.tokenDao.findOne({ token: accessToken, type: 'ACCESS' });
        const refreshTokenDoc = await this.tokenDao.findOne({ token: refreshToken, type: 'REFRESH' });

        console.log('Access Token Document:', accessTokenDoc);
        console.log('Refresh Token Document:', refreshTokenDoc);

        if (!accessTokenDoc || !refreshTokenDoc) {
            throw new Error('Invalid tokens');
        }

        await this.tokenDao.deleteByToken(accessToken);
        await this.tokenDao.deleteByToken(refreshToken);

        console.log('Tokens deleted successfully');
    }
}

module.exports = AuthService;
