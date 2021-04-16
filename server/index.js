const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs').promises;
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const multer = require('multer');

const path = require('path');
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      // cb(null, new Date().valueOf() + path.extname(file.originalname));
      cb(null, new Date().valueOf() + '.png');
    },
  }),
});

app.use(express.static('uploads'));
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.get('/', (req, res) => {
  return res.status(200).json({ success: true, message: 'hello server' });
});

app.post('/detection', upload.single('image'), async (req, res) => {
  // console.log(req.body);
  try {
    const [result] = await client.batchAnnotateImages({
      requests: [
        {
          image: {
            // content: req.body.base64string,
            source: {
              imageUri: req.body.base64string,
            },
          },
          features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
          imageContext: { languageHints: ['ja-t-i0-handwrit'] },
        },
      ],
    });
    const fullTextAnnotation = result.fullTextAnnotation;
    await fs.writeFile('result-url.json', JSON.stringify(result));
    // const text = await fs.readFile('test.json');
    // console.log(`Full text: ${fullTextAnnotation.text}`);
    // res.json(fullTextAnnotation);
    res.send('hello');
  } catch (error) {
    console.error(error);
  }
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`server listening ${PORT} port ...`);
});
