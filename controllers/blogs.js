/* eslint-disable no-underscore-dangle */
const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogRouter.get('/', async (req, res) => {
  const dbRes = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(dbRes);
});

blogRouter.get('/:id', async (req, res, next) => {
  try {
    const singleBlog = await Blog.findById(req.params.id)
      .populate('user', { username: 1, name: 1 });
    if (singleBlog) {
      res.json(singleBlog);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    next(e);
  }
});

blogRouter.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (e) {
    next(e);
  }
});

blogRouter.put('/:id', async (req, res, next) => {
  try {
    const newBlogData = {
      likes: Number(req.body.likes),
    };
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id, newBlogData, { new: true },
    ).populate('user', { username: 1, name: 1 });
    if (updatedBlog) {
      res.status(200).send(updatedBlog);
    } else {
      res.status(404).end();
    }
  } catch (e) {
    next(e);
  }
});

blogRouter.post('/', async (req, res, next) => {
  const firstUser = await User.findOne({});
  const blog = new Blog({
    author: req.body.author,
    title: req.body.title,
    url: req.body.url,
    likes: 0,
    user: firstUser._id,
  });
  try {
    const savedBlog = await blog.save().populate('user', { username: 1, name: 1 });
    if (savedBlog) {
      firstUser.blogs = firstUser.blogs.concat(savedBlog._id);
      await firstUser.save();
      res.json(savedBlog.toJSON());
    } else {
      res.status(400).end();
    }
  } catch (e) {
    next(e);
  }
});

module.exports = blogRouter;
