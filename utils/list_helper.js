/* eslint-disable no-unused-vars */
const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  if (blogs === undefined || blogs.length === undefined || blogs.length === 0) {
    return 0;
  }
  const likeAdder = (sum, value) => sum + value.likes;

  return blogs.reduce(likeAdder, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs === undefined || blogs.length === undefined || blogs.length === 0) {
    return undefined;
  }
  return blogs.reduce((highestLiked, blog) => {
    if (highestLiked.likes > blog.likes) {
      return highestLiked;
    }
    return blog;
  }, { likes: -1 });
};

const mostBlogs = (blogs) => {
  if (blogs === undefined || blogs.length === undefined || blogs.length === 0) {
    return undefined;
  }
  let authors = blogs.map((blog) => ({ author: blog.author, blogs: 1 }));
  // finding unique authors
  for (let i = 0; i < authors.length; i += 1) {
    if (authors[i].author) {
      const name = authors[i].author;
      for (let j = i + 1; j < authors.length; j += 1) {
        if (name === authors[j].author) {
          authors[i].blogs += 1;
          delete authors[j].author;
          delete authors[j].blogs;
        }
      }
    }
  }
  // filtering empty objects
  authors = authors.filter((a) => {
    if (a.author) {
      return true;
    }
    return false;
  });
  // finding the author that has most blogs
  return authors.reduce((most, current) => {
    if (current.blogs > most.blogs) {
      return current;
    }
    return most;
  }, { blogs: -1 });
};

const mostLikes = (blogs) => {
  if (blogs === undefined || blogs.length === undefined || blogs.length === 0) {
    return undefined;
  }
  let authors = blogs.map((blog) => ({ author: blog.author, likes: blog.likes }));
  // finding unique authors
  for (let i = 0; i < authors.length; i += 1) {
    if (authors[i].author) {
      const name = authors[i].author;
      for (let j = i + 1; j < authors.length; j += 1) {
        if (name === authors[j].author) {
          authors[i].likes += authors[j].likes;
          delete authors[j].author;
          delete authors[j].likes;
        }
      }
    }
  }
  // filtering empty objects
  authors = authors.filter((a) => {
    if (a.author) {
      return true;
    }
    return false;
  });
  // finding the author that has most likes
  return authors.reduce((most, current) => {
    if (current.likes > most.likes) {
      return current;
    }
    return most;
  }, { likes: -1 });
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
