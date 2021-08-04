var $searchBar = document.querySelector('.search-bar');
var $locationForm = document.querySelector('.location-form');
var $searchSubmitButton = document.querySelector('.submit-search');
var $weatherInformationChoices = document.querySelector('.weather-information-choices');
var $locationAsker = document.querySelector('.location-asker');
var $weatherChoicesList = document.querySelector('.list-of-weather-choices');
var $weatherOptionsSubmitButton = document.querySelector('.submit-choices');
var $weatherDisplayPrimaryList = document.querySelector('.weather-display-primary');
var $displayPrimaryWeatherItemList = document.querySelectorAll('.display-primary-weather-item');
var $displayTimeLocation = document.querySelector('.display-location');
var $backgroundImage = document.querySelector('.background-image-dimensions');
var $weatherChoicesLocation = document.querySelector('.weather-location-editing');
var $previews = document.querySelector('.previews');
var $greeting = document.querySelector('.greeting');
var $recommendation = document.querySelector('.recommendation');

$searchSubmitButton.addEventListener('click', queryLocation);
$weatherChoicesList.addEventListener('click', alternateIcon);
$weatherOptionsSubmitButton.addEventListener('click', showPrimary);

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
      data.template.location = data.editing;
      if (data.locations.length === 0) {
        data.primary = data.editing;
      }
      switchView($weatherInformationChoices);
      setWeatherLocation(data.editing);
    } else {
      if ($locationAsker.children[2] !== undefined) {
        $locationAsker.children[2].remove();
      }
      $locationAsker.appendChild(invalidLocationNotice());
      $locationForm.reset();
    }
  });
}

function setWeatherLocation(location) {
  $weatherChoicesLocation.textContent = location;
}

function alternateIcon(event) {
  if (event.target && event.target.nodeName === 'LI') {
    if (event.target.children[0].className === 'far fa-circle') {
      event.target.children[0].className = 'far fa-check-circle';
      data.template[data.weatherOptions[event.target.value]] = true;
    } else if (event.target.children[0].className === 'far fa-check-circle') {
      event.target.children[0].className = 'far fa-circle';
      data.template[data.weatherOptions[event.target.value]] = false;
    }
  }
}

function appendLocationsList() {
  var dataWeatherEntryObject = Object.assign({}, data.template);
  var locationAlreadySaved = [false, null];
  for (var dataLocationsIndex = 0; dataLocationsIndex < data.locations.length; dataLocationsIndex++) {
    if (data.locations[dataLocationsIndex].location.toUpperCase() === dataWeatherEntryObject.location.toUpperCase()) {
      locationAlreadySaved = [true, dataLocationsIndex];
    }
  }
  if (locationAlreadySaved[0] === false) {
    $elmPreviewList.prepend(generateLocationsListItem(dataWeatherEntryObject.location));
    data.locations.unshift(dataWeatherEntryObject);
  } else if (locationAlreadySaved[0] === true) {
    data.locations.splice(locationAlreadySaved[1], 1, dataWeatherEntryObject);
  }
}

