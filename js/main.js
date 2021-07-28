var $searchBar = document.querySelector('.search-bar');
var $locationForm = document.querySelector('.location-form');
var $searchSubmitButton = document.querySelector('.submit-search');
var $weatherInformationChoices = document.querySelector('.weather-information-choices');
var $weatherChoicesQuestion = document.querySelector('.weather-information-choices-question');
var $locationAsker = document.querySelector('.location-asker');
var $weatherChoicesList = document.querySelector('.list-of-weather-choices');
var $weatherOptionsSubmitButton = document.querySelector('.submit-choices');

$searchSubmitButton.addEventListener('click', queryLocation);
$weatherOptionsSubmitButton.addEventListener('click', appendLocationsList);
$weatherChoicesList.addEventListener('click', alternateIcon);
$weatherOptionsSubmitButton.addEventListener('click', showWeatherDataObject);

function queryLocation(event) {
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  var firstPartLink = 'https://api.openweathermap.org/data/2.5/weather?q=';
  var locationURL = $searchBar.value;
  var latterPartLink = '&units=imperial&appid=ea53d3f85461dc36f6f6ec5c9722353e';
  var fullLink = firstPartLink + locationURL + latterPartLink;
  xhr.open('GET', fullLink);
  xhr.responseType = 'json';
  xhr.send();
  xhr.addEventListener('load', function () {
    if ($searchBar.value !== '' && xhr.status === 200) {
      data.editing = $searchBar.value;
      toggleHidden($locationAsker);
      toggleHidden($weatherInformationChoices);
      data.template.location = data.editing;
      createWeatherQuestion();
    } else {
      if ($locationAsker.children[2] !== undefined) {
        $locationAsker.children[2].remove();
      }
      $locationAsker.appendChild(invalidLocationNotice());
      $locationForm.reset();
    }
  });
}

function invalidLocationNotice() {
  var invalidText = 'Please put an appropriate location!';
  var $invalidTextElement = document.createElement('p');
  $invalidTextElement.textContent = invalidText;
  $invalidTextElement.className = 'italics red-font text-shadow-none top-bottom-margins-none';
  return $invalidTextElement;
}

function createWeatherQuestion() {
  $weatherChoicesQuestion.textContent = 'Weather in:';
  var $weatherChoicesLocation = document.createElement('h1');
  $weatherChoicesLocation.textContent = data.editing;
  $weatherChoicesLocation.className = 'italics set-margins font-size-2rem';
  $weatherChoicesQuestion.appendChild($weatherChoicesLocation);
}

function alternateIcon(event) {
  var circleOrCheck = event.target.children[0].className;
  if (event.target && event.target.nodeName === 'LI') {
    if (circleOrCheck === 'far fa-circle') {
      event.target.children[0].className = 'far fa-check-circle';
      data.template[data.weatherOptions[event.target.value]] = true;
    } else if (circleOrCheck === 'far fa-check-circle') {
      event.target.children[0].className = 'far fa-circle';
      data.template[data.weatherOptions[event.target.value]] = false;
    }
  }
}

function toggleHidden(elementClass) {
  elementClass.classList.toggle('hidden');
}

function appendLocationsList(event) {
  data.locations.push(data.template);
  resetDataTemplate();
  toggleHidden($weatherInformationChoices);
  toggleHidden($weatherDisplayPrimaryList);
}

function resetDataTemplate() {
  for (var optionIndex = 0; optionIndex < data.weatherOptions.length; optionIndex++) {
    data.template[data.weatherOptions[optionIndex]] = false;
  }
  data.template.location = null;
  data.editing = null;
}

var $weatherDisplayPrimaryList = document.querySelector('.weather-display-primary');
var $displayPrimaryWeatherItemList = document.querySelectorAll('.display-primary-weather-item');

function showWeatherDataObject(location) {
  var xhr = new XMLHttpRequest();
  var firstPartLink = 'https://api.openweathermap.org/data/2.5/weather?q=';
  var locationURL = location.location;
  var latterPartLink = '&units=imperial&appid=ea53d3f85461dc36f6f6ec5c9722353e';
  var fullLink = firstPartLink + locationURL + latterPartLink;
  xhr.open('GET', fullLink);
  xhr.responseType = 'json';
  xhr.send();
  xhr.addEventListener('load', function () {
    if (location.main === true) {
      $displayPrimaryWeatherItemList[0].textContent = xhr.response.weather[0].main;
    } else if (location.main !== false) {
      $displayPrimaryWeatherItemList[0].remove();
    }
    if (location.temperature === true) {
      $displayPrimaryWeatherItemList[1].textContent += ' ' + xhr.response.main.temp + '° F';
    }
    if (location.high === true) {
      $displayPrimaryWeatherItemList[2].textContent += ' ' + xhr.response.main.temp_max + '° F';
    }
    if (location.low === true) {
      $displayPrimaryWeatherItemList[3].textContent += ' ' + xhr.response.main.temp_min + '° F';
    }
    if (location.wind === true) {
      $displayPrimaryWeatherItemList[4].textContent += ' ' + xhr.response.wind.speed + ' mph';
    }
    if (location.humidity === true) {
      $displayPrimaryWeatherItemList[5].textContent += ' ' + xhr.response.main.humidity + '%';
    }
    if (location.sunsetSunrise === true) {
      $displayPrimaryWeatherItemList[6].textContent += ' ' + convertUnixTimeStamp(xhr.response.sys.sunrise) + ' / ' + convertUnixTimeStamp(xhr.response.sys.sunset);
    }
    for (var displayIndex = 0; displayIndex < $displayPrimaryWeatherItemList.length; displayIndex++) {
      if (location[data.weatherOptions[displayIndex]] === false) {
        $displayPrimaryWeatherItemList[displayIndex].remove();
      }
    }
  });
}

function convertUnixTimeStamp(unix) {
  var time = new Date(unix * 1000);
  var pastNoon = null;
  var hours = time.getHours();
  if (hours > 12) {
    pastNoon = ' PM';
    hours -= 12;
  } else {
    pastNoon = ' AM';
  }
  var minutes = '0' + time.getMinutes();
  var formattedTime = hours + ':' + minutes.substr(-2) + pastNoon;
  return formattedTime;
}
