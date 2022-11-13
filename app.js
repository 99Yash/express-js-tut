const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
  'mongodb+srv://99Yash:txjcv8805@cluster0.jerkvnb.mongodb.net/shop?&w=majority';

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session); //pass session from the session package as an argument to the function returned by require('connect-mongodb-session')
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const app = express();
const store = new MongoDBStore({
  //store is a new instance of MongoDBStore that saves the session in the database
  uri: MONGODB_URI,
  collection: 'sessions', //value name is upto you
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  }
  cb(null, false); //file will be ignored
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
); //single() is a method of multer that extracts the image from the request and stores it in the images folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user; // this will add a user model to the request
      next();
    })
    .catch((err) => {
      // throw new Error(err); //this will not work because we are in a promise
      next(new Error(err));
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500');
  console.log(error);
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