function resetDataTemplate() {
  for (var optionIndex = 0; optionIndex < data.weatherOptions.length; optionIndex++) {
    data.template[data.weatherOptions[optionIndex]] = true;
  }
  data.template.location = null;
  data.editing = null;
}

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
    var currentTime = new Date().getTime() / 1000;
    $displayTimeLocation.textContent = xhr.response.name + ', ' + xhr.response.sys.country;
    var $timeDisplay = document.querySelector('.display-time-of-day');
    $timeDisplay.textContent = convertUnixTimeStamp(currentTime, xhr.response.timezone, false);
    var $dateDisplay = document.querySelector('.display-date');
    $dateDisplay.textContent = convertUnixTimeStamp(currentTime, xhr.response.timezone, true);
    if (location.main === true) {
      $displayPrimaryWeatherItemList[0].textContent = 'Weather: ' + xhr.response.weather[0].main;
    }
    if (location.temperature === true) {
      $displayPrimaryWeatherItemList[1].textContent = 'Current Temp: ' + xhr.response.main.temp + '° F';
    }
    if (location.high === true) {
      $displayPrimaryWeatherItemList[2].textContent = 'High Today: ' + xhr.response.main.temp_max + '° F';
    }
    if (location.low === true) {
      $displayPrimaryWeatherItemList[3].textContent = 'Low Today: ' + xhr.response.main.temp_min + '° F';
    }
    if (location.wind === true) {
      $displayPrimaryWeatherItemList[4].textContent = 'Wind Speed: ' + xhr.response.wind.speed + ' mph';
    }
    if (location.humidity === true) {
      $displayPrimaryWeatherItemList[5].textContent = 'Humidity: ' + xhr.response.main.humidity + '%';
    }
    if (location.sunsetSunrise === true) {
      $displayPrimaryWeatherItemList[6].textContent = 'Sunrise: ' + convertUnixTimeStamp(xhr.response.sys.sunrise, xhr.response.timezone, false);
      $displayPrimaryWeatherItemList[7].textContent = 'Sunset: ' + convertUnixTimeStamp(xhr.response.sys.sunset, xhr.response.timezone, false);
    }
    for (var displayIndex = 0; displayIndex < $displayPrimaryWeatherItemList.length; displayIndex++) {
      if (location[data.weatherOptions[displayIndex]] === false && !($displayPrimaryWeatherItemList[displayIndex].className.includes('hidden'))) {
        toggleHidden($displayPrimaryWeatherItemList[displayIndex]);
      } else if (location[data.weatherOptions[displayIndex]] === true && $displayPrimaryWeatherItemList[displayIndex].className.includes('hidden')) {
        toggleHidden($displayPrimaryWeatherItemList[displayIndex]);
      }
    }
    if (location[data.weatherOptions[6]] === false && !$displayPrimaryWeatherItemList[7].className.includes('hidden')) {
      toggleHidden($displayPrimaryWeatherItemList[7]);
    } else if (location[data.weatherOptions[6]] === true && $displayPrimaryWeatherItemList[7].className.includes('hidden')) {
      toggleHidden($displayPrimaryWeatherItemList[7]);
    }
    considerSetting(currentTime, xhr.response.timezone, xhr.response.weather[0].main, xhr.response.sys.sunrise, xhr.response.sys.sunset);
    resetDataTemplate();
  });
}

function showPreviewsOfData(location) {
  var xhr2 = new XMLHttpRequest();
  var firstPartLink = 'https://api.openweathermap.org/data/2.5/weather?q=';
  var locationURL = location.location;
  var latterPartLink = '&units=imperial&appid=ea53d3f85461dc36f6f6ec5c9722353e';
  var fullLink = firstPartLink + locationURL + latterPartLink;
  var currentTime = new Date().getTime() / 1000;
  xhr2.open('GET', fullLink);
  xhr2.responseType = 'json';
  xhr2.send();
  xhr2.addEventListener('load', function () {
    var $previewName = document.createElement('div');
    var timePreview = ' ' + convertUnixTimeStamp(currentTime, xhr2.response.timezone, false);
    var mainPreview = ' ' + xhr2.response.weather[0].main;
    var currentTempPreview = ' | ' + 'Now: ' + xhr2.response.main.temp + '° F';
    var maxPreview = ' | ' + 'High: ' + xhr2.response.main.temp_max + '° F';
    var minPreview = ' | ' + 'Low: ' + xhr2.response.main.temp_min + '° F';
    var windPreview = ' | ' + xhr2.response.wind.speed + ' mph';
    var humidityPreview = ' | ' + 'Humidity: ' + xhr2.response.main.humidity + '%';
    var sunrisePreview = ' | ' + 'Sunrise: ' + convertUnixTimeStamp(xhr2.response.sys.sunrise, xhr2.response.timezone, false);
    var sunsetPreview = ' | ' + 'Sunset: ' + convertUnixTimeStamp(xhr2.response.sys.sunset, xhr2.response.timezone, false);
    if (location.main === false) {
      mainPreview = '';
    }
    if (location.temperature === false) {
      currentTempPreview = '';
    }
    if (location.high === false) {
      maxPreview = '';
    }
    if (location.low === false) {
      minPreview = '';
    }
    if (location.wind === false) {
      windPreview = '';
    }
    if (location.humidity === false) {
      humidityPreview = '';
    }
    if (location.sunsetSunrise === false) {
      sunrisePreview = '';
      sunsetPreview = '';
    }
    $previewName.textContent = location.location + timePreview + mainPreview + currentTempPreview + maxPreview + minPreview + windPreview + humidityPreview + sunrisePreview + sunsetPreview;
    $previews.appendChild($previewName);
    $previewName.className = 'text-shadow-small list-choice-2rem-line-height';
  });
}

