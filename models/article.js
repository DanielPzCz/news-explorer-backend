const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: [true, 'Keyword is required'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  text: {
    type: String,
    required: [true, 'Text is required'],
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
  },
  source: {
    type: String,
    required: [true, 'Source is required'],
  },
  link: {
    type: String,
    required: [true, 'Link is required'],
    validate: {
      validator: (value) => validator.isURL(value),
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
    validate: {
      validator: (value) => validator.isURL(value),
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('article', articleSchema);
