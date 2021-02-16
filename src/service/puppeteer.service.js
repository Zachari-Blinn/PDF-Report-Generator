const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const ejs = require('ejs');
const Util = require('util');
const Fs = require('fs');
const ReadFile = Util.promisify(Fs.readFile);

class PuppeteerService {

  // Private attribute
  #header;
  #footer;
  #parsedData;

  /**
   * Constructor of Puppeteer pdf generator
   * @param {String} name
   * @param {String} logo
   * @param {JSON} parsedData
   */
  constructor (name, logo, parsedData) {
    this.name = name;
    this.logo = logo;
    this.parsedData = parsedData;
  }

  /**
   * @param {String} html
   */
  setFooter (html) {
    this.footer = html;
  }

  /**
   * @param {String} html
   */
  setHeader (html) {
    this.header = html;
  }

  /**
   * @param {String} path
   */
  setTemplatePath (path) {
    this.templatePath = path;
  }

  /**
   * @param {JSON} parsedData
   */
  setParsedData (parsedData) {
    this.#parsedData = parsedData;
  }

  getParsedData () {
    return this.#parsedData;
  }

  /**
   * Parse data and set html/ejs template
   * @return {Array} parsed data
   */
  async templateWithData () {
    try {
      const data = this.getParsedData();

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

      const template = await this.templateWithData();

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
        displayHeaderFooter: !!(this.header || this.footer), //if header or footer != null then display
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