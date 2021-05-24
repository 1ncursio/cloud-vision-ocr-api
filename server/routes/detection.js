const express = require('express');
const router = express.Router();

// POST /detection
router.post('/', async (req, res) => {
  try {
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
    console.log(`Full text: ${fullTextAnnotation.text}`);
    res.json(fullTextAnnotation);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
