const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // const words = await Words.findAll();
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
