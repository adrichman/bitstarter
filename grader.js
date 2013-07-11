#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development and basic DOM parsing.

References:
 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var util = require('util');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var urlHtml;
var htmlUrlString;
var rest = require('restler');
var checkUrl = false;
var file;
var returnString = " hello ?";

var buildfn = function(htmlUrlString, checksString) {

  var writeHtml = function(result, response) {
    if (result instanceof Error) {
        console.error('Error: ' + util.format(response.message));
    } else {
        // console.error("Wrote %s", htmlUrlString);
        checkUrl = true;
        // console.error('checkUrl is true');
        // console.error(htmlUrlString);
        fs.writeFileSync(htmlUrlString, result);
        return checkHtmlUrl(htmlUrlString, checksString);
    }  
  };
  return writeHtml;
};

var writeUrlHtmlFunction = function(program, checks){    
  var checksString = checks.toString();
  var htmlUrlArray = program.split("/");
  // console.log(htmlUrlArray);
  var htmlUrlString = htmlUrlArray[2] + "-urlHtml.html";
  // console.log("got the string");
  var writeHtml = buildfn(htmlUrlString, checksString);
  rest.get(program).on('complete', writeHtml);

};

var assertUrlExists = function(infile) {
  var instr = infile.toString();
  return instr;
};


var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

 

var cheerioHtmlFile = function(htmlfile) {
    // console.log("cheerio " + htmlfile);
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
     var present = $(checks[ii]).length > 0;
     out[checks[ii]] = present;
    }
    console.log(out);
    JSON.stringify(checkJson, null, 4);
    return out;
};

var checkHtmlUrl = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
     var present = $(checks[ii]).length > 0;
     out[checks[ii]] = present;
    }
    console.log(out);
    JSON.stringify(checkJson, null, 4);
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};


if(require.main == module) {
    program
  .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
  .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
  .option('-u --url <html_url>', 'url Path', clone(assertUrlExists))
  .parse(process.argv);

  var JsonUrl = false;
  if (program.url) {
    var JsonUrl = true; 
    var checkJson = writeUrlHtmlFunction(program.url, program.checks);
  } else {
    var checkJson = checkHtmlFile(program.file, program.checks);
  } 



} else {
    exports.checkHtmlFile = checkHtmlFile;
}
