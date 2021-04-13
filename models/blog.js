/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: [1, 'Dont be blank'],
    maxLength: 100,
    required: true,
  },
  author: {
    type: String,
    minLength: 1,
    maxLength: 100,
    required: true,
  },
  url: {
    type: String,
    minLength: 5,
    maxLength: 200,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  likes: {
    type: Number,
    required: true,
    min: [0, 'Why so much hate?'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

blogSchema.plugin(uniqueValidator);

blogSchema.set('toJSON', {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj.__v;
    delete returnedObj._id;
  },
});

module.exports = mongoose.model('Blog', blogSchema);
