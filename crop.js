//   Crop Media-Box based on Trim-Box
//   MIT License
//   Signalwerk GmbH

function cropInfo() {
  this.name = "crop";
  this.version = 1.6;
  this.mainMenue = this.name + " " + this.version;
  this.info = this.name + " " + this.version + " || Signalwerk GmbH";
}

function replaceAll(str, from, to) {
  var idx = str.indexOf(from);

  while (idx > -1) {
    str = str.replace(from, to);
    idx = str.indexOf(from);
  }
  return str;
}

function mm2pt(inputInMM) {
  return inputInMM / 0.3527778;
}

function pt2mm(inputInPt) {
  return inputInPt * 0.3527778;
}

var myRander = new cropInfo();

app.addSubMenu({ cName: myRander.mainMenue, cParent: "File" });

app.addMenuItem({
  cName: "Media-Box = Trim-Box + Border 0 mm",
  cParent: myRander.mainMenue,
  cExec: "app.alert(cropBorder(0), 3);"
});

app.addMenuItem({
  cName: "Media-Box = Trim-Box + Border 15 mm",
  cParent: myRander.mainMenue,
  cExec: "app.alert(cropBorder(mm2pt(15)), 3);"
});

app.addMenuItem({
  cName: "Media-Box = Trim-Box + Border other...",
  cParent: myRander.mainMenue,
  cExec: "app.alert(cropBorder(undefined), 3);"
});

app.addMenuItem({
  cName: "Media-Box = Trim-Box extended to A4",
  cParent: myRander.mainMenue,
  cExec: "app.alert(cropFormat(mm2pt(210), mm2pt(297)), 3);"
});

app.addMenuItem({
  cName: "Media-Box = Trim-Box extended to A3",
  cParent: myRander.mainMenue,
  cExec: "app.alert(cropFormat(mm2pt(297), mm2pt(420)), 3);"
});

app.addMenuItem({
  cName: "Media-Box = Trim-Box extended to other...",
  cParent: myRander.mainMenue,
  cExec: "app.alert(cropFormat(undefined, undefined), 3);"
});

app.addMenuItem({
  cName: "Remove Bleed-, Trim- und Art-Box",
  cParent: myRander.mainMenue,
  cExec: "app.alert(killBox(), 3);"
});

app.addMenuItem({
  cName: "Info",
  cParent: myRander.mainMenue,
  cExec: "app.alert(myRander.info, 3);"
});

function istZahl(s) {
  if (s != undefined && s != NaN) {
    // replace comma with point
    s = replaceAll(s + "", ",", ".");

    // is it a number
    var regExpZahl = /^((\d+(\.)?(\d)*))$/;

    if (regExpZahl.test(s) == true) {
      var temp = s;
    } else {
      var temp = undefined;
    }
    return temp;
  } else {
    return undefined;
  }
}

function cropBorder(randinpt) {
  if (randinpt == undefined) {
    randinpt = app.response({
      cQuestion: "How many millimeters do you like to ad to the Trim-Box to set the Media-Box?",
      cTitle: "Width of border"
    });
    randinpt = istZahl(randinpt);

    if (randinpt != undefined) {
      randinpt = mm2pt(randinpt);
    }
  }

  if (randinpt == undefined) {
    return "Invalid input";
  } else {
    var numPagDoc = this.numPages;

    for (i = 0; i < numPagDoc; i++) {
      var aRect = this.getPageBox("Trim", i);
      var aRectTrim = this.setPageBoxes("Crop", i, i, [
        aRect[0] - randinpt,
        aRect[1] + randinpt,
        aRect[2] + randinpt,
        aRect[3] - randinpt
      ]);
      var aRect = this.getPageBox("Crop", i);
      var aRectNewMedia = this.setPageBoxes("Media", i, i, aRect);
    }
    return "All pages were cut with a border.";
  }
}

function cropFormat(newWidth, newHeight) {
  if (newWidth == undefined) {
    newWidth = app.response({
      cQuestion: "Please enter the format width in mm.",
      cTitle: "Width"
    });
    newWidth = istZahl(newWidth);

    if (newWidth != undefined) {
      newWidth = mm2pt(newWidth);
    }
  }

  if (newHeight == undefined) {
    newHeight = app.response({
      cQuestion: "Please enter the format height in mm..",
      cTitle: "Height"
    });
    newHeight = istZahl(newHeight);

    if (newHeight != undefined) {
      newHeight = mm2pt(newHeight);
    }
  }

  if (newWidth == undefined || newHeight == undefined) {
    return "Invalid number. Please call the function again.";
  } else {
    var numPagDoc = this.numPages;

    for (i = 0; i < numPagDoc; i++) {
      var aRect = this.getPageBox("Crop", i);
      var width = aRect[2] - aRect[0];
      var height = aRect[1] - aRect[3];

      aRect[0] = aRect[0] - (newWidth - width) / 2;
      aRect[2] = aRect[2] + (newWidth - width) / 2;

      aRect[1] = aRect[1] + (newHeight - height) / 2;
      aRect[3] = aRect[3] - (newHeight - height) / 2;

      var aRectNewMedia = this.setPageBoxes("Crop", i, i, aRect);
      var aRect = this.getPageBox("Crop");
      var aRectNewMedia = this.setPageBoxes("Media", i, i, aRect);
    }
    return "All pages were cut to the format.";
  }
}

function killBox() {
  var numPagDoc = this.numPages;

  for (i = 0; i < numPagDoc; i++) {
    // revmove boxes
    var aRectNewBleed = this.setPageBoxes("Bleed", i, i);
    var aRectNewTrim = this.setPageBoxes("Trim", i, i);
    var aRectNewBBox = this.setPageBoxes("Art", i, i);
  }
  return "On all pages the Bleed-, Trim- and Art-Box were deleted.";
}
