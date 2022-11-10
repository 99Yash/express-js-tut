const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').split('=')[1];
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly; Max-Age=10;'); //*HttpOnly means that the cookie can only be accessed by the server, not the client
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect('/');
            });
          }
          res.redirect('/login');
        })
        .catch((err) => {
          console.log(err);
        });

      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save((err) => {
        console.log(err);
        res.redirect('/');
      });
    })
    .then((result) => {
      req.session.isLoggedIn = true;
      res.redirect('/');
    });
};

exports.getSignup = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').split('=')[1];
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        //this means that the user already exists
        return res.redirect('/login');
      }
      return bcrypt.hash(password, 12).then((hashedPassword) => {
        //create a new user
        const user = new User({
          email: email,
          password: password,
          cart: { items: [] },
        });
        return user.save();
      });
    })
    .then((result) => {
      res.redirect('/login');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
