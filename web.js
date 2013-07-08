var express = require('express');
var fs = require('fs');
var app = express.createServer(express.logger());

var readIndex = new fs.readFileSync('index.html');

var bufIndex = new Buffer(readIndex, "utf-8");

app.get('/', function(request, response) {
    response.send(bufIndex.toString());
};
 
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
   

