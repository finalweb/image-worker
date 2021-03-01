import ImageWorker from './ImageProcessor.worker.js';

var _defaultOptions = {};

class ImageProcessor{

  constructor(file){
    this._file = file;
  }

  getDetails(opts = {}){
    opts = Object.assign(opts, _defaultOptions);

    return new Promise((resolve, reject) => {
      var worker = new ImageWorker();
      worker.postMessage({
        type: 'getDetails',
        file: this._file,
        preview: opts.preview
      });
      worker.onmessage = function(result){
        resolve(result);
      };
    });
  }

}

export default ImageProcessor;
