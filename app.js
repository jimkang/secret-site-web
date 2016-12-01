var request = require('basic-browser-request');
var sb = require('standard-bail')();
var d3 = require('d3-selection');
var leaflet = require('leaflet');

const mapsApiKey = 'AIzaSyB4fdXriqOg-USlaTXDoEOb7JYIVHblYGs';

L.Icon.Default.imagePath = 'http://api.tiles.mapbox.com/mapbox.js/v2.2.1/images';
const publicAccessToken = 'pk.eyJ1IjoiZGVhdGhtdG4iLCJhIjoiY2lpdzNxaGFqMDAzb3Uya25tMmR5MDF6ayJ9.ILyMA2rUQZ6nzfa2xT41KQ';

const tileURLTemplate = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' +
  publicAccessToken;

var tileLayerOpts = {
  // attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  attribution: '© Mapbox © OpenStreetMap © DigitalGlobe',
  zoom: 13,
  id: 'mapbox.satellite',
  accessToken: publicAccessToken
};

((function go() {
  var siteName = window.location.hash.split('#')[1].split('/')[1];
  var dataURL = window.location.protocol + '//' + window.location.host + '/data/' + siteName + '.json';
  var reqOpts = {
    method: 'GET',
    url: dataURL,
    json: true
  };
  request(reqOpts, sb(renderSite, logError));
})());

function renderSite(res, site) {
  console.log(site);

  // d3.select('#google-maps-frame').attr('src', streetviewMapURL);
  var initial = site.name.charAt(0);

  var mapImageURL = 'https://maps.googleapis.com/maps/api/staticmap?' +
    `center=${site.location.lat},${site.location.lng}` +
    '&zoom=13' +
    '&scale=2' +
    '&size=600x600' +
    '&maptype=satellite' +
    `&markers=color:black%7Clabel:${initial}%7C${site.location.lat},${site.location.lng}` +
    `&key=${mapsApiKey}`;

  d3.select('#google-map').attr('src', mapImageURL);

  var map = L.map('map', {zoomControl: false}).setView(site.location, 14);
  L.tileLayer(tileURLTemplate, tileLayerOpts).addTo(map);
}

function logError(error) {
  if (error) {
    console.error(error, error.stack);
  }
}
