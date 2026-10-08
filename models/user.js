const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: (props) => `${props.value} is not a valid email address`,
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('user', userSchema);
