/* eslint-disable no-underscore-dangle */
const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

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

blogRouter.delete('/:id',
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (req, res, next) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (blog) {
        if (blog.user.toString() === req.user._id.toString()) {
          await Blog.findByIdAndDelete(req.params.id);
          res.status(204).end();
        } else {
          res.status(401).end();
        }
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

blogRouter.post('/',
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (req, res, next) => {
    const blog = new Blog({
      author: req.body.author,
      title: req.body.title,
      url: req.body.url,
      likes: 0,
      user: req.user._id,
    });
    try {
      const savedBlog = await blog.save();
      const popBlog = await Blog.populate(savedBlog, { path: 'user', select: 'username name' });
      if (popBlog) {
        req.user.blogs = req.user.blogs.concat(popBlog._id);
        await req.user.save();
        res.json(popBlog);
      } else {
        res.status(400).end();
      }
    } catch (e) {
      next(e);
    }
  });

module.exports = blogRouter;
