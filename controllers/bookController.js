const mongoose = require('mongoose');
const Book = mongoose.model('Book');
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

  res.render('mybooks', { title: 'My Books', books });
};

exports.addBook = async (req, res, next) => {
  // TODO: Check if book title already exists in db
  const bookRequestURL = `https://www.googleapis.com/books/v1/volumes?q=${req
    .body.book}&key=${process.env.GOOGLE_API_KEY}`;

  const response = await axios.get(bookRequestURL);
  const book = await new Book({
    name: response.data.items[0].volumeInfo.title,
    img_url: response.data.items[0].volumeInfo.imageLinks.thumbnail,
    owner: req.user._id
  }).save();

  next();
};

exports.deleteBook = async (req, res) => {
  // 1. Check if user owns book
  // 2. Check for active trades
  // 3. Delete from DB, return user to previous page

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
  res.redirect('back');
};
