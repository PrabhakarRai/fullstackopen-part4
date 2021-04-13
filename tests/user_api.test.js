/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const supertest = require('supertest');
const User = require('../models/user');
const app = require('../app');

const api = supertest(app);

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

describe('when there is initially one user in DB', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('superSecret%aa$', 10);
    const user = new User({
      username: 'root',
      name: 'root',
      passwordHash,
    });
    await user.save();
  });
  test('new users are created successfully with unique username', async () => {
    const usersAtStart = await usersInDb();
    const newUser = {
      username: 'prabhakar',
      name: 'Prabhakar Rai',
      password: 'someSecret^&*',
    };
    await api
      .post('/api/users/')
      .send(newUser)
      .set('Content-Type', 'application/json')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  });
  test('creation fails if user exists', async () => {
    const usersAtStart = await usersInDb();
    const newUser = {
      username: 'root',
      name: 'Prabhakar Rai',
      password: 'someSecret^&*',
    };
    const result = await api
      .post('/api/users/')
      .send(newUser)
      .set('Content-Type', 'application/json')
      .expect(400)
      .expect('Content-Type', /application\/json/);
    
    expect(result.body.error).toContain('`username` to be unique');

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart);
  });
});
