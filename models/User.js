const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Please Supply your Name'
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please Supply an email address'
  },
  city: {
    type: String,
    trim: true,
    required: false
  },
  state: {
    type: String,
    trim: true,
    required: false
  },
  books: [
    { type: mongoose.Schema.ObjectId, ref: 'Book' }
  ],
  trade_requests: [
    { type: mongoose.Schema.ObjectId, ref: 'Trade' }
  ],
  trade_offers: [
    { type: mongoose.Schema.ObjectId, ref: 'Trade' }
  ]
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
