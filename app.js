const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const loginRouter = require('./controllers/login');
const testRouter = require('./controllers/tests');

const app = express();
logger.info('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }).then(() => {
  logger.info('Connected to MongoDB.');
}).catch((err) => {
  logger.error('error connecting to the mongoDB:', err.message);
});

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/tests', testRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
