/* eslint-disable consistent-return */
/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
const logger = require('./logger');

const requestLogger = (req, _res, _next) => {
  logger.info('Method:', req.method);
  logger.info('Path  :', req.path);
  logger.info('Body  :', req.body);
  logger.info('---');
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
  next(err);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
