const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  img_url: {
    type: String,
    required: false
  },
  info_url: {
    type: String,
    required: false
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  active_trade: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model('Book', bookSchema);
