const mongoose = require('mongoose');
const Book = mongoose.model('Book');
const User = mongoose.model('User');
const axios = require('axios');

exports.homePage = (req, res) => {
  res.render('homepage', { title: 'Home' });
};

exports.allBooks = async (req, res) => {
  const books = await Book.find().sort({ created: 'desc' }).exec();

  res.render('books', { title: 'All Books', books });
};

exports.userBooks = async (req, res) => {
  const books = await Book.find({ owner: req.user._id })
    .sort({ created: 'desc' })
    .exec();

  const user = await User.findOne({ _id: req.user._id })
    .populate('trade_requests')
    .populate('trade_offers');
  const incomingTrades = await user.trade_requests.length;
  const outgoingTrades = await user.trade_offers.length;
  const trade_requests = await user.trade_requests;
  const trade_offers = await user.trade_offers;

  res.render('mybooks', {
    title: 'My Books',
    books,
    incomingTrades,
    outgoingTrades,
    trade_requests,
    trade_offers
  });
};

exports.addBook = async (req, res) => {
  const bookRequestURL = `https://www.googleapis.com/books/v1/volumes?q=${req
    .body.book}&key=${process.env.GOOGLE_API_KEY}`;

  // Get book data and check for thumbnail
  const response = await axios.get(bookRequestURL);
  console.log(response.data.items[0]);
  const bookData = response.data.items[0].volumeInfo;
  if ('imageLinks' in bookData === false) {
    bookData.imageLinks = {};
    bookData.imageLinks.thumbnail = '';
  }

  const book = await new Book({
    name: bookData.title,
    img_url: bookData.imageLinks.thumbnail,
    info_url: bookData.infoLink,
    owner: req.user._id
  }).save();

  req.flash('is-success', `${book.name} added to SwapBooks`);
  res.redirect('/mybooks');
};

exports.deleteBook = async (req, res) => {
  const book = await Book.findOne({ _id: req.params.id }).exec();

  if (book.owner.toString() !== req.user._id.toString()) {
    req.flash('is-danger', 'You do not own this book!');
    res.redirect('back');
    return;
  }

  if (book.active_trade) {
    req.flash('is-warning', 'Books with active trades cannot be deleted.');
    res.redirect('back');
    return;
  }

  await Book.findOneAndRemove({ _id: req.params.id });

  req.flash('is-success', `${book.name} deleted from SwapBooks.`);
  res.redirect('back');
};
