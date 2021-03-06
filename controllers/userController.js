const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That Email Address is not valid!').isEmail();
  req.sanitizeBody('email');
  req.checkBody('password', 'Password cannot be blank!').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    req.flash('is-danger', errors.map(err => err.msg));
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash()
    });
    return;
  }
  next();
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};

exports.settingsPage = (req, res) => {
  res.render('settings', { title: 'Account Settings' });
};

exports.updateProfile = async (req, res) => {
  const updates = {
    name: req.body.name,
    city: req.body.city,
    state: req.body.state
  };

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  );

  req.flash('is-success', 'Profile Updated!');
  res.redirect('back');
};

exports.updatePassword = async (req, res) => {};
