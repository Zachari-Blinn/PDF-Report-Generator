const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const ejs = require('ejs');
const fs = require('fs');

class PdfService {

  // Private attribute
  #name;
  #logo;
  #header;
  #footer;
  #parsedData;
  #templatePath;

  /**
   * Constructor of Puppeteer pdf generator
   * @param {String} name
   * @param {String} logo
   * @param {String} header
   * @param {String} footer
   * @param {JSON} parsedData
   * @param {String} templatePath
   */
  constructor (name, logo, header, footer, parsedData, templatePath) {
    this.#name = name;
    this.#logo = logo;
    this.#header = header;
    this.#footer = footer;
    this.#parsedData = parsedData;
    this.#templatePath = templatePath;
  }

  /**
   * @param {String} html
   */
  setFooter (html) {
    this.#footer = html;
  }

  /**
   * @param {String} html
   */
  setHeader (html) {
    this.#header = html;
  }

  /**
   * @param {String} path
   */
  setTemplatePath (path) {
    this.#templatePath = path;
  }

  /**
   * @param {JSON} parsedData
   */
  setParsedData (parsedData) {
    this.#parsedData = parsedData;
  }

  /**
   * Parse data and set html/ejs template
   * @return {Array} parsed data
   */
  async templateWithData () {
    try {
      const data = this.#parsedData;

      const content = fs.readFileSync(this.#templatePath, 'utf8');

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

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-dev-shm-usage', '--no-sandbox']
      });

      const page = await browser.newPage();

      const template = await this.templateWithData();

      await page.setContent(template);

      // generate pdf with custom config
      await page.pdf({
        path: `src/upload/puppeteer/report-${uuid}.pdf`,
        format: 'A4',
        margin: {
          top: "50px",
          bottom: "45px",
          left: "50px",
          right: "50px"
        },
        displayHeaderFooter: !!(this.#header || this.#footer), //if header or footer != null then display
        headerTemplate: this.#header ?? '<div></div>',
        footerTemplate: this.#footer ?? '<div></div>',
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


module.exports = PdfService;