'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const superagent = require('superagent');

// configure environment variables
require('dotenv').config();
const PORT = process.env.PORT || 3000;



//routes to handle user request and send the response from our database
app.get('/location', (req,res) => {

  try {
    let location = searchToLatLong(req.query.data);
    // let cityData = require('./data/geo.json');
    // let location = new City(req.query.data, cityData);
    // console.log(location);
    .then(location => response.send(location));
    console.log(location);


  }catch(error){
    console.log('Error');
    res.status(500).send('the server issue on /location');
  }
});

app.get('/weather', (request, response) => {
  try {
    const weatherData = getWeather();
    response.send(weatherData);
  }
  catch(error) {
    console.error(error);
    response.status(500).send('Status: 500. Server error in /weather');
  }
});

function getWeather() {
  const darkskyData = require('./data/darksky.json');
  const weatherSummaries = [];
  darkskyData.daily.data.map((day) => {
    weatherSummaries.push(new Weather(day));
  });
  return weatherSummaries;
}

// constructor function to buld a city object instances
function City (req, data){

  this.search_query=req;
  this.formatted_query= data.results[0].formatted_address;
  this.latitude = data.results[0].geometry.location.lat;
  this.longitude = data.results[0].geometry.location.lng;
}

//weather constructor
function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

// tell our express server to start listening on port PORT
app.listen(PORT, () => console.log(`listening on port ${PORT}`));



function serchToLatLong(query){
  const url =`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`;
  return superagent.get(url)
    .then(res => {
      return new City(query, res);
    });   
}
