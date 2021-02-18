# pdf-test

## Description

pdf-test is a clean formatted integration of the google puppeteer addon

## Prerequisite and install

1. Install in your project puppeteer with NPM: `npm i puppeteer`
2. Recover and import ServicePuppeter file located in "/src/service/ServicePuppeteer" of this repository to your project

## Generate an PDF

For generating pdf with PuppeteerService, first you need to import the class named servicePuppeteer where he is located

`const PuppeteerService = require('./src/service/puppeteer.service');`

### Use

`const pdf = new PuppeteerService(name, logo, header, footer, parsedData, templatePath);`

### Methods

* `pdf.setHeader(String html);`
* `pdf.setFooter(String html);`
* `pdf.setTemplatePath(String path)`
* `pdf.setParsedData(JSON parsedData)`

### Use example

<p align="center">
  <img src="./img/use_example.png" alt="Size Limit CLI">
</p>
