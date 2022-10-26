const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));

// app.use((req, res, next) => {
//   console.log('In the middleware!');
//   next(); // Allows the request to continue to the next middleware in line
// });
// app.use((req, res, next) => {
//   console.log('In the 2nd middleware!');
//res.send('<h1>Hello from Express!</h1>');
// });

// app.use() is a method that allows us to register a new middleware for all types of incoming requests
//app.get() is a method that allows us to register a new middleware for incoming GET requests
//app.post() is a method that allows us to register a new middleware for incoming POST requests

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', 'error.html'));
});

app.listen(3000);
