var $searchBar = document.querySelector('.search-bar');
var $searchSubmitButton = document.querySelector('.submit-search');
function saveLocationToData(event) {
  if ($searchBar.value !== '') {
    event.preventDefault();
    data.locations.push({
      Location: $searchBar.value,
      Main: false,
      Temperature: false,
      High: false,
      Low: false,
      Wind: false,
      Humidity: false,
      SunsetSunrise: false
    });
    data.editing = $searchBar.value;
    $locationAsker.classList.toggle('hidden');
    $weatherInformationChoices.classList.toggle('hidden');
    $weatherChoicesQuestion.textContent = 'Weather Information for:';
    var $weatherChoicesLocation = document.createElement('h1');
    $weatherChoicesLocation.textContent = data.editing;
    $weatherChoicesLocation.className = 'italics set-margins font-size-1rem';
    $weatherChoicesQuestion.appendChild($weatherChoicesLocation);
  }
}
$searchSubmitButton.addEventListener('click', saveLocationToData);

var $weatherInformationChoices = document.querySelector('.weather-information-choices');
var $weatherChoicesQuestion = document.querySelector('.weather-information-choices-question');
var $locationAsker = document.querySelector('.location-asker');
var $weatherChoicesList = document.querySelector('.list-of-weather-choices');
var weatherOptions = ['Main', 'Temperature', 'High', 'Low', 'Wind', 'Humidity', 'SunsetSunrise'];
function alternateIcon(event) {
  var optionChosen = event.target.value;
  var circleOrCheck = event.target.children[0].className;
  if (event.target && event.target.nodeName === 'LI') {
    if (circleOrCheck === 'far fa-circle') {
      event.target.children[0].className = 'far fa-check-circle';
      data.locations[0][weatherOptions[optionChosen]] = true;
      console.log(data.locations[0][weatherOptions[optionChosen]]);
    } else if (circleOrCheck === 'far fa-check-circle') {
      event.target.children[0].className = 'far fa-circle';
      data.locations[0][weatherOptions[optionChosen]] = false;
      console.log(data.locations[0][weatherOptions[optionChosen]]);
    }
  }
}
$weatherChoicesList.addEventListener('click', alternateIcon);
