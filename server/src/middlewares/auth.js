const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../helper/ApiError');
const TokenService = require('../service/TokenService');

const tokenService = new TokenService();

const auth = (requiredRoles = []) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
      console.log('Passport authenticate result:', { err, user, info });
      
      if (err) {
        console.error('Passport authentication error:', err);
        return reject(new ApiError(httpStatus.UNAUTHORIZED, `Authentication error: ${err.message}`));
      }
      
      if (info) {
        console.log('Passport authentication info:', info);
        return reject(new ApiError(httpStatus.UNAUTHORIZED, info.message || 'Authentication failed'));
      }
      
      if (!user) {
        console.log('No user found after passport authentication');
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'User not found'));
      }

      try {
        const accessToken = req.headers.authorization.split(' ')[1];
        console.log('Access token:', accessToken);
        
        const isValidToken = await tokenService.verifyToken(accessToken, 'ACCESS');
        console.log('Token verification result:', isValidToken);
        
        if (!isValidToken) {
          throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
        }

        req.user = user;
        console.log('User set in request:', req.user);
        
        if (requiredRoles.length && !requiredRoles.includes(user.role)) {
          console.log('User role not authorized:', user.role, 'Required roles:', requiredRoles);
          throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to access this resource');
        }

        resolve();
      } catch (error) {
        console.error('Error in auth middleware:', error);
        reject(new ApiError(error.statusCode || httpStatus.UNAUTHORIZED, error.message));
      }
    })(req, res, next);
  })
    .then(() => next())
    .catch((err) => {
      console.error('Auth middleware error:', err);
      next(err);
    });
};

module.exports = auth;