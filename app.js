var request = require('basic-browser-request');
var sb = require('standard-bail')();
var d3 = require('d3-selection');
var leaflet = require('leaflet');
var state = require('./data/state.json');

const mapsApiKey = 'AIzaSyB4fdXriqOg-USlaTXDoEOb7JYIVHblYGs';
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
  var segments = window.location.hash.split('#')[1].split('/');
  var siteName = segments[1];
  renderSite(state.sites[siteName]);
})());

function renderSite(site) {
  console.log(site);

  var closeUpMap = L.map('map', {zoomControl: false}).setView(site.location, 13);
  L.tileLayer(tileURLTemplate, tileLayerOpts).addTo(closeUpMap);

  var polygon = L.polygon([
    site.location,
    {lat: site.location.lat - 0.001, lng: site.location.lng + 0.001},
    {lat: site.location.lat - 0.001, lng: site.location.lng - 0.001}
  ])
  .addTo(closeUpMap);


  var broadMap = L.map('broad-map', {zoomControl: false}).setView(site.location, 4);
  L.tileLayer(tileURLTemplate, tileLayerOpts).addTo(broadMap);
  L.marker(site.location).addTo(broadMap)


  d3.select('#site-name').text(site.name);
  d3.select('#containing-entity-name').text(site.containingGeoEntity);
  d3.select('#coords').text(site.location.lat + ', ' + site.location.lng);

  var writeup = d3.select('#writeup');
  var events = writeup.selectAll('.historical-event').data(site.history);
  events.enter()
    .append('p').classed('historical-event', true)
    .text(e => `${site.name} was ${e.event} by ${e.actor.name}, driven by their hatred of ${e.actor.enemies.join(' and ')}.`);
}

function logError(error) {
  if (error) {
    console.error(error, error.stack);
  }
}
