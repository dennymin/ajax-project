var $searchBar = document.querySelector('.search-bar');
var $searchSubmitButton = document.querySelector('.submit-search');
function queryLocation(event) {
  if ($searchBar.value !== '') {
    event.preventDefault();
    data.editing = $searchBar.value;
    $locationAsker.classList.toggle('hidden');
    $weatherInformationChoices.classList.toggle('hidden');
    locationWeatherInformation.location = data.editing;
    createWeatherQuestion();
  }
}
$searchSubmitButton.addEventListener('click', queryLocation);

function createWeatherQuestion() {
  $weatherChoicesQuestion.textContent = 'Weather Information for:';
  var $weatherChoicesLocation = document.createElement('h1');
  $weatherChoicesLocation.textContent = data.editing;
  $weatherChoicesLocation.className = 'italics set-margins font-size-1rem';
  $weatherChoicesQuestion.appendChild($weatherChoicesLocation);
}

var $weatherInformationChoices = document.querySelector('.weather-information-choices');
var $weatherChoicesQuestion = document.querySelector('.weather-information-choices-question');
var $locationAsker = document.querySelector('.location-asker');
var $weatherChoicesList = document.querySelector('.list-of-weather-choices');
var weatherOptions = ['Main', 'Temperature', 'High', 'Low', 'Wind', 'Humidity', 'SunsetSunrise'];
var locationWeatherInformation = {};
for (var optionIndex = 0; optionIndex < weatherOptions.length; optionIndex++) {
  locationWeatherInformation[weatherOptions[optionIndex]] = false;
}

function alternateIcon(event) {
  var circleOrCheck = event.target.children[0].className;
  if (event.target && event.target.nodeName === 'LI') {
    if (circleOrCheck === 'far fa-circle') {
      event.target.children[0].className = 'far fa-check-circle';
      locationWeatherInformation[weatherOptions[event.target.value]] = true;
      // console.log(locationWeatherInformation[weatherOptions[event.target.value]]);
    } else if (circleOrCheck === 'far fa-check-circle') {
      event.target.children[0].className = 'far fa-circle';
      locationWeatherInformation[weatherOptions[event.target.value]] = false;
      // console.log(locationWeatherInformation[weatherOptions[event.target.value]]);
    }
  }
}
$weatherChoicesList.addEventListener('click', alternateIcon);

function appendLocationsList(event) {
  data.locations.push(locationWeatherInformation);
  resetOptions();
}

function resetOptions() {
  locationWeatherInformation = {};
  for (var optionIndex = 0; optionIndex < weatherOptions.length; optionIndex++) {
    locationWeatherInformation[weatherOptions[optionIndex]] = false;
  }
}

var $weatherOptionsSubmitButton = document.querySelector('.submit-choices');
$weatherOptionsSubmitButton.addEventListener('click', appendLocationsList);
