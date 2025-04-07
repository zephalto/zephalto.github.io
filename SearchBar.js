const autocompleteInput = new autocomplete.GeocoderAutocomplete(
	document.querySelector("#citySearchBar"), 
	'27fe1e9e23db4a1890bf339675e5f9e2', 
	{
		type: 'city',
		limit: 4,
});

autocompleteInput.on('select', (location) => {
	if (!TARGET_VIEW){
		targetLocation(location.properties.lat,location.properties.lon,25000);
	}
});
document.querySelector('.geoapify-autocomplete-input').addEventListener('focus', () => {
	if (!HOME_VIEW){
		if (TARGET_VIEW){
			targetHomeView();
			autocompleteInput.setValue('');
		}
	}
});