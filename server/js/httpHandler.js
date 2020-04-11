const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messageQueue = require('./messageQueue.js')

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'GET') {
    if (req.url === '/') {
      res.writeHead(200, headers);
      res.end(messageQueue.dequeue());
    }

    if (req.url === '/?command=random') {
      res.writeHead(200, headers);
      res.end(randomSwimDirection());
    }

    if (req.url === '/?move=move') {
      res.writeHead(200, headers)
      var check = false;
      while (!check) {
        var messageToSend = messageQueue.dequeue();
        if (!messageToSend){
          check = true;
          res.end();
        } else {
          res.write(messageToSend);
        }

      }
    }

    if (req.url === '/?background=1') {
      fs.readFile(this.backgroundImageFile, (err, data) => {
        if (err) throw err;
        res.end(data);
      })
    }

  }

  next();
};

var randomSwimDirection = () => {
  var options = ['up', 'down', 'left', 'right'];
  return options[Math.floor(Math.random() * 4)];
}
