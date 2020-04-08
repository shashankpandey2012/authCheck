const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  login_attempts: {
    type: Number,
    default: 0
  },
  last_failed_attempt: {
    type: Date
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
