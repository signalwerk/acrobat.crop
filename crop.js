//   Media-Box auf Grund der Trim-Box beschneiden

//   das copyright liegt bei stefan huber
//   modifikationen am code sind verboten
//   fuer fehler wird nicht gehaftet

//   Signalwerk GmbH
//   huber_stefan@gmx.net


function randerInfo() {
    this.name = "myRander";
    this.version = 1.30;
    this.hauptmenue = this.name + " " + this.version;
    this.info = this.name + " " + this.version + " || copyright by stefan huber || www.stefan-huber.ch";
 }
 
function replaceAll( str, from, to ) {
    var idx = str.indexOf( from );

    while ( idx > -1 ) {
        str = str.replace( from, to ); 
        idx = str.indexOf( from );
    }
    return str;
}

function mm2pt(inputInMM) {
	return (inputInMM / 0.3527778);
}

function pt2mm(inputInPt) {
	return (inputInPt * 0.3527778);
}

var myRander = new randerInfo();

app.addSubMenu({ cName: myRander.hauptmenue, cParent: "Tools" });

app.addMenuItem({ cName: "Rand: 0 mm", cParent: myRander.hauptmenue,
cExec: "app.alert(rander(0), 3);"});

app.addMenuItem({ cName: "Rand: 30 pt (Quark-Rand)", cParent: myRander.hauptmenue,
cExec: "app.alert(rander(30), 3);"});

app.addMenuItem({ cName: "Rand: 15 mm", cParent: myRander.hauptmenue,
cExec: "app.alert(rander(mm2pt(15)), 3);"});

app.addMenuItem({ cName: "Rand: andere...", cParent: myRander.hauptmenue,
cExec: "app.alert(rander(undefined), 3);"});

app.addMenuItem({ cName: "Format: A4", cParent: myRander.hauptmenue,
cExec: "app.alert(randerFormat(mm2pt(210), mm2pt(297)), 3);"});

app.addMenuItem({ cName: "Format: A3", cParent: myRander.hauptmenue,
cExec: "app.alert(randerFormat(mm2pt(297), mm2pt(420)), 3);"});

app.addMenuItem({ cName: "Format: andere...", cParent: myRander.hauptmenue,
cExec: "app.alert(randerFormat(undefined, undefined), 3);"});

app.addMenuItem({ cName: "Bleed-, Trim- und Art-Box löschen", cParent: myRander.hauptmenue,
cExec: "app.alert(KillBox(), 3);"});

app.addMenuItem({ cName: "Info", cParent: myRander.hauptmenue,
cExec: "app.alert(myRander.info, 3);"});


function istZahl(s)
{
	if (s!=undefined&&s!=NaN) {
	
		// ermöglicht Komma-Eingabe
		s= replaceAll(s+"", ",", ".");
		
		// Zahldefinition
		var regExpZahl = /^((\d+(\.)?(\d)*))$/
		
		if (regExpZahl.test(s)==true) {
			var temp = s;
		} else {
			var temp = undefined;
		}
		return temp
	} else {
		return undefined
	}
}


function rander(randinpt) {

	if (randinpt == undefined) {
		randinpt = app.response({cQuestion: 'Wieviel Milimeter Rand möchten Sie?', cTitle: 'Randbreite'});
		randinpt = istZahl(randinpt);
		
		if (randinpt != undefined) {
			randinpt = mm2pt(randinpt);
		}
	};
			
	if (randinpt == undefined) {
		return ("Ungültige Angabe der Randbreite.");
	} else {
		var numPagDoc = this.numPages;
	
		for (i=0;i<numPagDoc;i++) {
			var aRect = this.getPageBox("Trim", i);
			var aRectTrim = this.setPageBoxes("Crop", i, i, [aRect[0]-randinpt,aRect[1]+randinpt,aRect[2]+randinpt,aRect[3]-randinpt]);
			var aRect = this.getPageBox("Crop", i);
			var aRectNewMedia = this.setPageBoxes("Media", i, i, aRect);
		}
		return ("Alle Seiten wurden mit einem Rand zugeschnitten.");
	}	
}

function randerFormat(newWidth, newHeight) {


	if (newWidth == undefined) {
		newWidth = app.response({cQuestion: 'Bitte geben Sie die Formatbreite ein in mm ein.', cTitle: 'Breite'});
		newWidth = istZahl(newWidth);
		
		if (newWidth != undefined) {
			newWidth = mm2pt(newWidth);
		}
	};
	
	if (newHeight == undefined) {
		newHeight = app.response({cQuestion: 'Bitte geben Sie die Formathöhe ein in mm ein.', cTitle: 'Höhe'});
		newHeight = istZahl(newHeight);
		
		if (newHeight != undefined) {
			newHeight = mm2pt(newHeight);
		}
	};


	if (newWidth == undefined||newHeight == undefined) {
		return ("Ungültige Zahlenangabe. Bitte rufen Sie die Funktion erneut auf.");
	} else {	
		var numPagDoc = this.numPages;
	
		for (i=0;i<numPagDoc;i++) {
			var aRect = this.getPageBox("Crop", i);
			var width = aRect[2] - aRect[0];
			var height = aRect[1] - aRect[3];
		
			aRect[0] = aRect[0] - ((newWidth - width) / 2)
			aRect[2] = aRect[2] + ((newWidth - width) / 2)

			aRect[1] = aRect[1] + ((newHeight - height) / 2)
			aRect[3] = aRect[3] - ((newHeight - height) / 2)

			var aRectNewMedia = this.setPageBoxes("Crop", i, i, aRect);
			var aRect = this.getPageBox("Crop");
			var aRectNewMedia = this.setPageBoxes("Media", i, i, aRect);
		}
		return ("Alle Seiten wurden auf das Format geschnitten.");
	};
}



function KillBox() {

	var numPagDoc = this.numPages;
	
	for (i=0;i<numPagDoc;i++) {
		
		// Alle Boxen auslesen
		//------------------------------------------------------
		//var aRectTrim = this.getPageBox("Trim", i);
		//var aRectCrop = this.getPageBox("Crop", i);
		//var aRectBBox = this.getPageBox("BBox", i);
		//var aRectBleed = this.getPageBox("Bleed", i);
		//var aRectArt = this.getPageBox("Art", i);
		//var aRectMedia = this.getPageBox("Media", i);
		
		
		// Alle Boxen Schreiben
		//------------------------------------------------------
		//aRectZiel = aRectMedia 
		//var aRectNewCrop = this.setPageBoxes("Crop", i, i, [aRectZiel]);
		//var aRectNewBBox = this.setPageBoxes("BBox", i, i, [aRectZiel]); --> read only!
		//var aRectNewBleed = this.setPageBoxes("Bleed", i, i, [aRectZiel]);
		//var aRectNewTrim = this.setPageBoxes("Trim", i, i, [aRectZiel]);
		//var aRectNewBBox = this.setPageBoxes("Art", i, i, [aRectZiel]);
		//var aRectNewMedia = this.setPageBoxes("Media", i, i, [aRectZiel]);
		
		
		// Boxen lˆschen
		//------------------------------------------------------
		var aRectNewBleed = this.setPageBoxes("Bleed", i, i);
		var aRectNewTrim = this.setPageBoxes("Trim", i, i);
		var aRectNewBBox = this.setPageBoxes("Art", i, i);
	}
	return ("Auf allen Seiten wurde die Bleed-, Trim- und Art-Box wurde gelöscht.");
}

