/* global L */

var d3 = require('d3-selection');
require('leaflet');
var state = require('./data/state.json');
var qs = require('qs');

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

var closeUpMap;
var broadMap;
var closeUpMapMarker;
var broadMapMarker;

((function go() {
  closeUpMap = L.map('map', {zoomControl: false});
  broadMap = L.map('broad-map', {zoomControl: false});

  L.tileLayer(tileURLTemplate, tileLayerOpts).addTo(closeUpMap);
  L.tileLayer(tileURLTemplate, tileLayerOpts).addTo(broadMap);

  window.onhashchange = route;
  route();
})());

function renderSite(site) {
  console.log(site);

  if (closeUpMapMarker) {
    closeUpMapMarker.remove();
  }

  closeUpMap.setView(site.location, 13);

  closeUpMapMarker = L.polygon([
    site.location,
    {lat: site.location.lat - 0.001, lng: site.location.lng + 0.001},
    {lat: site.location.lat - 0.001, lng: site.location.lng - 0.001}
  ]);
  closeUpMapMarker.addTo(closeUpMap);

  if (broadMapMarker) {
    broadMapMarker.remove();
  }

  broadMap.setView(site.location, 4);

  broadMapMarker = L.marker(site.location);
  broadMapMarker.addTo(broadMap);

  d3.select('#site-name').text(site.name);
  d3.select('#containing-entity-name').text(site.containingGeoEntity);
  d3.select('#coords').text(site.location.lat + ', ' + site.location.lng);

  var writeup = d3.select('#writeup');
  var events = writeup.selectAll('.historical-event').data(site.history);
  events.exit().remove();
  var newEvents = events.enter()
    .append('p').classed('historical-event', true);
  newEvents.merge(events)
    .text(e => `${site.name} was ${e.event} by ${e.actor.name}, driven by their hatred of ${e.actor.enemies.join(' and ')}.`);
}

function renderIndex(sites) {
  var indexRoot = d3.select('#index ul');
  var siteItems = indexRoot.selectAll('.site-item').data(sites);
  siteItems.exit().remove();
  var newSiteItems = siteItems.enter().append('li').classed('site-item', true);
  newSiteItems.append('a');

  var currentSiteItems = newSiteItems.merge(siteItems);
  currentSiteItems.selectAll('a')
    .attr('href', getSiteLink)
    .text(identity);
}

function logError(error) {
  if (error) {
    console.error(error, error.stack);
  }
}

function route() {
  var routeDict = qs.parse(window.location.hash.replace('#/', ''));
  if ('index' in routeDict) {
    renderIndex(Object.keys(state.sites));
  }
  else if ('site' in routeDict) {
    renderSite(state.sites[routeDict.site]);
  }
}

function identity(x) {
  return x;
}

function getSiteLink(siteName) {
  return '#/site=' + siteName;
}
