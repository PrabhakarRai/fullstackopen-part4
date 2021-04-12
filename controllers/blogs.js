const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (req, res) => {
  const dbRes = await Blog.find({});
  res.json(dbRes);
});

blogRouter.get('/:id', async (req, res, next) => {
  try {
    const singleBlog = await Blog.findById(req.params.id);
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
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, newBlogData, { new: true });
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
  const blog = new Blog({
    author: req.body.author,
    title: req.body.title,
    url: req.body.url,
    likes: 0,
  });
  try {
    const savedBlog = await blog.save();
    if (savedBlog) {
      res.json(savedBlog.toJSON());
    } else {
      res.status(400).end();
    }
  } catch (e) {
    next(e);
  }
});

module.exports = blogRouter;
