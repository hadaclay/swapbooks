const mongoose = require('mongoose');

exports.homePage = (req, res) => {
  res.render('homepage', { title: 'Home' });
};

exports.getBooks = (req, res) => {
  res.render('books', { title: 'All Books'});
};

exports.getUserBooks = (req, res) => {
  res.render('mybooks', { title: 'My Books' });
};
