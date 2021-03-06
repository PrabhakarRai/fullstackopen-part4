/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const Blog = require('../models/blog');
const User = require('../models/user');
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
}];

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

beforeEach(async () => {
  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  await Blog.insertMany(blogObjects);
  // const promiseArray = blogObjects.map((blog) => blog.save());
  // await Promise.all(promiseArray);
});

afterEach(async () => {
  await Blog.deleteMany({});
});

describe('retriving blogs using GET /api/blogs/', () => {
  test('blogs are returned as JSON', async () => {
    const res = await api.get('/api/blogs/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
  test('all blogs are returned on /api/blogs/', async () => {
    const res = await api.get('/api/blogs/');
    expect(res.body).toHaveLength(initialBlogs.length);
  });
  test('id field is defined for returned blogs', async () => {
    const res = await api.get('/api/blogs/');
    expect(res.body[0].id).toBeDefined();
  });
  test('_id and __v field is not defined for returned blogs', async () => {
    const res = await api.get('/api/blogs/');
    expect(res.body[0]._id).not.toBeDefined();
    expect(res.body[0].__v).not.toBeDefined();
  });
});

describe('creating blog entry using POST /api/blogs/', () => {
  test('POST req on /api/blogs/ fails without auth', async () => {
    const newBlog = {
      title: 'New Blog to be added',
      author: 'Prabhakar Rai',
      url: 'https://www.theprabhakar.in/some-new-post.html',
      likes: 100,
    };
    await api.post('/api/blogs/')
      .send(newBlog)
      .set('Content-Type', 'application/json')
      .expect(401);
  });
  test('POST req on /api/blogs/ with auth creates a new blog', async () => {
    const login = await api.post('/api/login/')
      .send({ username: 'root', password: 'root' })
      .set('Content-Type', 'application/json');
    const bearerToken = `bearer ${login.body.token}`;
    const newBlog = {
      title: 'New Blog to be added',
      author: 'Prabhakar Rai',
      url: 'https://www.theprabhakar.in/some-new-post.html',
      likes: 100,
    };
    const oldBlogs = await api.get('/api/blogs/');
    await api.post('/api/blogs/')
      .send(newBlog)
      .set('Content-Type', 'application/json')
      .set('Authorization', bearerToken)
      .expect(200);
    const updatedBlogs = await api.get('/api/blogs/');
    expect(updatedBlogs.body).toHaveLength(oldBlogs.body.length + 1);
  });
  test('POST /api/blogs/ with auth adds correct user info to the data', async () => {
    const login = await api.post('/api/login/')
      .send({ username: 'root', password: 'root' })
      .set('Content-Type', 'application/json');
    const bearerToken = `bearer ${login.body.token}`;
    const newBlog = {
      title: 'New Blog to be added',
      author: 'Prabhakar Rai',
      url: 'https://www.theprabhakar.in/some-new-post.html',
      likes: 100,
    };
    const result = await api.post('/api/blogs/')
      .send(newBlog)
      .set('Content-Type', 'application/json')
      .set('Authorization', bearerToken)
      .expect(200);
    expect(result.body.user.username).toBe('root');
  });
  test('likes are zero (0) for newly created blogs', async () => {
    const login = await api.post('/api/login/')
      .send({ username: 'root', password: 'root' })
      .set('Content-Type', 'application/json');
    const bearerToken = `bearer ${login.body.token}`;
    const newBlog = {
      title: 'New Blog to be added',
      author: 'Prabhakar Rai',
      url: 'https://www.theprabhakar.in/some-new-post.html',
      likes: 100,
    };
    const result = await api.post('/api/blogs/')
      .send(newBlog)
      .set('Content-Type', 'application/json')
      .set('Authorization', bearerToken)
      .expect(200);
    expect(result.body.likes).toBe(0);
  });
  test('POST with incomplete data is blocked at /api/blogs/', async () => {
    const login = await api.post('/api/login/')
      .send({ username: 'root', password: 'root' })
      .set('Content-Type', 'application/json');
    const bearerToken = `bearer ${login.body.token}`;
    const badBlog = {
      url: 'https://www.theprabhakar.in/',
      likes: 100,
    };
    await api.post('/api/blogs/')
      .send(badBlog)
      .set('Content-Type', 'application/json')
      .set('Authorization', bearerToken)
      .expect('Content-Length', /0/)
      .expect(400);
  });
});

describe('deleting a blog using its id DELETE /api/blogs/:id', () => {
  test('unauthorized requests are rejected on deleted', async () => {
    await api.delete('/api/blogs/someid')
      .expect(401);
  });
  test('blog is successfully deleted', async () => {
    const login = await api.post('/api/login/')
      .send({ username: 'root', password: 'root' })
      .set('Content-Type', 'application/json');
    const bearerToken = `bearer ${login.body.token}`;
    const newBlog = {
      title: 'New Blog to be added',
      author: 'Prabhakar Rai',
      url: 'https://www.theprabhakar.in/some-new-delete.html',
      likes: 100,
    };
    const result = await api.post('/api/blogs/')
      .send(newBlog)
      .set('Content-Type', 'application/json')
      .set('Authorization', bearerToken)
      .expect(200);
    await api.delete(`/api/blogs/${result.body.id}`)
      .set('Authorization', bearerToken)
      .expect(204);
  });
  test('non-existing blogs returned error when trying to delete', async () => {
    const login = await api.post('/api/login/')
      .send({ username: 'root', password: 'root' })
      .set('Content-Type', 'application/json');
    const bearerToken = `bearer ${login.body.token}`;
    const newBlog = {
      title: 'New Blog to be added',
      author: 'Prabhakar Rai',
      url: 'https://www.theprabhakar.in/some-new-post.html',
      likes: 100,
    };
    const result = await api.post('/api/blogs/')
      .send(newBlog)
      .set('Content-Type', 'application/json')
      .set('Authorization', bearerToken)
      .expect(200);
    await api.delete(`/api/blogs/${result.body.id}`)
      .set('Authorization', bearerToken)
      .expect(204);
    // now the blog no longer exists so 404 expected
    await api.delete(`/api/blogs/${result.body.id}`)
      .set('Authorization', bearerToken)
      .expect(404);
  });
});

describe('updating likes using PUT /api/blogs/:id', () => {
  test('likes are successfully updated', async () => {
    const blogs = await api.get('/api/blogs/');
    const newBlogLikes = {
      likes: 10,
    };
    const updatedBlogWithNewLikes = await api.put(`/api/blogs/${blogs.body[0].id}`)
      .send(newBlogLikes)
      .set('Content-Type', 'application/json')
      .expect(200);
    expect(updatedBlogWithNewLikes.body.likes).toBe(newBlogLikes.likes);
  });
  test('bad id for put request returns error', async () => {
    const newBlogLikes = {
      likes: 10,
    };
    const badBlogId = 'some-crap';
    await api.put(`/api/blogs/${badBlogId}`)
      .send(newBlogLikes)
      .set('Content-Type', 'application/json')
      .expect(400);
  });
});

afterAll(async () => {
  await User.deleteMany({});
  mongoose.connection.close();
});
