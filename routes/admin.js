const express = require('express');

const router = express.Router();

//router.get() and router.post() match the exact url in the browser. same for app.get() and app.post()
router.get('/add-product', (req, res, next) => {
  res.send(
    "<form action='/product' method='POST'> <input type='text' name='title'><button type='submit'>Add Product</button> </form>"
  );
});

router.post('/product', (req, res, next) => {
  console.log(req.body);
  console.log('This is product!');
  res.redirect('/');
});

module.exports = router;
