const $searchBar = document.querySelector('.search-bar');
const $locationForm = document.querySelector('.location-form');
const $weatherInformationChoices = document.querySelector('.weather-information-choices');
const $locationAsker = document.querySelector('.location-asker');
const $weatherChoicesList = document.querySelector('.list-of-weather-choices');
const $weatherOptionsSubmitButton = document.querySelector('.submit-choices');
const $weatherDisplayPrimaryList = document.querySelector('.weather-display-primary');
const $displayPrimaryWeatherItemList = document.querySelectorAll('.display-primary-weather-item');
const $displayTimeLocation = document.querySelector('.display-location');
const $backgroundImage = document.querySelector('.background-image-dimensions');
const $weatherChoicesLocation = document.querySelector('.weather-location-editing');
const $previews = document.querySelector('.previews');
const $greeting = document.querySelector('.greeting');
const $recommendation = document.querySelector('.recommendation');
const $headerHamburgerMenuIcon = document.querySelector('.hamburger-menu-icon');
const $headerBanner = document.querySelector('.header-banner');
const $headerLinks = document.querySelector('.header-links');
const $editModal = document.querySelector('.edit-modal');
const $elmPreviewList = document.querySelector('.elm-preview-list');
const $editLocationModalContent = document.querySelector('.edit-location-modal-content');
const $invalid = document.querySelector('.invalid');

$locationForm.addEventListener('submit', queryLocation);
$weatherChoicesList.addEventListener('click', alternateIcon);
$weatherOptionsSubmitButton.addEventListener('click', submitClicked);

function queryLocation(event) {
  event.preventDefault();
  const xhr = new XMLHttpRequest();
  const firstPartLink = 'https://api.openweathermap.org/data/2.5/weather?q=';
  const locationURL = $searchBar.value;
  const latterPartLink = '&units=imperial&appid=ea53d3f85461dc36f6f6ec5c9722353e';
  const fullLink = firstPartLink + locationURL + latterPartLink;
  xhr.open('GET', fullLink);
  xhr.responseType = 'json';
  xhr.send();
  toggleLoading();
  xhr.addEventListener('load', function () {
    if ($searchBar.value !== '' && xhr.status === 200) {
      data.editing = $searchBar.value;
      data.template.location = data.editing;
      if (data.locations.length === 0) {
        data.primary = data.editing;
      }
      switchView($weatherInformationChoices);
      setWeatherLocation(data.editing);
      if (!$invalid.className.includes('hidden')) {
        toggleHidden($invalid);
      }
    } else if (xhr.status !== 200) {
      if ($invalid.className.includes('hidden')) {
        toggleHidden($invalid);
      }
    }
    toggleLoading();
  });
}

function setWeatherLocation(location) {
  $weatherChoicesLocation.textContent = location;
}

function alternateIcon(event) {
  const $listChoice = event.target.closest('.weather-information-list-choice');
  const $circle = $listChoice.querySelector('.far');
  if (event.target && (event.target.nodeName === 'BUTTON' || event.target.nodeName === 'I')) {
    if ($circle.classList.contains('fa-circle')) {
      $circle.classList.toggle('fa-check-circle');
      $circle.classList.toggle('fa-circle');
      data.template[data.weatherOptions[$listChoice.value]] = true;
    } else if ($circle.classList.contains('fa-check-circle')) {
      $circle.classList.toggle('fa-check-circle');
      $circle.classList.toggle('fa-circle');
      data.template[data.weatherOptions[$listChoice.value]] = false;
    }
  }
}

