const path = require('path');

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  // __dirname refers to the directory where this file is located(i.e the route folder)
  res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
});

module.exports = router;
