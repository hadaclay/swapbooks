const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const tradeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  reciever: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Trade', tradeSchema);
