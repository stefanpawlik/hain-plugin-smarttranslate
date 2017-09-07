'use strict';

const translate = require('./node_modules/google-translate-api');
const fs = require("fs");
const path = require('path');



module.exports = (pluginContext) => {

  const shell = pluginContext.shell;
  const logger = pluginContext.logger;
  let html = '';

  function startup() {
    html = fs.readFileSync(path.join(__dirname, 'preview.html'), 'utf8');
    //logger.log("startup: " + path.join(__dirname, 'preview.html'));
  }

  function search(query, res) {
    const query_trim = query.trim();
  //  logger.log("title: " + query_trim);
  //  logger.log("startup: " + path.join(__dirname, 'preview.html'));

  translate(query_trim, {to: 'en'}).then(result => {
      logger.log("ergebnis: " + result.text);
      res.add({
        title: query_trim,
        id: result.text,
        desc: 'this is your query',
        payload: 'open',
        preview: true
      });
      //=> I speak English
      logger.log("language " + result.from.language.iso);
      //=> nl
  }).catch(err => {
      console.error(err);
  });



      return;

  }

  function execute(id, payload) {
    if (payload !== 'open') {
      return
    }
  }

  function renderPreview(id, payload, render) {
    render(html.replace('%body%', id));
  }

  return { startup, search, execute, renderPreview };
};
