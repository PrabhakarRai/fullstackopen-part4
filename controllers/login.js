/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');
const config = require('../utils/config');

loginRouter.post('/', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send({ error: '`username` & `password` required' });
  }
  const user = await User.findOne({ username: req.body.username });
  const passwordCorret = user === null
    ? false
    : await bcrypt.compare(req.body.password, user.passwordHash);
  if (!(user && passwordCorret)) {
    return res.status(401).json({
      error: 'invalid `username` or `password`',
    });
  }
  const tokenBody = {
    username: user.username,
    id: user._id.toString(), // get back to the use of toString method
  };
  const token = jwt.sign(tokenBody, config.SECRET);
  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
