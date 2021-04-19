const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const { keyword } = req.query;
    const {
      data: { data },
    } = await axios.get(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(keyword)}`);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
