/////////////////////////////// Browser and OS detectors ////////////////////////////////

var agt = navigator.userAgent;
var isMac = agt.indexOf("Mac") != -1 ? true : false;
var isSafari = agt.indexOf("Safari") != -1 ? true : false;
var isIE = agt.indexOf("MSIE") != -1 ? true : false;
var isIE7 = agt.indexOf("MSIE") != -1 && window.XMLHttpRequest ? true : false;
var isNetscape = agt.indexOf("Netscape") != -1 ? true : false;
var isOpera = agt.indexOf("Opera") != -1 ? true : false;
var isGecko = agt.indexOf("Gecko") != -1 && agt.indexOf("like Gecko") == -1 ? true : false; // Safari includes the text "KHTML, like Gecko"


/////////////////////////////// className functions //////////////////////////////

// hybrid of scripts found at http://www.snook.ca/archives/000370.html and http://diskuse.jakpsatweb.cz/index.php?action=vthread&topic=6428&forum=8&page=-1

function getElementsByClassName(classname){
	var rl = new Array();
	var re = new RegExp('(^| )'+classname+'( |$)');
	var ael = document.all && !isOpera ? document.all : document.getElementsByTagName('*');
	for (i=0, j=0 ; i<ael.length ; i++) {
		if(re.test(ael[i].className)) {
			rl[j] = ael[i];
			j++;
		}
	}
	return rl;
} 

document.getElementsByClassName=getElementsByClassName;

function hide(clName) {
	var x = document.getElementsByClassName(clName);
	for (var i = 0; i < x.length; i++) {
		x[i].style.display = 'none';
	}
}

function changeClassName(originalClass, targetClass) {
	var x = document.getElementsByClassName(originalClass);
	for (var i = 0; i < x.length; i++) {
		x[i].className = targetClass;
	}
}


////////////////////////// Toggle Bar on and off ////////////////////////////

function toggleBar(id){

	if(document.getElementById(id).style.display == "none" || document.getElementById(id).style.display == ""){
		changeClassName('musical-example-hover','musical-example');
		document.getElementById(id + '-link').className = 'musical-example-hover';
		hide('title-bar');
		document.getElementById(id).style.display = 'block';

		// Safari can't getComputedStyle of non-displayed objects
		if (isSafari) {
			titleBar = document.getElementById(id); // change the generically chosen titleBar to the actual one to which assignTitleBarWidth needs to be applied
			assignTitleBarWidth(); // now that getComputedStyle will work
		}

	} else {
		document.getElementById(id + '-link').className = 'musical-example';
		setTimeout('document.getElementById("'+id+'").style.display="none"',1000);
	}
}


///////////////////////////// Page Size Information ////////////////////////////

// the getElementsByClassName function will still pick up elements with class="title-bar interactive" ... no separate test needed
var titleBar = document.getElementsByClassName("title-bar")[0];

function assignTitleBarWidth() {

	var ie7TransWidth = document.documentElement.clientWidth; // for IE 7 w/ an XHTML 1.0 Transitional Doctype
	var ie7TransWidthTrue = (ie7TransWidth && ie7TransWidth != 0 && !window.innerWidth) ? true : false;

	if (window.innerWidth) {
		var width = window.innerWidth;
	} else if (ie7TransWidthTrue) {
		var width = ie7TransWidth;
	} else if (document.body.clientWidth) {
		var width = document.body.clientWidth;
	} else if (document.body.offsetWidth) {
		var width = document.body.offsetWidth;
	}

	var body = document.getElementsByTagName('body')[0];
	if (document.defaultView) { // Gecko and Safari
		galleryWidth = parseInt(document.defaultView.getComputedStyle(body, '').getPropertyValue('padding-left'));
	} else { // IE
		galleryWidth = parseInt(body.currentStyle.paddingLeft);
	}

	if (isSafari) {
		var scrollbarWidth = 0;
	} else if (isNetscape || isGecko && isMac) {
		var scrollbarWidth = 15;
	} else {
		var scrollbarWidth = 16;
	}

	var wholeEnchiladaWidth = width - galleryWidth - scrollbarWidth;

	var titleBarWidthMeasurements = new Array();
	if ((document.defaultView && !isSafari) || (isSafari && (titleBar.style.display == 'block'))) {  // Gecko and Safari, only if the titleBar is showing
		var titleBarWidthStyle = document.defaultView.getComputedStyle(titleBar, null);
		titleBarWidthMeasurements[0] = parseInt(titleBarWidthStyle.getPropertyValue('margin-left'));
		titleBarWidthMeasurements[1] = parseInt(titleBarWidthStyle.getPropertyValue('margin-right'));
		titleBarWidthMeasurements[2] = parseInt(titleBarWidthStyle.getPropertyValue('border-left-width'));
		titleBarWidthMeasurements[3] = parseInt(titleBarWidthStyle.getPropertyValue('border-right-width'));
		titleBarWidthMeasurements[4] = parseInt(titleBarWidthStyle.getPropertyValue('padding-left'));
		titleBarWidthMeasurements[5] = parseInt(titleBarWidthStyle.getPropertyValue('padding-right'));
	}
	else if (isSafari && (titleBar.style.display != 'block')) { // Safari can't getComputedStyle of non-displayed items and would thus stops running JS 1/2-way through above condition
		for (var j=0; j < titleBarWidthMeasurements.length; j++) {
			titleBarWidthMeasurements[j] = 0;
		}
	} else { // IE
		titleBarWidthMeasurements[0] = parseInt(titleBar.currentStyle.marginLeft);
		titleBarWidthMeasurements[1] = parseInt(titleBar.currentStyle.marginRight);
		titleBarWidthMeasurements[2] = parseInt(titleBar.currentStyle.borderLeftWidth);
		titleBarWidthMeasurements[3] = parseInt(titleBar.currentStyle.borderRightWidth);
		titleBarWidthMeasurements[4] = parseInt(titleBar.currentStyle.paddingLeft);
		titleBarWidthMeasurements[5] = parseInt(titleBar.currentStyle.paddingRight);
	}

	var titleBarWidthTotal = 0;
	for (var k=0; k < titleBarWidthMeasurements.length; k++) {
		if (isNaN(titleBarWidthMeasurements[k])) { // if there is no value, or it can't understand it as number, just set it to 0
			titleBarWidthMeasurements[k] = 0;
		}
		titleBarWidthTotal += titleBarWidthMeasurements[k]; // instead of subtracting long string of values below
	}

	if (window.innerWidth || (document.body.clientWidth && isMac) || ie7TransWidthTrue) {
		var titleBarWidth = wholeEnchiladaWidth - titleBarWidthTotal;
	} else if (isIE7) { // i'm not sure why this seems to be necessary
		var titleBarWidth = wholeEnchiladaWidth - titleBarWidthMeasurements[0] - titleBarWidthMeasurements[1] - 5;
	} else { // basically, how WinIE quirks mode handles box model
		var titleBarWidth = wholeEnchiladaWidth - titleBarWidthMeasurements[0] - titleBarWidthMeasurements[1]; // margins only
	}
	
	var y = document.getElementsByClassName('title-bar');
	for (var m = 0; m < y.length; m++) {
		y[m].style.width = titleBarWidth + 'px';
	}

        if (ie7TransWidthTrue) { // i'm not sure why this seems to be necessary
                document.getElementById('cnx_columns').style.width = titleBarWidth + 'px';
        }
}

