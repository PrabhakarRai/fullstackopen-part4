/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const User = require('../models/user');
const app = require('../app');

const api = supertest(app);

beforeAll(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('root', 10);
  const user = new User({
    username: 'root',
    name: 'root',
    passwordHash,
  });
  await user.save();
});

afterAll(() => {
  mongoose.connection.close();
});

describe('login when there is initially one user in DB', () => {
  test('login is successful with correct username & password', async () => {
    const data = { username: 'root', password: 'root' };
    const result = await api
      .post('/api/login/')
      .send(data)
      .set('Content-Type', 'application/json')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(result.body.username).toBe(data.username);
  });
  test('login is unsuccessful with wrong username or password', async () => {
    await api
      .post('/api/login/')
      .send({ username: 'toor', password: 'root' })
      .set('Content-Type', 'application/json')
      .expect(401)
      .expect('Content-Type', /application\/json/);
    const result = await api
      .post('/api/login/')
      .send({ username: 'root', password: 'wrong' })
      .set('Content-Type', 'application/json')
      .expect(401)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('invalid `username` or `password`');
  });
  test('login is unsuccessful with error msg when user/pass not given', async () => {
    const result = await api
      .post('/api/login/')
      .send({})
      .set('Content-Type', 'application/json')
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` & `password` required');
  });
});
