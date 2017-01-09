/* global onmessage */
var pad = function(str){
  return ('00' + str).slice(-2);
};

var getHexHeader = function(ua, type) {
  var h = '',
    final = false;
  for (var i = 0; i < ua.length; i++) {
    var current = pad(ua[i].toString(16));
    var next = ua[i + 1] ? pad(ua[i + 1].toString(16)) : '';

    var condition;
    switch (type){
      case 'image/jpeg':
        condition = current === 'ff' && (next === 'c0' || next === 'c2');
        break;
      case 'image/png':
        condition = i > 20;
        break;
    }

    h += current + ' ';
    if (condition){
      final = i + 10;
    } else if (final === i){
      break;
    }
  }
  return h;
};

var detectJpeg = function(array){
  array = getHexHeader(array, 'image/jpeg').split(' ');
  var found = false,
    width,
    height;
  for (var i = 0; i < array.length; i++){
    if (array[i] === 'ff' && (array[i + 1] === 'c0' || array[i + 1] === 'c2') && !found){
      var heightMarker = array[i + 5] + array[i + 6];
      var widthMarker = array[i + 7] + array [i + 8];
      width = parseInt(widthMarker, 16);
      height = parseInt(heightMarker, 16);
      console.log('WIDTH: ', heightMarker, ' HEIGHT: ', widthMarker);
      found = true;
    }
  }
  return {width: width, height: height};
};

var detectPng = function(array){
  var hexArray = getHexHeader(array, 'image/png').split(' ');
  var widthHex = hexArray[16] + hexArray[17] + hexArray[18] + hexArray[19],
    heightHex = hexArray[20] + hexArray[21] + hexArray[22] + hexArray[23];
  return {width: parseInt(widthHex, 16), height: parseInt(heightHex, 16)};
};

onmessage = function(event){
  if (event.data.type === 'getDetails'){
    var file = event.data.file,
      reader = new FileReaderSync(),
      binary = reader.readAsArrayBuffer(file),
      array = new Uint8Array(binary),
      dimensions;
    var preview = event.data.preview ? reader.readAsDataURL(file) : null;
    switch (file.type){
      case 'image/jpeg':
        dimensions = detectJpeg(array);
        break;
      case 'image/png':
        dimensions = detectPng(array);
        break;
    }

    var result = {
      width: dimensions.width,
      height: dimensions.height
    };
    if (preview){
      result.preview = preview;
    }

    postMessage(result);
  }
};