function assignGalleryHeight(){

	var ie7TransHeight = document.documentElement.clientHeight; // for IE 7 w/ an XHTML 1.0 Transitional Doctype
	var ie7TransHeightTrue = (ie7TransHeight && ie7TransHeight != 0 && !window.innerHeight) ? true : false;

	if (ie7TransHeightTrue) { // i'm not really sure why this seems to be necessary
		document.getElementById('cnx_whole_enchilada').style.overflow = 'visible';
	}

	if (window.innerHeight) {
		var height = window.innerHeight; // for Gecko & Safari
	} else if (ie7TransHeightTrue) {
		var height = ie7TransHeight;
	} else if (document.body.clientHeight) {
		var height = document.body.clientHeight; // better for MacIE than offsetHeight
	} else if (document.body.offsetHeight) {
		var height = document.body.offsetHeight; // Others
	}

	var galleryHeightMeasurements = new Array();
	var gallery = document.getElementById('musical-examples');
	if (document.defaultView) { // Gecko and Safari
		var galleryHeightStyle = document.defaultView.getComputedStyle(gallery, null);
		galleryHeightMeasurements[0] = parseInt(galleryHeightStyle.getPropertyValue('margin-top'));
		galleryHeightMeasurements[1] = parseInt(galleryHeightStyle.getPropertyValue('margin-bottom'));
		galleryHeightMeasurements[2] = parseInt(galleryHeightStyle.getPropertyValue('border-top-width'));
		galleryHeightMeasurements[3] = parseInt(galleryHeightStyle.getPropertyValue('border-bottom-width'));
		galleryHeightMeasurements[4] = parseInt(galleryHeightStyle.getPropertyValue('padding-top'));
		galleryHeightMeasurements[5] = parseInt(galleryHeightStyle.getPropertyValue('padding-bottom'));
	} else { // IE
		galleryHeightMeasurements[0] = parseInt(gallery.currentStyle.marginTop);
		galleryHeightMeasurements[1] = parseInt(gallery.currentStyle.marginBottom);
		galleryHeightMeasurements[2] = parseInt(gallery.currentStyle.borderTopWidth);
		galleryHeightMeasurements[3] = parseInt(gallery.currentStyle.borderBottomWidth);
		galleryHeightMeasurements[4] = parseInt(gallery.currentStyle.paddingTop);
		galleryHeightMeasurements[5] = parseInt(gallery.currentStyle.paddingBottom);
	}

	var galleryHeightTotal = 0;
	for (var o=0; o < galleryHeightMeasurements.length; o++) {
		if (isNaN(galleryHeightMeasurements[o])) { // if there is no value, or it can't understand it as number, just set it to 0
			galleryHeightMeasurements[o] = 0;
		}
		galleryHeightTotal += galleryHeightMeasurements[o]; // instead of subtracting a long string of numbers below
	}

	if (window.innerHeight || (document.body.clientHeight && isMac) || ie7TransHeightTrue) {
		var galleryHeight = height - galleryHeightTotal;
	} else { // basically, how WinIE quirks mode handles box model
		var galleryHeight = height - galleryHeightMeasurements[0] - galleryHeightMeasurements[1]; // margins only ... make sure "top: 0" in CSS
	}
	
	gallery.style.height = galleryHeight + 'px';

        if (ie7TransHeightTrue) { // i'm not sure why this seems to be necessary
                gallery.style.height = galleryHeight + 21 + 'px';
        }
}


function assignElementDimensions(){
	assignTitleBarWidth();
	assignGalleryHeight();
}

assignElementDimensions();
window.onresize = assignElementDimensions;

