// Cesiuml js view:

// Global UI states
var CINEMATIC_STATE = false
var HOME_VIEW = true;
var TARGET_VIEW = false;


// View variables
var lat = 0;
var lon = 0;
var alt = 30000000;

var heading = 0;
var pitch = -90;
const maxPitch = 0;
const minPitch = -60;

// Create viewer:
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4NDUwNTVlZS0yZGVlLTRlYTQtYjMzZi02MzFhOTgyYThhZWYiLCJpZCI6MjYzOTk3LCJpYXQiOjE3MzQ3NjYyNjJ9.wEvqc-usYk0XDMrWD-KHN4bbC-sJj9D5mYte_Rg9E6g'
const viewer = new Cesium.Viewer('cesiumContainer', {
	terrain: Cesium.Terrain.fromWorldTerrain(),
});

// Lock camera
viewer.scene.screenSpaceCameraController.enableRotate = false;
viewer.scene.screenSpaceCameraController.enableTranslate = false;
viewer.scene.screenSpaceCameraController.enableZoom = false;
viewer.scene.screenSpaceCameraController.enableTilt = false;
viewer.scene.screenSpaceCameraController.enableLook = false;

// Custom camera:
var isMouseDown = false;
viewer.screenSpaceEventHandler.setInputAction(function(ev){
	isMouseDown = true;
}, Cesium.ScreenSpaceEventType.LEFT_DOWN);
viewer.screenSpaceEventHandler.setInputAction(function(ev){
	isMouseDown = false;
}, Cesium.ScreenSpaceEventType.LEFT_UP);
viewer.screenSpaceEventHandler.setInputAction(function(ev){
	if (isMouseDown){
		if (!HOME_VIEW){
			const shiftHeading = ev.endPosition.x - ev.startPosition.x;
			const shiftPitch = ev.endPosition.y - ev.startPosition.y;
			heading -= 0.08 * shiftHeading;
			pitch += 0.08 * shiftPitch;
			if (pitch > maxPitch){pitch=maxPitch}
			if (pitch < minPitch){pitch=minPitch}
			updateCesiumView(0);
		}
	}
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


// Arrows
document.addEventListener('keydown',function(ev){
	if (!HOME_VIEW){
		if (ev.key == 'ArrowRight'){
			exitCinematic()
			heading += 10;
			updateCesiumView(0.5);
		}
		if (ev.key == 'ArrowLeft'){
			exitCinematic()
			heading -= 10;
			updateCesiumView(0.5);
		}
	}
})

function updateCesiumView(transitionDuration){
	viewer.camera.flyTo({
		destination: Cesium.Cartesian3.fromDegrees(
			lon, 
			lat, 
			alt),
		orientation: {
			heading: Cesium.Math.toRadians(heading),
			pitch: Cesium.Math.toRadians(pitch),
			roll: 0.0,
		},
		easingFunction: Cesium.EasingFunction.LINEAR_NONE,
		duration: transitionDuration
	});
}
updateCesiumView(0);



//  UI management

const UIList = [
	document.querySelector('#citySearchBar'),
	document.querySelector('#altitudeSelector'),		
]

UIList.forEach(element => {
	element.style.transition = 'opacity 1s';
});


// Mouse click cinematic mode
document.querySelector("#cesiumContainer").addEventListener('click',function(e){
	if (CINEMATIC_STATE){
		exitCinematic();
		console.log('Show elements');
	}else{
		enterCinematic();
		console.log('Hide elements');
	}
});


function enterCinematic(){
	CINEMATIC_STATE = true;
	UIList.forEach(element => {
		element.style.opacity = 0;
	});
}

function exitCinematic(){
	CINEMATIC_STATE = false;
	UIList.forEach(element => {
		element.style.opacity = 1;
	});
	if (HOME_VIEW){
		document.querySelector('#altitudeSelector').style.opacity = 0;
	}
}

function targetLocation(latitude,longitude,altitude){
	clearInterval(cinematicInterval);

	HOME_VIEW = false;
	lat = latitude;
	lon = longitude;
	alt = altitude;
	updateCesiumView(3);

	setTimeout(function(){
		pitch = 0;
		heading = 0;
		updateCesiumView(3);

		setTimeout(function(){
			cinematicView();
			cinematicInterval = setInterval(cinematicView,5000);
			TARGET_VIEW = true;
			enableAltitude();
		},3000);
		
	},2950);
}

function targetHomeView(){
	clearInterval(cinematicInterval);
	HOME_VIEW = true;
	pitch = -90;
	updateCesiumView(0);

	alt = 30000000;
	lat = 0;
	heading = 0;
	updateCesiumView(3);
	setTimeout(function(){
		TARGET_VIEW = false;
		disableAltitude();
		cinematicView();
		cinematicInterval = setInterval(cinematicView,5000);
	},3000);
}

function cinematicView(){
	if (HOME_VIEW){
		lon += 5;
		updateCesiumView(5);
	}else{
		heading += 5;
		updateCesiumView(5);
	}
}
cinematicView();
cinematicInterval = setInterval(cinematicView,5000);

// Ask for fullscreen when mobile device is rotated
window.addEventListener("orientationchange", function(event) {
	console.log(window.screen.orientation)
	var orientation = window.screen.orientation.type;
	if (["landscape-primary","landscape-secondary"].indexOf(orientation) !== -1) {
		document.body.requestFullscreen();
	}
  }
);