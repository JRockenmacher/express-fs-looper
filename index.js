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

var content = {};
let name = '';
let coordinateArray = [];
let coordinates = { };


app.get('/readTheLines', (request, response) => {

  lineReader.eachLine('./FacebookPlaces_Albuquerque.csv', function(line, last) {

        for (let i = 0; i < line.length; i++) {
          // console.log("in tha loop.......");
          if ((line[i] === ',' && line[i+1] === '-') || (line[i] === ',' && !isNaN(line[i+1]))) {
            console.log("its a comma followed by a number or - sign");
            // console.log(isNaN(line[i+2]));
            if ((!isNaN(line[i+2]) && !isNaN(line[i+3])) || (!isNaN(line[i+2]) && line[i+3] === '.' )) {
              console.log("definitely a number!!!");
              let coords = line.substring(i+1)
              let bizName = line.substring(0, i);

              console.log("coordinates ", coords);
              console.log("biz name? ", bizName);
              // coordinateArray.push(coords);
            }


            // coordinateArray.push()
        }
      }
      // console.log(coordinateArray[0], coordinateArray[1]);
    // }
    if(last){
      // or check if it's the last one
    }
  })
})

app.get('/poop', (request, response) => {
  response.json({
    message: 'Youve made it to the hidden endpoint!'
  })
})

function notFound(request, response, next) {
  response.status(404);
  const error = new Error('Not Found - ' + request.originalUrl);
  next(error);
}

function errorHandler(error, request, response, next) {
  response.status(response.statusCode || 500);
  response.json({
    message: error.message,
    stack: error.stack
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log('Listening on port ', port);
});
