const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const ejs = require('ejs');
const Util = require('util');
const Fs = require('fs');
const ReadFile = Util.promisify(Fs.readFile);

class PuppeteerService {

  // Private attribute
  #header
  #footer
  #templateFooter

  /**
   * Constructor of Puppeteer pdf generator
   * @param {String} name 
   * @param {String} logo 
   * @param {Array} data 
   */
  constructor (name, logo, data) {
    this.name = name;
    this.logo = logo;
    this.data = data;
  }

  /**
   * @param {String} str 
   */
  setFooter (str) {
    this.footer = str;
  }

  /**
   * @param {String} str 
   */
  setHeader (str) {
    this.header = str;
  }

  /**
   * @param {String} str 
   */
  setTemplatePath (str) {
    this.templatePath = str;
  }

  /**
   * @param {JSON} parsedData
   */
  setParsedData (parsedData) {
    this.parsedData = parsedData;
  }

  /**
   * Parse data and set html/ejs template
   * @return {Array} parsed data
   */
  static async templateWithData () {
    try {
      const rawdata = await ReadFile('src/service/data.json');

      const data = {data: JSON.parse(rawdata)};

      const content = await ReadFile(this.templatePath ?? 'views/template/report.ejs', 'utf8');

      const templateWithData = ejs.compile(content);

      return templateWithData(data);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Generate PDF with template function
   * @return {String} name
   * @return {String} path
   */
  async generatePdf () {
    try {
      let uuid = await uuidv4();

      const browser = await puppeteer.launch({headless: true});

      const page = await browser.newPage();

      const template = await PuppeteerService.templateWithData();

      await page.setContent(template);

      // generate pdf with custom config
      await page.pdf({
        path: `src/upload/puppeteer/report-${uuid}.pdf`,
        format: 'A4',
        margin: {
          bottom: 100,
          left: 35,
          right: 35,
          top: 100
        },
        displayHeaderFooter: this.header || this.footer ? true : false, //if header or footer != null then display 
        headerTemplate: this.header ?? '<div></div>',
        footerTemplate: this.footer ?? '<div></div>',
        printBackground: true
      });
    
      await browser.close();

      return {
        name: `report-${uuid}.pdf`,
        path: `src/upload/puppeteer/report-${uuid}.pdf`
      };
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = PuppeteerService;