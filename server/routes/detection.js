const express = require('express');
const vision = require('@google-cloud/vision');
const upload = require('../utils/upload');
const router = express.Router();

const client = new vision.ImageAnnotatorClient();

// POST /detection
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const [result] = await client.batchAnnotateImages({
      requests: [
        {
          image: {
            content: req.file.buffer,
          },
          features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
          imageContext: { languageHints: ['ja-t-i0-handwrit'] },
        },
      ],
    });
    const fullTextAnnotation = result?.responses?.[0]?.fullTextAnnotation;
    fullTextAnnotation.text = fullTextAnnotation?.text.replace(/\n/g, '');
    console.log(`Full text: ${fullTextAnnotation.text}`);
    res.json(fullTextAnnotation);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
