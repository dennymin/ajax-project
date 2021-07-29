/* exported data */
var data = {
  locations: [],
  view: 'entry-form',
  editing: null,
  primary: null,
  template: {
    location: null,
    main: false,
    temperature: false,
    high: false,
    low: false,
    wind: false,
    humidity: false,
    sunsetSunrise: false
  },
  weatherOptions: ['main', 'temperature', 'high', 'low', 'wind', 'humidity', 'sunsetSunrise']
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
