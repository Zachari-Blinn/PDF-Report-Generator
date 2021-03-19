var http = require('http');
const express = require('express');
var bodyParser = require('body-parser');
const Util = require('util')
const Fs = require('fs')
const ReadFile = Util.promisify(Fs.readFile);

const app = express();

app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: false
}));

const port = 8080;

app.use(express.static("src/public"));

app.set('view engine', 'ejs');

// PDF Maker generator
const PdfService = require('./src/service/pdf.service');

const content = {
  name: "je suis un petit test",
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean accumsan ligula eget nisl pulvinar dapibus. Vivamus a mauris purus. Integer arcu erat, pharetra dignissim scelerisque sit amet, convallis sit amet dui. Praesent fringilla aliquet augue a elementum. Nam a mauris non neque tincidunt lobortis. Praesent cursus dictum ligula non vulputate. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis at facilisis mauris. Praesent eu pellentesque mi, et ullamcorper ipsum. Curabitur blandit iaculis enim, eget varius sem porttitor et. Proin tempor sapien vitae nibh mollis varius. Praesent tempor, justo pulvinar aliquam pretium, erat lacus condimentum nibh, eu porta urna enim sit amet erat.",
};

// Views
app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get('/report/pdf', async (req, res) => {
  const dataPath = 'src/service/data1.json';

  const rawdata = await ReadFile(dataPath);
  const parsedData = JSON.parse(rawdata);

  const data = {
    data: parsedData
  }

  res.render('template/report', data)
})


app.get('/puppeteer', async (req, res) => {
  let pdf = new PdfService();

  const rawData = await ReadFile('src/service/data1.json');
  const parsedData = {
    data: JSON.parse(rawData)
  };

  pdf.setTemplatePath('views/template/report.ejs');
  pdf.setParsedData(parsedData);

  pdf.setFooter(`
    <div style="color: lightgray; font-size: 10px; padding-top: 5px; text-align: center; width: 100%;">
      <span>LNA SANTE</span> - <span class="pageNumber"></span>
    </div>
  `);

  const generatedPdf = await pdf.generatePdf();

  res.download(generatedPdf.path, 'report.pdf')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})