function appendLocationsList() {
  const dataWeatherEntryObject = Object.assign({}, data.template);
  let locationAlreadySaved = [false, null];
  for (let dataLocationsIndex = 0; dataLocationsIndex < data.locations.length; dataLocationsIndex++) {
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
  for (let optionIndex = 0; optionIndex < data.weatherOptions.length; optionIndex++) {
    data.template[data.weatherOptions[optionIndex]] = true;
  }
  data.template.location = null;
  data.editing = null;
}

function showWeatherDataObject(location) {
  const xhr = new XMLHttpRequest();
  const firstPartLink = 'https://api.openweathermap.org/data/2.5/weather?q=';
  const locationURL = location.location;
  const latterPartLink = '&units=imperial&appid=ea53d3f85461dc36f6f6ec5c9722353e';
  const fullLink = firstPartLink + locationURL + latterPartLink;
  xhr.open('GET', fullLink);
  xhr.responseType = 'json';
  xhr.send();
  toggleLoading();
  xhr.addEventListener('load', function () {
    const currentTime = new Date().getTime() / 1000;
    $displayTimeLocation.textContent = xhr.response.name + ', ' + xhr.response.sys.country;
    const $timeDisplay = document.querySelector('.display-time-of-day');
    $timeDisplay.textContent = convertUnixTimeStamp(currentTime, xhr.response.timezone, false);
    const $dateDisplay = document.querySelector('.display-date');
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
    for (let displayIndex = 0; displayIndex < $displayPrimaryWeatherItemList.length; displayIndex++) {
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
    toggleLoading();
  });
}

function showPreviewsOfData(location) {
  const xhr2 = new XMLHttpRequest();
  const firstPartLink = 'https://api.openweathermap.org/data/2.5/weather?q=';
  const locationURL = location.location;
  const latterPartLink = '&units=imperial&appid=ea53d3f85461dc36f6f6ec5c9722353e';
  const fullLink = firstPartLink + locationURL + latterPartLink;
  const currentTime = new Date().getTime() / 1000;
  xhr2.open('GET', fullLink);
  xhr2.responseType = 'json';
  xhr2.send();
  toggleLoading();
  xhr2.addEventListener('load', function () {
    const $previewName = document.createElement('div');
    const timePreview = ' ' + convertUnixTimeStamp(currentTime, xhr2.response.timezone, false);
    let mainPreview = ' ' + xhr2.response.weather[0].main;
    let currentTempPreview = ' | ' + 'Now: ' + xhr2.response.main.temp + '° F';
    let maxPreview = ' | ' + 'High: ' + xhr2.response.main.temp_max + '° F';
    let minPreview = ' | ' + 'Low: ' + xhr2.response.main.temp_min + '° F';
    let windPreview = ' | ' + xhr2.response.wind.speed + ' mph';
    let humidityPreview = ' | ' + 'Humidity: ' + xhr2.response.main.humidity + '%';
    let sunrisePreview = ' | ' + 'Sunrise: ' + convertUnixTimeStamp(xhr2.response.sys.sunrise, xhr2.response.timezone, false);
    let sunsetPreview = ' | ' + 'Sunset: ' + convertUnixTimeStamp(xhr2.response.sys.sunset, xhr2.response.timezone, false);
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
    toggleLoading();
  });
}

function submitClicked(event) {
  switchView($weatherDisplayPrimaryList);
  appendLocationsList();
  for (let dataLIndex = 0; dataLIndex < data.locations.length; dataLIndex++) {
    if (data.locations[dataLIndex].location === data.primary) {
      showWeatherDataObject(data.locations[dataLIndex]);
    } else if (data.locations[dataLIndex].location !== data.primary) {
      showPreviewsOfData(data.locations[dataLIndex]);
      for (let previewsIndex = 0; previewsIndex < $previews.children.length; previewsIndex++) {
        if ($previews.children[previewsIndex].textContent.includes(data.locations[dataLIndex].location)) {
          $previews.children[previewsIndex].remove();
        }
      }
    }
  }
}

function showPrimary(event) {
  switchView($weatherDisplayPrimaryList);
  for (let dataLIndex = 0; dataLIndex < data.locations.length; dataLIndex++) {
    if (data.locations[dataLIndex].location === data.primary) {
      showWeatherDataObject(data.locations[dataLIndex]);
    } else if (data.locations[dataLIndex].location !== data.primary) {
      showPreviewsOfData(data.locations[dataLIndex]);
      for (let previewsIndex = 0; previewsIndex < $previews.children.length; previewsIndex++) {
        if ($previews.children[previewsIndex].textContent.includes(data.locations[dataLIndex].location)) {
          $previews.children[previewsIndex].remove();
        }
      }
    }
  }
}

function convertUnixTimeStamp(unix, timezone, date) {
  const localOffset = new Date().getTimezoneOffset() * 60;
  const stamp = (unix + (localOffset + timezone)) * 1000;
  const formattedTime = new Date(stamp);
  if (date === false) {
    return formattedTime.toLocaleTimeString().substr(0, formattedTime.toLocaleTimeString().lastIndexOf(':')) + ' ' + formattedTime.toLocaleTimeString().substr(-2);
  } else if (date === true) {
    return formattedTime.toLocaleDateString();
  }
}

function changeBackground(image) {
  const dimensions = 'background-image-dimensions ';
  $backgroundImage.className = dimensions + image;
}

function considerSetting(unix, timezone, weather, sunrise, sunset) {
  const localOffset = new Date().getTimezoneOffset() * 60;
  const stamp = (unix + (localOffset + timezone)) * 1000;
  const formattedTime = new Date(stamp);
  const sunTime = formattedTime.getHours() + (formattedTime.getMinutes() / 60);
  const sunRiseUnixConvertedHours = new Date((sunrise + (localOffset + timezone)) * 1000);
  const sunRiseTotal = sunRiseUnixConvertedHours.getHours() + (sunRiseUnixConvertedHours.getMinutes() / 60);
  const sunSetUnixConvertedHours = new Date((sunset + (localOffset + timezone)) * 1000);
  const sunSetTotal = sunSetUnixConvertedHours.getHours() + (sunSetUnixConvertedHours.getMinutes() / 60);
  let greetingMessage = null;
  if (formattedTime.getHours() < 12 && formattedTime.getHours() >= 5) {
    greetingMessage = data.greetings[0];
  }
  if (formattedTime.getHours() >= 12 && formattedTime.getHours() < 14) {
    greetingMessage = data.greetings[1];
    $recommendation.textContent = data.responses.sunny[getRandomInt(data.responses.sunny.length)];
  }
  if (formattedTime.getHours() >= 14 && formattedTime.getHours() < 17) {
    greetingMessage = data.greetings[2];
    $recommendation.textContent = data.responses.afternoon[getRandomInt(data.responses.afternoon.length)];
  }
  if (formattedTime.getHours() >= 17 && formattedTime.getHours() < 21) {
    greetingMessage = data.greetings[3];
    $recommendation.textContent = data.responses.night[getRandomInt(data.responses.night.length)];
  }
  if (formattedTime.getHours() >= 21 || formattedTime.getHours() < 5) {
    greetingMessage = data.greetings[4];
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
  if (data.profile.name !== null) {
    $greeting.textContent = greetingMessage + ' ' + data.profile.name;
  } else if (greetingMessage === null) {
    $greeting.textContent = data.greetings[1] + ' ' + data.profile.name;
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function toggleHidden(elementClass) {
  elementClass.classList.toggle('hidden');
}

function switchView(destinationView) {
  for (let pageIndex = 0; pageIndex < differentPages.length; pageIndex++) {
    const currentPageClass = differentPages[pageIndex].className;
    if (differentPages[pageIndex] !== destinationView && !currentPageClass.includes('hidden')) {
      toggleHidden(differentPages[pageIndex]);
    }
    if (differentPages[pageIndex] === destinationView && currentPageClass.includes('hidden')) {
      toggleHidden(differentPages[pageIndex]);
    }
  }
}

function stayOnPrimary(event) {
  if (data.primary !== null) {
    switchView($weatherDisplayPrimaryList);
    showPrimary();
  }
}
document.addEventListener('DOMContentLoaded', stayOnPrimary);

const differentPages = [$weatherDisplayPrimaryList, $weatherInformationChoices, $locationAsker];
const $newEntryListItem = document.querySelector('.new-entry-list-item');
function newEntryClicked(event) {
  headerToggle();
  $locationForm.reset();
  for (let resetIndex = 0; resetIndex < $weatherChoicesList.children.length; resetIndex++) {
    $weatherChoicesList.children[resetIndex].querySelector('.far').classList.toggle('fa-check-circle', true);
  }
  switchView($locationAsker);
}
$newEntryListItem.addEventListener('click', newEntryClicked);

function generateLocationsListItem(locationName) {
  const $newListItem = document.createElement('li');
  const $newListItemSpan = document.createElement('span');
  const $primaryIcon = document.createElement('i');
  if (data.primary === locationName) {
    $primaryIcon.className = 'fas fa-star';
  } else {
    $primaryIcon.className = 'far fa-star';
  }
  $newListItemSpan.appendChild($primaryIcon);
  const $newListItemSpanTextContent = document.createTextNode(locationName);
  $newListItemSpan.appendChild($newListItemSpanTextContent);
  const $trashIcon = document.createElement('i');
  $trashIcon.className = 'far fa-trash-alt';
  $newListItemSpan.appendChild($trashIcon);
  const $editIcon = document.createElement('i');
  $editIcon.className = 'fas fa-pencil-alt';
  $newListItemSpan.appendChild($editIcon);
  $newListItem.appendChild($newListItemSpan);
  return $newListItem;
}

function generateLocationsTree(event) {
  for (let DOMmenuIndex = 0; DOMmenuIndex < data.locations.length; DOMmenuIndex++) {
    $elmPreviewList.insertBefore(generateLocationsListItem(data.locations[DOMmenuIndex].location), $newEntryListItem);
  }
}
document.addEventListener('DOMContentLoaded', generateLocationsTree);

function trashClicked(event) {
  if (event.target && event.target.nodeName === 'I' && event.target.className === 'far fa-trash-alt') {
    const $elmEntry = event.target.closest('li');
    for (let j = 0; j < data.locations.length; j++) {
      if (data.locations[j].location === $elmEntry.children[0].textContent) {
        data.locations.splice(j, 1);
      }
    }
    if (data.primary === $elmEntry.children[0].textContent) {
      data.primary = null;
      if (data.locations.length > 0) {
        data.primary = data.locations[0].location;
        const $star = $elmPreviewList.querySelector('.fa-star');
        $star.className = 'fas fa-star';
        for (let previewsIndex4 = 0; previewsIndex4 < $previews.children.length; previewsIndex4++) {
          if ($previews.children[previewsIndex4].textContent.includes(data.primary)) {
            $previews.children[previewsIndex4].remove();
          }
        }
        showPrimary();
        headerToggle();
      }
      if (data.locations.length === 0) {
        switchView($locationAsker);
        $locationForm.reset();
        headerToggle();
      }
    }
    for (let previewsIndex3 = 0; previewsIndex3 < $previews.children.length; previewsIndex3++) {
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
    const $elmEntry = event.target.closest('li');
    headerToggle();
    switchView($weatherInformationChoices);
    data.editing = $elmEntry.children[0].textContent;
    setWeatherLocation(data.editing);
    for (let x = 0; x < data.locations.length; x++) {
      if ($elmEntry.children[0].textContent === data.locations[x].location) {
        data.template = data.locations[x];
      }
    }
    editingChoices();
  }
}
$elmPreviewList.addEventListener('click', editClicked);

function editingChoices() {
  for (let k = 0; k < data.weatherOptions.length; k++) {
    if (data.template[data.weatherOptions[k]] === true) {
      $weatherChoicesList.children[k].querySelector('.far').classList.toggle('fa-check-circle', true);
      $weatherChoicesList.children[k].querySelector('.far').classList.toggle('fa-circle', false);
    } else if (data.template[data.weatherOptions[k]] === false) {
      $weatherChoicesList.children[k].querySelector('.far').classList.toggle('fa-check-circle', false);
      $weatherChoicesList.children[k].querySelector('.far').classList.toggle('fa-circle', true);
    }
  }
}

function primaryClicked(event) {
  if (event.target && event.target.nodeName === 'I' && event.target.classList.contains('fa-star')) {
    const $elmEntry = event.target.closest('li');
    if (event.target.className === 'far fa-star') {
      for (let priLoop = 0; priLoop < $elmPreviewList.children.length - 1; priLoop++) {
        const $elmListing = $elmPreviewList.children[priLoop].querySelector('.fa-star');
        $elmListing.classList.toggle('far', true);
        $elmListing.classList.toggle('fas', false);
      }
      event.target.className = 'fas fa-star';
    }
    data.primary = $elmEntry.children[0].textContent;
    switchView($weatherDisplayPrimaryList);
    for (let dataLIndex = 0; dataLIndex < data.locations.length; dataLIndex++) {
      if (data.locations[dataLIndex].location === data.primary) {
        showWeatherDataObject(data.locations[dataLIndex]);
      } else if (data.locations[dataLIndex].location !== data.primary) {
        showPreviewsOfData(data.locations[dataLIndex]);
        for (let previewsIndex = 0; previewsIndex < $previews.children.length; previewsIndex++) {
          if ($previews.children[previewsIndex].textContent.includes(data.locations[dataLIndex].location)) {
            $previews.children[previewsIndex].remove();
          }
        }
      }
    }
    for (let previewsIndex2 = 0; previewsIndex2 < $previews.children.length; previewsIndex2++) {
      if ($previews.children[previewsIndex2].textContent.includes(data.primary)) {
        $previews.children[previewsIndex2].remove();
      }
    }
    headerToggle();
  }
}

$elmPreviewList.addEventListener('click', primaryClicked);

const $profileEdit = document.querySelector('.profile-edit');
function saveProfile(event) {
  event.preventDefault();
  data.profile.name = $profileEdit.elements.name.value;
  data.profile.birthday = $profileEdit.elements.birthday.value;
  data.profile.email = $profileEdit.elements.email.value;
  $profileEdit.reset();
  showPrimary();
  headerToggle();
}

$headerHamburgerMenuIcon.addEventListener('click', headerToggle);
document.addEventListener('click', showLocations);
$profileEdit.addEventListener('submit', saveProfile);

function headerToggle(event) {
  $headerBanner.classList.toggle('header-banner-active-background');
  toggleHidden($headerLinks);
  toggleHidden($editModal);
}

function showLocations(event) {
  for (let i = 0; i < $elmPreviewList.children.length - 1; i++) {
    const $starFilling = $elmPreviewList.children[i].querySelector('.fa-star');
    if (data.primary === $elmPreviewList.children[i].children[0].textContent) {
      $starFilling.classList.toggle('fas', true);
      $starFilling.classList.toggle('far', false);
    } else {
      $starFilling.classList.toggle('fas', false);
      $starFilling.classList.toggle('far', true);
    }
  }
}

function clickHeaderLink(event) {
  if (event.target.nodeName === 'A' && !event.target.className.includes('active')) {
    for (let menuIndex = 0; menuIndex < $headerLinks.children.length; menuIndex++) {
      const $link = $headerLinks.children[menuIndex].querySelector('.actual-link');
      if ($link.classList.contains('transform-up')) {
        $link.classList.toggle('transform-up');
      }
      if ($link.classList.contains('active')) {
        $link.classList.toggle('active');
      }
    }
    event.target.classList.toggle('transform-up');
    event.target.classList.toggle('active');
    switchMenu();
  }
}

function switchMenu(event) {
  for (let headerIndex = 0; headerIndex < $headerLinks.children.length; headerIndex++) {
    if ($headerLinks.children[headerIndex].querySelector('.active')) {
      for (let modalIndex = 0; modalIndex < $editLocationModalContent.children.length; modalIndex++) {
        if ($headerLinks.children[headerIndex].children[0].textContent === $editLocationModalContent.children[modalIndex].getAttribute('name') && $editLocationModalContent.children[modalIndex].querySelector('.hidden')) {
          toggleHidden($editLocationModalContent.children[modalIndex]);
        } else if (!$editLocationModalContent.children[modalIndex].querySelector('.hidden')) {
          toggleHidden($editLocationModalContent.children[modalIndex]);
        }
      }
    }
  }
}

$headerLinks.addEventListener('click', clickHeaderLink);
const $loadingText = document.querySelector('.loading-screen');
function toggleLoading(event) {
  if (!$loadingText.className.includes('hidden')) {
    toggleHidden($loadingText);
  } else if ($loadingText.className.includes('hidden')) {
    toggleHidden($loadingText);
  }
}
