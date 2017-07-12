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

  // requesting_user
  await User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { trade_requests: trade._id } }
  ).exec();

  // requested_user
  await User.findOneAndUpdate(
    { _id: book.owner },
    { $push: { trade_offers: trade._id } }
  ).exec();

  req.flash('is-success', `Trade for ${trade.name} has been created.`);
  res.redirect('/allbooks');
};

exports.cancelTrade = async (req, res) => {
  if (!isValidID(req.params.id)) {
    req.flash('is-danger', 'Invalid trade ID');
    return res.redirect('/mybooks');
  }

  // Find requested trade
  const trade = await Trade.findOne({ _id: req.params.id }).exec();

  if (trade === null) {
    req.flash('is-danger', 'Trade not found.');
    return res.redirect('/mybooks');
  }

  // Check if user deleting is owner or requesting_user
  if (
    !trade.owner.equals(req.user._id) &&
    !trade.requesting_user.equals(req.user._id)
  ) {
    req.flash('is-danger', 'You are not allowed to cancel this trade.');
    return res.redirect('/mybooks');
  }

  // Set active_trade to false on traded book
  await Book.findOneAndUpdate(
    { _id: trade.book },
    { active_trade: false }
  ).exec();

  // Remove trade from users
  await User.findOneAndUpdate(
    { _id: trade.owner },
    { $pull: { trade_offers: trade._id } }
  ).exec();

  await User.findOneAndUpdate(
    { _id: trade.requesting_user },
    { $pull: { trade_requests: trade._id } }
  ).exec();

  // Remove trade from DB
  await trade.remove();

  req.flash('is-success', `Trade for ${trade.name} canceled.`);
  res.redirect('/mybooks');
};

exports.acceptTrade = async (req, res) => {
  if (!isValidID(req.params.id)) {
    req.flash('is-danger', 'Invalid trade ID');
    return res.redirect('/mybooks');
  }

  // Find trade
  const trade = await Trade.findOne({ _id: req.params.id }).exec();

  if (trade === null) {
    req.flash('is-danger', 'Trade not found.');
    return res.redirect('/mybooks');
  }

  // Make sure only the book owner can accept trade
  if (!trade.owner.equals(req.user._id)) {
    req.flash('is-danger', 'You are not allowed to accept this trade.');
    return res.redirect('/mybooks');
  }

  // Make requesting_user the new owner of book and make trade inactive
  const book = await Book.findOneAndUpdate(
    { _id: trade.book },
    {
      owner: trade.requesting_user,
      active_trade: false
    }
  ).exec();

  // Remove trade from users and switch book owner
  await User.findOneAndUpdate(
    { _id: trade.owner },
    { $pull: { trade_offers: trade._id, books: trade.book } }
  ).exec();

  await User.findOneAndUpdate(
    { _id: trade.requesting_user },
    {
      $pull: { trade_requests: trade._id },
      $push: { books: book._id }
    }
  ).exec();

  // Remove trade from DB
  await trade.remove();

  req.flash('is-success', `Trade for ${trade.name} accepted.`);
  res.redirect('/mybooks');
};
