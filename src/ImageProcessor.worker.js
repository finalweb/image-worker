/* global onmessage */
var pad = function(str){
  return ('00' + str).slice(-2);
};

var validateBuffer = function (buffer, i){
  // index should be within buffer limits
  if (i > buffer.length) {
    throw new TypeError('Corrupt JPG, exceeded buffer limits');
  }
  // Every JPEG block must begin with a 0xFF
  if (buffer[i] !== 0xFF) {
    console.log("BLOCK #: ", buffer[i].toString(16));
    throw new TypeError('Invalid JPG, marker table corrupted');
  }
}

var getHexHeader = function(ua, type) {
  var h = '',
    final = false;
  for (var i = 0; i < ua.length; i++) {
    var current = pad(ua[i].toString(16));
    var next = ua[i + 1] ? pad(ua[i + 1].toString(16)) : '';

    var condition;
    switch (type){
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

var detectJpeg = function(buffer){
  var width,
      height,
      next;
  buffer = buffer.slice(4, 1024*1024);

  var blockLen, prevBlock;
  while(buffer.length){
    blockLen = parseInt(pad(buffer[0].toString(16)) + pad(buffer[1].toString(16)), 16);

    if (blockLen !== prevBlock) {
      validateBuffer(buffer, blockLen);
      prevBlock = blockLen;
    }

    next = buffer[blockLen + 1];
    if (next === 0xC0 || next === 0xC1 || next === 0xC2) {
      var heightMarker = pad(buffer[blockLen + 5].toString(16)) + pad(buffer[blockLen + 6].toString(16));
      var widthMarker = pad(buffer[blockLen + 7].toString(16)) + pad(buffer[blockLen + 8].toString(16));
      width = parseInt(widthMarker, 16);
      height = parseInt(heightMarker, 16);
      break;
    }
    buffer = buffer.slice(blockLen + 2);
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

