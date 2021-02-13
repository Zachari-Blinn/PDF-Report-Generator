var PdfPrinter = require('pdfmake');
const { v4: uuidv4 } = require('uuid');
var fs = require('fs');

module.exports = async (req, res, next) => {
  try {
    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }};
  
    let printer = new PdfPrinter(fonts);
  
    const docDefinition = {
      content: [
        req['text']
      ],
      defaultStyle: {
        font: 'Helvetica'
      }
    };
  
    let uuid = uuidv4();
  
    let pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(`src/upload/pdfMake/report-${uuid}.pdf`));

    console.log('[PDFMAKE] pdf created!');

    pdfDoc.end();
  } catch (error) {
    res.status(500).json({
      message: "Pdf could not be created!"
    })
  }
}