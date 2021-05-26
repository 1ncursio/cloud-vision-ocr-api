const express = require('express');
const vision = require('@google-cloud/vision');
const upload = require('../utils/upload');
const router = express.Router();
const client = new vision.ImageAnnotatorClient();

// POST /detection
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // const [result] = await client.documentTextDetection(req.file.buffer);
    // const fullTextAnnotation = result.fullTextAnnotation;
    // console.log(`Full text: ${fullTextAnnotation.text}`);
    // fullTextAnnotation.pages.forEach(page => {
    //     page.blocks.forEach(block => {
    //         console.log(`Block confidence: ${block.confidence}`);
    //         block.paragraphs.forEach(paragraph => {
    //             console.log(`Paragraph confidence: ${paragraph.confidence}`);
    //             paragraph.words.forEach(word => {
    //                 const wordText = word.symbols.map(s => s.text).join('');
    //                 console.log(`Word text: ${wordText}`);
    //                 console.log(`Word confidence: ${word.confidence}`);
    //                 word.symbols.forEach(symbol => {
    //                     console.log(`Symbol text: ${symbol.text}`);
    //                     console.log(`Symbol confidence: ${symbol.confidence}`);
    //                 });
    //             });
    //         });
    //     });
    // });
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

    // console.log(result);
    // console.log(result.responses[0]);

    // res.status(200).json(result.responses[0]);
    res.status(200).json(result.responses[0].fullTextAnnotation);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
