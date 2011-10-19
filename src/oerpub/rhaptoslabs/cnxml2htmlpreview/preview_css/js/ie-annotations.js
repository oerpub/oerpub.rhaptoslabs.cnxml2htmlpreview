link = document.getElementById("cnx_annotea");
if (link) {
    url = link.href;
    mode = link.rel.split(" ")[1];
    if (objIEAnnoteaActiveXCtrl != undefined) {
	if (objIEAnnoteaActiveXCtrl != null) {
	    //alert(objIEAnnoteaActiveXCtrl);
	    objIEAnnoteaActiveXCtrl.addAnnotationServer(url, mode);
	}
    }

    function onUnload() {
	objIEAnnoteaActiveXCtrl.removeAnnotationServer(url);
    }

    window.onunload  = onUnload;
}

