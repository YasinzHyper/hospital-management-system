const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const UserService = require('../service/UserService');

const userService = new UserService();

const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
    try {
        console.log('JWT Payload:', payload);
        if (!payload.sub) {
            console.error('No sub (uuid) found in JWT payload');
            return done(null, false, { message: 'Invalid token' });
        }
        const user = await userService.getUserByUuid(payload.sub);
        console.log('User found:', user);
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        return done(null, user);
    } catch (error) {
        console.error('Error in JWT verification:', error);
        return done(error, false);
    }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
    jwtStrategy,
};