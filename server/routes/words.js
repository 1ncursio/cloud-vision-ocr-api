const express = require('express');
const { Word } = require('../models');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const words = await Word.findAll();
    res.status(200).json(words);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // 무작위 인덱스(0 이상 i 미만)

    [array[i], array[j]] = [array[j], array[i]];
  }
}

router.get('/random', async (req, res, next) => {
  try {
    const words = await Word.findAll();
    shuffle(words);

    res.status(200).json(words);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    // const { hiragana, katakana, okurigana, kanji, korean, level } = req.body;
    const body = {};

    Object.keys(req.body).forEach((key) => {
      if (req.body[key]) body[key] = req.body[key];
    });

    const word = await Word.create(body);

    res.status(200).json(word);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
