const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const tradeSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book'
  },
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  requesting_user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Trade', tradeSchema);
