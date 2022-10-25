const express = require('express');
const bodyParser = require('body-parser');

const app = express();

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

app.use('/add-product', (req, res, next) => {
  res.send(
    "<form action='/product' method='POST'> <input type='text' name='title'><button type='submit'>Add Product</button> </form>"
  );
});

app.post('/product', (req, res, next) => {
  console.log(req.body);
  console.log('This is product!');
  res.redirect('/');
});

app.use('/', (req, res, next) => {
  res.send('<h1>Hello from Express!</h1>');
});

app.listen(3000);
