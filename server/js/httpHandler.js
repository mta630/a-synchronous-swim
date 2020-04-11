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

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  }

  if (req.method === 'GET') {

    if (req.url === '/?command=random') {
      fs.writeHead(200, headers);
      res.end(randomSwimDirection());
    }

    if (req.url === '/?move=move') {
      res.writeHead(200, headers);
      var command = messageQueue.dequeue();
      if (command) {
        res.end(command);
      } else {
        res.end();
      }
    }

    if (req.url === '/background.jpg') {
        fs.readFile(module.exports.backgroundImageFile, (err, data) => {
        if (err) {
           res.writeHead(404);
        } else {
          res.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Length': data.length
          });
          res.write(data, 'binary');
        }
        res.end()
        next();
      });
    }

  }

  if (req.method === 'POST' && req.url === '/background.jpg') {
    if (req.url === '/background.jpg') {
      var imageFile = Buffer.alloc(0);
      req.on('data', chunk => {
        imageFile = Buffer.concat([imageFile, chunk]);
      });
      req.on('end', ()=> {
        var imageData = multipart.getFile(imageFile);
        fs.writeFile(module.exports.backgroundImageFile, imageData.data, (err) => {
          if (err){
            res.writeHead(400)
          } else {
            res.writeHead(201, headers);
          }
          res.writeHead(201, headers);
          res.end();
          next();
        });

      });
      }
    }
};

var randomSwimDirection = () => {
  var options = ['up', 'down', 'left', 'right'];
  return options[Math.floor(Math.random() * 4)];
}
