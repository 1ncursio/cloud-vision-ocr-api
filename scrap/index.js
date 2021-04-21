const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

const LEVEL = 1;
const PARTS = [
  "전체",
  "명사",
  "대명사",
  "동사",
  "조사",
  "형용사",
  "접사",
  "부사",
  "감동사",
  "형용동사",
  "기타",
];
const PART = PARTS[0];
const PAGE = 5;
const URI = `https://ja.dict.naver.com/api/jako/getJLPTList?level=${LEVEL}&part=${encodeURIComponent(
  PART
)}&page=${PAGE}`;

(async () => {
  try {
    let {
      data: { m_items: words },
    } = await axios.get(URI, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36",
      },
    });
    await fs.writeFile(
      path.resolve(__dirname, `words_${PART}_${LEVEL}_${PAGE}p.json`),
      JSON.stringify(words)
    );
    words = words.forEach((word) => {
      const { entry, show_entry: showEntry, level, parts, pron, means } = word;
      console.log({ entry, showEntry, level, parts, pron, means });
    });
  } catch (error) {
    console.error(error);
  }
})();
