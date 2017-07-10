const mongoose = require('mongoose');
const User = mongoose.model('User');
const Book = mongoose.model('Book');
const Trade = mongoose.model('Trade');

function isValidID(id) {
  if (id.match(/^[0-9a-fA-F]{24}$/)) return true;
  else return false;
}

exports.addTrade = async (req, res) => {
  if (!isValidID(req.params.id)) {
    req.flash('is-danger', 'Invalid book ID.');
    return res.redirect('back');
  }

  // Find requested book
  const book = await Book.findOne({ _id: req.params.id }).exec();

  // Handle book not found
  if (book === null) {
    req.flash('is-danger', 'Error in creating trade.');
    return res.redirect('back');
  }

  // Create trade
  const trade = await new Trade({
    book: book._id,
    name: book.name,
    owner: book.owner,
    requesting_user: req.user._id
  }).save();

  // Set active_trade on requested book
  book.active_trade = true;
  await book.save();

  const requesting_user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { trade_requests: trade._id } }
  ).exec();

  const requested_user = await User.findOneAndUpdate(
    { _id: book.owner },
    { $push: { trade_offers: trade._id } }
  ).exec();

  res.redirect('/allbooks');
};

exports.cancelTrade = async (req, res) => {
  // 1. Check if user requesting delete is owner or requesting_user
  // 2. if so, findOneAndRemove, go to 4
  // 3. if not, return error
  // 4. Set active_trade to false on traded book
  // 5. Remove trade from both users

  if (!isValidID(req.params.id)) {
    req.flash('is-danger', 'Invalid trade ID');
    return res.redirect('back');
  }

  // Find requested trade
  const trade = await Trade.findOne({ _id: req.params.id }).exec();

  if (trade === null) {
    req.flash('is-danger', 'Trade not found.');
    return res.redirect('back');
  }

  console.log(req.user._id, trade.owner, trade.requesting_user);
  res.send(200);
};

exports.acceptTrade = async (req, res) => {};
