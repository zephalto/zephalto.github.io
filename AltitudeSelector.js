const altitudeSelector = document.getElementById('altitudeSelector');
// listen to the change event
altitudeSelector.addEventListener('change', (evt) => {
	if (!HOME_VIEW){
		updateCesiumView(1);
		alt = evt.detail.value * 1000;
	}
});

function enableAltitude(){
	altitudeSelector.style.opacity = 1;
}
function disableAltitude(){
	altitudeSelector.style.opacity = 0;
}

disableAltitude();