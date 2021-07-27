var $searchBar = document.querySelector('.search-bar');
var $searchSubmitButton = document.querySelector('.submit-search');
function saveLocationToData(event) {
  if ($searchBar.value !== '') {
    data.locations.push({ location: $searchBar.value, entryId: data.nextEntryId });
    data.nextEntryId++;
  }
}
$searchSubmitButton.addEventListener('click', saveLocationToData);
