/* eslint-disable consistent-return */
/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('./logger');
const config = require('./config');

const requestLogger = (req, _res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path  :', req.path);
  logger.info('Body  :', req.body);
  logger.info('---');
  next();
};

const tokenExtractor = (req, res, next) => {
  const authHeaderData = req.get('authorization');
  if (authHeaderData && authHeaderData.toLowerCase().startsWith('bearer ')) {
    req.token = authHeaderData.substring(7);
  } else {
    req.token = null;
  }
  next();
};

const userExtractor = async (req, res, next) => {
  if (req.token) {
    try {
      const decodedToken = jwt.verify(req.token, config.SECRET);
      if (decodedToken) {
        try {
          const user = await User.findById(decodedToken.id);
          if (user) {
            req.user = user;
            next();
          } else {
            return res.status(401).send({ error: 'user no longer exists deleted' });
          }
        } catch (err) {
          next(err);
        }
      } else {
        return res.status(401).send({ error: '`token` invalid' });
      }
    } catch (e) {
      next(e);
    }
  } else {
    res.status(401).send({ error: '`token` missing' });
  }
};

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err, _req, res, next) => {
  logger.error(err.message);
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).send({ error: err.message });
  }
  if (err.name === 'SyntaxError') {
    return res.status(400).send({ error: err.message });
  }
  next(err);
};

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
};
