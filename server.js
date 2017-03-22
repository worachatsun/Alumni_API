var express = require('express');
var app = express()

http.createServer(function(req,res){
  res.writeHead({
    'Content-Type' : 'text/plain'
  });
  res.end('Hello World');
}).listen(3000);

console.log('Server at 3000');

module.exports = app;
