const express = require('express');
const cors = require('cors');
const app = express();
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const dotenv = require('dotenv');
const path = require('path');

const searchRouter = require('./routes/search');

dotenv.config();

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

app.post('/detection', async (req, res) => {
  // console.log(req.body);
  try {
    // const file = await fs.readFile(`uploads/${req.file.filename}`);
    // console.log(req.file.filename);
    const { base64String } = req.body;
    console.log(base64String.length);
    const [result] = await client.batchAnnotateImages({
      requests: [
        {
          image: {
            content: base64String.split('base64,')[1],
            // source: {
            //   imageUri: `http://locahost:3005/${req.file.filename}`,
            // },
          },
          features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
          imageContext: { languageHints: ['ja-t-i0-handwrit'] },
        },
      ],
    });
    const fullTextAnnotation = result?.responses?.[0]?.fullTextAnnotation;
    fullTextAnnotation.text = fullTextAnnotation?.text.replace(/\n/g, '');
    // await fs.writeFile('result-url.json', JSON.stringify(result));
    console.log(`Full text: ${fullTextAnnotation.text}`);
    res.json(fullTextAnnotation);
  } catch (error) {
    console.error(error);
  }
});

app.use('/search', searchRouter);

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`server listening ${PORT} port ...`);
});
