'use strict';

const translate = require('google-translate-api');
const fs = require("fs");
const path = require('path');



module.exports = (pluginContext) => {

  const shell = pluginContext.shell;
  const logger = pluginContext.logger;
  let html = '';

  let targetLN = "";
  let searchQuery = "";
  let translation = "";

  function startup() {
    html = fs.readFileSync(path.join(__dirname, 'preview.html'), 'utf8');
    //logger.log("startup: " + path.join(__dirname, 'preview.html'));
  }



  function search(query, res) {

    const query_trim = query.trim();
    searchQuery = query_trim;

    //var result = translateQuery(searchQuery);
    logger.log("11111) search started");
    translateQuery(query_trim);
    res.add({
      //logger.log("res add");
      title: query_trim,
      id: translation,
      desc: 'this is your query',
      payload: 'open',
      preview: true
    });
    logger.log("44444) after res add");
    return;
  }
  function translateQuery(input){
    logger.log("22222) translateQuery called: " + input);
    translate(input, {to: "en"}).then(result => {
      logger.log("33333) result: " + result.text);
      translation = result.text;
      return result.text;
    }).catch(err => {
        console.error(err);
    });
  }

  function defineTarget(inputLN){
    if(inputLN == "en"){
      targetLN = "de";
    }
    else{
      targetLN = "en";
    }
    return targetLN;
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
