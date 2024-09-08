const httpStatus = require('http-status');
const AuthService = require('../service/AuthService');
const TokenService = require('../service/TokenService');
const UserService = require('../service/UserService');
const logger = require('../config/logger');
const { tokenTypes } = require('../config/tokens');

class AuthController {
    constructor() {
        this.userService = new UserService();
        this.tokenService = new TokenService();
        this.authService = new AuthService();
    }

    register = async (req, res) => {
        try {
            const user = await this.userService.createUser(req.body);
            let tokens = {};
            if (user.response.status) {
                tokens = await this.tokenService.generateAuthTokens(user.response.data);
            }
            res.status(user.statusCode).send({ ...user.response, tokens });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await this.authService.loginWithEmailPassword(email, password);
            const tokens = await this.tokenService.generateAuthTokens(user);
            res.status(httpStatus.OK).send({ user, tokens });
        } catch (error) {
            res.status(httpStatus.UNAUTHORIZED).send({ message: error.message });
        }
    };

    logout = async (req, res) => {
        try {
            const { refreshToken } = req.body;
            const accessToken = req.headers.authorization.split(' ')[1];
            
            console.log('Logout attempt - Access Token:', accessToken);
            console.log('Logout attempt - Refresh Token:', refreshToken);

            if (!accessToken || !refreshToken) {
                throw new Error('Access token and refresh token are required for logout');
            }

            await this.authService.logout(accessToken, refreshToken);
            res.status(httpStatus.NO_CONTENT).send();
        } catch (error) {
            console.error('Logout error:', error);
            res.status(httpStatus.BAD_REQUEST).send({ message: error.message });
        }
    };

    checkEmail = async (req, res) => {
        try {
            const isExists = await this.userService.isEmailExists(req.body.email.toLowerCase());
            res.status(isExists.statusCode).send(isExists.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    refreshTokens = async (req, res) => {
        try {
            const refreshTokenDoc = await this.tokenService.verifyToken(
                req.body.refresh_token,
                tokenTypes.REFRESH,
            );
            const user = await this.userService.getUserByUuid(refreshTokenDoc.user_uuid);
            if (user == null) {
                res.status(httpStatus.BAD_GATEWAY).send('User Not Found!');
            }
            await this.tokenService.removeTokenById(refreshTokenDoc.id);
            const tokens = await this.tokenService.generateAuthTokens(user);
            res.send(tokens);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    changePassword = async (req, res) => {
        try {
            const responseData = await this.userService.changePassword(req.body, req.user.uuid);
            res.status(responseData.statusCode).send(responseData.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };
}

module.exports = AuthController;
