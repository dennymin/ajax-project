/* exported data */
var data = {
  locations: [],
  view: 'entry-form',
  editing: null
};

var previousDataJSON = localStorage.getItem('weather-data');
if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

function storeLocal(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('weather-data', dataJSON);
}
window.addEventListener('beforeunload', storeLocal);
