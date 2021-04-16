const vision = require('@google-cloud/vision');
const fs = require('fs').promises;

// Creates a client
const client = new vision.ImageAnnotatorClient();

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
const fileName = './test.png';

(async () => {
  try {
    const file = await fs.readFile('test.png');
    // Read a local image as a text document
    const [result] = await client.batchAnnotateImages({
      requests: [
        {
          image: {
            content: file,
          },
          features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
          imageContext: { languageHints: ['ja-t-i0-handwrit'] },
        },
      ],
    });
    // const fullTextAnnotation = result.fullTextAnnotation;
    // console.log(`Full text: ${fullTextAnnotation.text}`);
    // fullTextAnnotation.pages.forEach((page) => {
    //   page.blocks.forEach((block) => {
    //     console.log(`Block confidence: ${block.confidence}`);
    //     block.paragraphs.forEach((paragraph) => {
    //       console.log(`Paragraph confidence: ${paragraph.confidence}`);
    //       paragraph.words.forEach((word) => {
    //         const wordText = word.symbols.map((s) => s.text).join('');
    //         console.log(`Word text: ${wordText}`);
    //         console.log(`Word confidence: ${word.confidence}`);
    //         word.symbols.forEach((symbol) => {
    //           console.log(`Symbol text: ${symbol.text}`);
    //           console.log(`Symbol confidence: ${symbol.confidence}`);
    //         });
    //       });
    //     });
    //   });
    // });
    await fs.writeFile('result.json', JSON.stringify(result));
  } catch (error) {
    console.error(error);
  }
})();
