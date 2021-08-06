/* exported data */
var data = {
  locations: [],
  editing: null,
  primary: null,
  template: {
    location: null,
    main: true,
    temperature: true,
    high: true,
    low: true,
    wind: true,
    humidity: true,
    sunsetSunrise: true
  },
  weatherOptions: ['main', 'temperature', 'high', 'low', 'wind', 'humidity', 'sunsetSunrise'],
  greetings: ['Good Morning', 'Hello', 'Good Afternoon', 'Good Evening', 'Sleep Tight'],
  responses: {
    sunny: ['Great day for a picnic', 'Have fun outside!'],
    rainy: ['Maybe stay indoors today', 'Don\'t forget to bring an umbrella!'],
    night: ['Time to wind down!', 'Don\'t stay up too late!'],
    afternoon: ['Hope your day was good!', 'How are you?']
  },
  profile: {
    name: null,
    birthday: null,
    email: null
  }
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
