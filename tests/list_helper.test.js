const listHelper = require('../utils/list_helper');

const blogsEmpty = [];
const blogsSingle = [{
  _id: '5a422a851b54a676234d17f7',
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  __v: 0,
}];
const blogsMultiple = [{
  _id: '5a422a851b54a676234d17f7',
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  __v: 0,
},
{
  _id: '5a422aa71b54a676234d17f8',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
  __v: 0,
},
{
  _id: '5a422b3a1b54a676234d17f9',
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  likes: 12,
  __v: 0,
},
{
  _id: '5a422b891b54a676234d17fa',
  title: 'First class tests',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
  likes: 10,
  __v: 0,
},
{
  _id: '5a422ba71b54a676234d17fb',
  title: 'TDD harms architecture',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  likes: 0,
  __v: 0,
},
{
  _id: '5a422bc61b54a676234d17fc',
  title: 'Type wars',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2,
  __v: 0,
}];
describe('dummy test', () => {
  test('returns 1', () => {
    expect(listHelper.dummy(blogsEmpty)).toBe(1);
  });
});

describe('total likes of a given list of blogs', () => {
  test('empty list of blogs', () => {
    expect(listHelper.totalLikes(blogsEmpty)).toBe(0);
  });
  test('when no value passed', () => {
    expect(listHelper.totalLikes()).toBe(0);
  });
  test('one item in list of blogs', () => {
    expect(listHelper.totalLikes(blogsSingle)).toBe(blogsSingle[0].likes);
  });
  test('bigger list of blogs', () => {
    expect(listHelper.totalLikes(blogsMultiple))
      .toBe(blogsMultiple.reduce((sum, blog) => sum + blog.likes, 0));
  });
});

describe('finding the favorite blog', () => {
  test('empty list of blogs', () => {
    expect(listHelper.favoriteBlog(blogsEmpty)).toEqual(undefined);
  });
  test('when no value passed', () => {
    expect(listHelper.favoriteBlog()).toEqual(undefined);
  });
  test('one item in list of blogs', () => {
    expect(listHelper.favoriteBlog(blogsSingle)).toEqual(blogsSingle[0]);
  });
  test('bigger list of blogs', () => {
    expect(listHelper.favoriteBlog(blogsMultiple)).toEqual(blogsMultiple[2]);
  });
});

describe('finding the most blogs by single author', () => {
  test('empty list of blogs', () => {
    expect(listHelper.mostBlogs(blogsEmpty)).toEqual(undefined);
  });
  test('when no value passed', () => {
    expect(listHelper.mostBlogs()).toEqual(undefined);
  });
  test('one item in list of blogs', () => {
    expect(listHelper.mostBlogs(blogsSingle)).toEqual({ author: blogsSingle[0].author, blogs: 1 });
  });
  test('bigger list of blogs', () => {
    expect(listHelper.mostBlogs(blogsMultiple))
      .toEqual({ author: blogsMultiple[3].author, blogs: 3 });
  });
});

describe('finding the single author with most likes', () => {
  test('empty list of blogs', () => {
    expect(listHelper.mostLikes(blogsEmpty)).toEqual(undefined);
  });
  test('when no value passed', () => {
    expect(listHelper.mostLikes()).toEqual(undefined);
  });
  test('one item in list of blogs', () => {
    expect(listHelper.mostLikes(blogsSingle))
      .toEqual({ author: blogsSingle[0].author, likes: blogsSingle[0].likes });
  });
  test('bigger list of blogs', () => {
    expect(listHelper.mostLikes(blogsMultiple))
      .toEqual({ author: blogsMultiple[1].author, likes: 17 });
  });
});
