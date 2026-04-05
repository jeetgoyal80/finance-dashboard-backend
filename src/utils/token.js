const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateToken = (payload) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};

module.exports = {
  generateToken,
  verifyToken
};
