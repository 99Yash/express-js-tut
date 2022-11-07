const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const Product = require('./models/product');
const User = require('./models/user');

const MONGODB_URI =
  'mongodb+srv://99Yash:txjcv8805@cluster0.jerkvnb.mongodb.net/shop?&w=majority';

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session); //pass session from the session package as an argument to the function returned by require('connect-mongodb-session')

const app = express();
const store = new MongoDBStore({
  //store is a new instance of MongoDBStore that saves the session in the database
  uri: MONGODB_URI,
  collection: 'sessions', //value name is upto you
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user; // this will add a user model to the request
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'Yash',
          email: 'yash99@dumbmail.com',
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
