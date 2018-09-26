//basic requirements for a express server
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fs = require('fs');
const lineReader = require('line-reader');

// need to make an app variable to use
const app = express();

// tell our app what to use

app.use(morgan('dev'));

app.use(cors());




let coordinateArray = [];

var megaObj = {};

app.get('/getit', (request, response) => {


  lineReader.eachLine('./FacebookPlaces_Albuquerque.csv', function(line, last) {

      let lineAry = [];
      ////////// filter original lines, push them to new array
      for (let i = line.length -1; i >= line.length -3; i--) {
        if (line[line.length-1] === ',' && line[line.length-2] === ',') {
          let formattedLine = line.substring(0, line.length - 3);
          lineAry.push(formattedLine);
        } else if (line[line.length-1] === ',' && !isNaN(line[line.length-2])) {
          let formattedLine = line.substring(0, line.length - 1);
          lineAry.push(formattedLine)
        } else {
          let formattedLine = line.substring(0, line.length);
          lineAry.push(formattedLine);
        }
      }
      ///////// take array of filtered lines, loop through them, find the
      ////////  index we care about (where the 2nd comma is), store that index
      ////////  use that index to split the string into parts you care about
      ////////  put those string parts into the megaObj
      let indy;
      let commaCount = 0;
      for (let i = lineAry.length-1; i > 0; i--) {
        for (let j = lineAry[i].length -1; j >= 0; j--) {
          if (commaCount < 2) {
            if (lineAry[i][j] === ',') {
              commaCount++;
              indy = j;
            }
          }
        }
        let bizName = lineAry[i].substring(0, indy);
        let bizCoords = lineAry[i].substring(indy+1, lineAry[i].length);
        megaObj[bizName] = bizCoords;
      }
      //////////// log all the data

  /////// write new file based on the filtered data
})
fs.writeFile('formattedData.json', JSON.stringify(megaObj, null, 4), function(err) {
  console.log('File successfully written! - Check your project directory for the formattedData.json file!');
})
})


// BOILERPLATE EXPRESS SERVER STUFF
// app.get('/poop', (request, response) => {
//   response.json({
//     message: 'Youve made it to the hidden endpoint!'
//   })
// })
//
// function notFound(request, response, next) {
//   response.status(404);
//   const error = new Error('Not Found - ' + request.originalUrl);
//   next(error);
// }
//
// function errorHandler(error, request, response, next) {
//   response.status(response.statusCode || 500);
//   response.json({
//     message: error.message,
//     stack: error.stack
//   });
// }
//
// app.use(notFound);
// app.use(errorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log('Listening on port ', port);
});
