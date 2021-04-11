const mongoose = require('mongoose');
const supertest = require('supertest');
const Blog = require('../models/blog');
const app = require('../app');

const api = supertest(app);

const initialBlogs = [{
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
},
{
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
},
{
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  likes: 12,
},
{
  title: 'First class tests',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
  likes: 10,
}];

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test('blogs are returned as JSON', async () => {
  const res = await api.get('/api/blogs');
  expect(res.status).toBe(200);
  expect(res.headers['content-type']).toBe('application/json');
});
test('all blogs are returned', async () => {
  const res = await api.get('/api/blogs/');
  expect(res.body).toHaveLength(initialBlogs.length);
});
test('one blog is about Reach patterns', async () => {
  const res = await api.get('/api/blogs/');
  expect(res.body[0].title).toBe(initialBlogs[0].title);
});

afterAll(() => {
  mongoose.connection.close();
});
