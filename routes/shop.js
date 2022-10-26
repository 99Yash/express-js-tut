const path = require('path');

const rootDir = require('../utils/path');

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  // __dirname refers to the directory where this file is located(i.e the route folder)
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;
