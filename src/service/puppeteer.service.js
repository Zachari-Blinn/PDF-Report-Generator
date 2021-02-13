const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const ejs = require('ejs');
const Util = require('util')
const Fs = require('fs')  
const ReadFile = Util.promisify(Fs.readFile);

class PuppeteerService {

  /**
   * Constructor of Puppeteer pdf generator
   * @param { String } name 
   * @param { String } logo 
   * @param { Array } data 
   */
  constructor (name, logo, data) {
    this.name = name;
    this.logo = logo;
    this.data = data;
  }

  /**
   * Parse data and set html/ejs template
   * @return { Array } parsed data
   */
  static async template () {
    try {
      const rawdata = await ReadFile('src/service/data.json');

      const data = {data: JSON.parse(rawdata)};

      const content = await ReadFile('views/template/report.ejs', 'utf8');

      const template = ejs.compile(content);

      return template(data);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Generate PDF with template function
   * @return { String } name
   * @return { String } path
   */
  async generate () {
    try {
      let uuid = await uuidv4();

      const browser = await puppeteer.launch({headless: true});

      const page = await browser.newPage();

      const template = await PuppeteerService.template();

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
        displayHeaderFooter: true,
        footerTemplate: `
          <div style="color: lightgray; border-top: solid lightgray 1px; font-size: 10px; padding-top: 5px; text-align: center; width: 100%;">
            <span>This is a test message</span> - <span class="pageNumber"></span>
          </div>
        `,
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