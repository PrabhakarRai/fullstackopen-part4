const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', (req, res) => {
  Blog.find({})
    .then((blogs) => {
      res.json(blogs);
    });
});

blogRouter.get('/:id', (req, res, next) => {
  Blog.findById(req.params.id)
    .then((blog) => {
      if (blog) {
        res.json(blog.toJSON());
      } else {
        res.status(404).end();
      }
    }).catch((err) => {
      next(err);
    });
});

blogRouter.post('/', (req, res, next) => {
  const blog = new Blog({
    author: req.body.author,
    title: req.body.title,
    url: req.body.url,
    likes: 0,
  });

  blog.save().then((savedBlog) => {
    res.json(savedBlog.toJSON());
  }).catch((err) => {
    next(err);
  });
});

module.exports = blogRouter;
