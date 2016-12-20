function containingGeoEntityToString(entity) {
  var currentEntity = entity;
  var segments = [];
  while (currentEntity) {
    if (typeof currentEntity === 'string') {
      segments.push(currentEntity);
    }
    else {
      segments.push(currentEntity.name);
    }
    currentEntity = currentEntity.containingGeoEntity;    
  }

  if (segments.length > 0) {
    return segments.join(', ');
  }
  else {
    return 'the Sea';
  }
}

module.exports = containingGeoEntityToString;
