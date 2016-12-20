function formatLocation(location) {
  var dmsLat = getDegreesMinutesSeconds(location.lat);
  var dmsLng = getDegreesMinutesSeconds(location.lng);
  return formatDegreesMinutesSeconds(dmsLat, location.lat > 0 ? 'N' : 'S') + ', ' +
    formatDegreesMinutesSeconds(dmsLng, location.lng > 0 ? 'E' : 'W');
}

// Adapted from https://github.com/chilijung/dms2deg/blob/master/index.js:
function getDegreesMinutesSeconds(signedDegrees) {
  var num = signedDegrees;
  var m = num % 1;
  var d = num - m;
  m *= 60;
  var s = m % 1;
  m = m - s;
  s *= 60;

  return {
    degrees: d,
    minutes: m,
    seconds: s
  };
}

function formatDegreesMinutesSeconds(dms, directionLetter) {
  return Math.abs(dms.degrees) + '°' +
    leftPad(Math.abs(dms.minutes), 2) + '\'' +
    Math.abs(dms.seconds).toFixed(2) +
    directionLetter;
}

function leftPad(n, totalDigitsDesired) {
  var s = '' + n;
  while (s.length < totalDigitsDesired) {
    s = '0' + s;
  }
  return s;
}

module.exports = formatLocation;
