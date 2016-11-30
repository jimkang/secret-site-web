var request = require('basic-browser-request');
var sb = require('standard-bail')();
var d3 = require('d3-selection');
const mapsApiKey = 'AIzaSyB4fdXriqOg-USlaTXDoEOb7JYIVHblYGs';

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
  
  // var streetviewMapURL = 'https://www.google.com/maps/embed/v1/view' +
  //   `?key=${mapsApiKey}` +
  //   `&center=${site.location.lat},${site.location.lng}` +
  //   '&zoom=18' +
  //   '&maptype=satellite';

  // d3.select('#google-maps-frame').attr('src', streetviewMapURL);
  var initial = site.name.charAt(0);

  var mapImageURL = 'https://maps.googleapis.com/maps/api/staticmap?' +
    `center=${site.location.lat},${site.location.lng}` +
    '&zoom=8' +
    '&scale=2' +
    '&size=600x600' +
    '&maptype=hybrid' +
    `&markers=color:black%7Clabel:${initial}%7C${site.location.lat},${site.location.lng}` +
    `&key=${mapsApiKey}`;

  d3.select('body').append('img')
    .attr('src', mapImageURL)
    .classed('map-image', true);
}

function logError(error) {
  if (error) {
    console.error(error, error.stack);
  }
}
