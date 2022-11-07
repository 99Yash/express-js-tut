const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').split('=')[1];
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly; Max-Age=10;'); //*HttpOnly means that the cookie can only be accessed by the server, not the client
  User.findById('5f9e1b0b0b9b9c1b3c8c1b1c')
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save((err) => {
        console.log(err);
        res.redirect('/');
      });
    })
    .then((result) => {
      res.redirect('/');
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
