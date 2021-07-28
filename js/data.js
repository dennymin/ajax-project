/* exported data */
var data = {
  locations: [],
  view: 'entry-form',
  editing: null,
  template: {
    Location: null,
    Main: false,
    Temperature: false,
    High: false,
    Low: false,
    Wind: false,
    Humidity: false,
    SunsetSunrise: false
  },
  weatherOptions: ['Main', 'Temperature', 'High', 'Low', 'Wind', 'Humidity', 'SunsetSunrise']
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