function showPrimary(event) {
  switchView($weatherDisplayPrimaryList);
  appendLocationsList();
  for (var dataLIndex = 0; dataLIndex < data.locations.length; dataLIndex++) {
    if (data.locations[dataLIndex].location === data.primary) {
      showWeatherDataObject(data.locations[dataLIndex]);
    } else if (data.locations[dataLIndex].location !== data.primary) {
      showPreviewsOfData(data.locations[dataLIndex]);
      for (var previewsIndex = 0; previewsIndex < $previews.children.length; previewsIndex++) {
        if ($previews.children[previewsIndex].textContent.includes(data.locations[dataLIndex].location)) {
          $previews.children[previewsIndex].remove();
        }
      }
    }
  }
}

function convertUnixTimeStamp(unix, timezone, date) {
  var localOffset = new Date().getTimezoneOffset() * 60;
  var stamp = (unix + (localOffset + timezone)) * 1000;
  var formattedTime = new Date(stamp);
  if (date === false) {
    return formattedTime.toLocaleTimeString().substr(0, formattedTime.toLocaleTimeString().lastIndexOf(':')) + ' ' + formattedTime.toLocaleTimeString().substr(-2);
  } else if (date === true) {
    return formattedTime.toLocaleDateString();
  }
}

function changeBackground(image) {
  var dimensions = 'background-image-dimensions ';
  $backgroundImage.className = dimensions + image;
}

