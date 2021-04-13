const bcrypt = require('bcrypt')
const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.post('/', async (req, res, next) => {
  const saltRound = 10;
  if (!req.body.password || !req.body.username) {
    res.status(400).send({ error: 'username & password are required' });
  } else if (req.body.password.length < 3 ) {
    res.status(400).send({ error: '`password` must be 3 characters long' });
  } else {
    const passwordHash = await bcrypt.hash(req.body.password, saltRound);
    const user = new User({
      username: req.body.username,
      name: req.body.name,
      passwordHash,
    });
    try {
      const savedUser = await user.save();
      res.json(savedUser);
    } catch (e) {
      next(e);
    }
  }
});

module.exports = userRouter;