function considerSetting(unix, timezone, weather, sunrise, sunset) {
  var localOffset = new Date().getTimezoneOffset() * 60;
  var stamp = (unix + (localOffset + timezone)) * 1000;
  var formattedTime = new Date(stamp);
  var sunTime = formattedTime.getHours() + (formattedTime.getMinutes() / 60);
  var sunRiseUnixConvertedHours = new Date((sunrise + (localOffset + timezone)) * 1000);
  var sunRiseTotal = sunRiseUnixConvertedHours.getHours() + (sunRiseUnixConvertedHours.getMinutes() / 60);
  var sunSetUnixConvertedHours = new Date((sunset + (localOffset + timezone)) * 1000);
  var sunSetTotal = sunSetUnixConvertedHours.getHours() + (sunSetUnixConvertedHours.getMinutes() / 60);

  if (formattedTime.getHours() < 12 && formattedTime.getHours() >= 5) {
    $greeting.textContent = data.greetings[0];
  }
  if (formattedTime.getHours() >= 12 && formattedTime.getHours() < 14 && weather !== 'Rain') {
    $greeting.textContent = data.greetings[1];
    $recommendation.textContent = data.responses.sunny[getRandomInt(data.responses.sunny.length)];
  }
  if (formattedTime.getHours() >= 14 && formattedTime.getHours() < 17) {
    $greeting.textContent = data.greetings[2];
    $recommendation.textContent = data.responses.afternoon[getRandomInt(data.responses.afternoon.length)];
  }
  if (formattedTime.getHours() >= 17 && formattedTime.getHours() > 21) {
    $greeting.textContent = data.greetings[3];
    $recommendation.textContent = data.responses.night[getRandomInt(data.responses.night.length)];
  }
  if (formattedTime.getHours() >= 21 || formattedTime.getHours() < 5) {
    $greeting.textContent = data.greetings[4];
    $recommendation.textContent = data.responses.night[getRandomInt(data.responses.night.length)];
  }
  if (weather !== 'Rain' && formattedTime.getHours() < 15 && formattedTime.getHours() > 5) {
    changeBackground('background-image-sunny');
    $recommendation.textContent = data.responses.sunny[getRandomInt(data.responses.sunny.length)];
  }
  if (weather === 'Rain') {
    changeBackground('background-image-rainy');
    $recommendation.textContent = data.responses.rainy[getRandomInt(data.responses.rainy.length)];
  } else if (sunTime >= sunRiseTotal && sunTime <= sunSetTotal) {
    changeBackground('background-image-sunny');
  } else if ((sunTime > sunSetTotal && sunTime < 25) || (sunTime < sunRiseTotal && sunTime >= 0)) {
    changeBackground('background-image-night');
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function invalidLocationNotice() {
  var invalidText = 'Please put an appropriate location!';
  var $invalidTextElement = document.createElement('p');
  $invalidTextElement.textContent = invalidText;
  $invalidTextElement.className = 'italics red-font text-shadow-none top-bottom-margins-none';
  return $invalidTextElement;
}

function toggleHidden(elementClass) {
  elementClass.classList.toggle('hidden');
}

function switchView(destinationView) {
  for (var pageIndex = 0; pageIndex < differentPages.length; pageIndex++) {
    var currentPageClass = differentPages[pageIndex].className;
    if (differentPages[pageIndex] !== destinationView && !currentPageClass.includes('hidden')) {
      toggleHidden(differentPages[pageIndex]);
    }
    if (differentPages[pageIndex] === destinationView && currentPageClass.includes('hidden')) {
      toggleHidden(differentPages[pageIndex]);
    }
  }
}

var $headerHamburgerMenuIcon = document.querySelector('.hamburger-menu-icon');
var $headerBanner = document.querySelector('.header-banner');
var $headerLinks = document.querySelector('.header-links');
function headerToggle(event) {
  $headerBanner.classList.toggle('header-banner-active-background');
  toggleHidden($headerLinks);
  if (viewingLocationsModal === true) {
    toggleHidden($editModal);
    viewingLocationsModal = false;
    $locationLink.classList.toggle('transform-up');
  }
}
$headerHamburgerMenuIcon.addEventListener('click', headerToggle);

var viewingLocationsModal = false;
var $locationLink = document.querySelector('.header-locations-link');
var $editModal = document.querySelector('.edit-modal');
var $elmPreviewList = document.querySelector('.elm-preview-list');
function showMenu(event) {
  toggleHidden($editModal);
  if (viewingLocationsModal === false) {
    viewingLocationsModal = true;
    $locationLink.classList.toggle('transform-up');
  } else {
    viewingLocationsModal = false;
    $locationLink.classList.toggle('transform-up');
  }
  for (var i = 0; i < $elmPreviewList.children.length - 1; i++) {
    if (data.primary === $elmPreviewList.children[i].children[0].textContent) {
      $elmPreviewList.children[i].children[0].children[0].className = 'fas fa-star';
    } else {
      $elmPreviewList.children[i].children[0].children[0].className = 'far fa-star';
    }
  }
}

$locationLink.addEventListener('click', showMenu);
var differentPages = [$weatherDisplayPrimaryList, $weatherInformationChoices, $locationAsker];
var $newEntryListItem = document.querySelector('.new-entry-list-item');
function newEntryClicked(event) {
  headerToggle();
  $locationForm.reset();
  for (var resetIndex = 0; resetIndex < $weatherChoicesList.children.length; resetIndex++) {
    $weatherChoicesList.children[resetIndex].children[0].className = 'far fa-check-circle';
  }
  switchView($locationAsker);
}
$newEntryListItem.addEventListener('click', newEntryClicked);

function generateLocationsListItem(locationName) {
  var $newListItem = document.createElement('li');
  var $newListItemSpan = document.createElement('span');
  var $primaryIcon = document.createElement('i');
  if (data.primary === locationName) {
    $primaryIcon.className = 'fas fa-star';
  } else {
    $primaryIcon.className = 'far fa-star';
  }
  $newListItemSpan.appendChild($primaryIcon);
  var $newListItemSpanTextContent = document.createTextNode(locationName);
  $newListItemSpan.appendChild($newListItemSpanTextContent);
  var $trashIcon = document.createElement('i');
  $trashIcon.className = 'far fa-trash-alt';
  $newListItemSpan.appendChild($trashIcon);
  var $editIcon = document.createElement('i');
  $editIcon.className = 'fas fa-pencil-alt';
  $newListItemSpan.appendChild($editIcon);
  $newListItem.appendChild($newListItemSpan);
  return $newListItem;
}

function generateLocationsTree(event) {
  for (var DOMmenuIndex = 0; DOMmenuIndex < data.locations.length; DOMmenuIndex++) {
    $elmPreviewList.insertBefore(generateLocationsListItem(data.locations[DOMmenuIndex].location), $newEntryListItem);
  }
}
document.addEventListener('DOMContentLoaded', generateLocationsTree);

function trashClicked(event) {
  if (event.target && event.target.nodeName === 'I' && event.target.className === 'far fa-trash-alt') {
    var $elmEntry = event.target.closest('li');
    for (var j = 0; j < data.locations.length; j++) {
      if (data.locations[j].location === $elmEntry.children[0].textContent) {
        data.locations.splice(j, 1);
      }
    }
    for (var previewsIndex3 = 0; previewsIndex3 < $previews.children.length; previewsIndex3++) {
      if ($previews.children[previewsIndex3].textContent.includes($elmEntry.children[0].textContent)) {
        $previews.children[previewsIndex3].remove();
      }
    }
    $elmEntry.remove();
  }
}

$elmPreviewList.addEventListener('click', trashClicked);

function editClicked(event) {
  if (event.target && event.target.nodeName === 'I' && event.target.className === 'fas fa-pencil-alt') {
    var $elmEntry = event.target.closest('li');
    headerToggle();
    switchView($weatherInformationChoices);
    data.editing = $elmEntry.children[0].textContent;
    setWeatherLocation(data.editing);
    for (var x = 0; x < data.locations.length; x++) {
      if ($elmEntry.children[0].textContent === data.locations[x].location) {
        data.template = data.locations[x];
      }
    }
    editingChoices();
  }
}
$elmPreviewList.addEventListener('click', editClicked);

function editingChoices() {
  for (var k = 0; k < data.weatherOptions.length; k++) {
    if (data.template[data.weatherOptions[k]] === true) {
      $weatherChoicesList.children[k].children[0].className = 'far fa-check-circle';
    } else if (data.template[data.weatherOptions[k]] === false) {
      $weatherChoicesList.children[k].children[0].className = 'far fa-circle';
    }
  }
}

function primaryClicked(event) {
  if (event.target && event.target.nodeName === 'I' && (event.target.className === 'fas fa-star' || event.target.className === 'far fa-star')) {
    var $elmEntry = event.target.closest('li');
    if (event.target.className === 'far fa-star') {
      for (var priLoop = 0; priLoop < $elmPreviewList.children.length - 1; priLoop++) {
        $elmPreviewList.children[priLoop].children[0].children[0].className = 'far fa-star';
      }
      event.target.className = 'fas fa-star';
    }
    data.primary = $elmEntry.children[0].textContent;
    switchView($weatherDisplayPrimaryList);
    for (var dataLIndex = 0; dataLIndex < data.locations.length; dataLIndex++) {
      if (data.locations[dataLIndex].location === data.primary) {
        showWeatherDataObject(data.locations[dataLIndex]);
      } else if (data.locations[dataLIndex].location !== data.primary) {
        showPreviewsOfData(data.locations[dataLIndex]);
        for (var previewsIndex = 0; previewsIndex < $previews.children.length; previewsIndex++) {
          if ($previews.children[previewsIndex].textContent.includes(data.locations[dataLIndex].location)) {
            $previews.children[previewsIndex].remove();
          }
        }
      }
    }
    for (var previewsIndex2 = 0; previewsIndex2 < $previews.children.length; previewsIndex2++) {
      if ($previews.children[previewsIndex2].textContent.includes(data.primary)) {
        $previews.children[previewsIndex2].remove();
      }
    }
    headerToggle();
  }
}

$elmPreviewList.addEventListener('click', primaryClicked);
