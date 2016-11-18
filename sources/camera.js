/*

Camera

* Use person and face detection to know when people are around, or cats

*/

var cameraSource = (function(global) {

  var id = 'source-camera',
      title = 'Camera',
      enabled = 'mediaDevices' in navigator;

  function start() {
    var config = {video: true, audio: false};

    initCamera(config, function(stream) {
      /*
      var video = document.querySelector('.bg-video');
      video.setAttribute('autoplay', true);
      video.src = window.URL.createObjectURL(stream);
      console.log('camera initialized');
      */
      var url = window.URL.createObjectURL(stream);
      var data = {
        id: 'cameraStreamURL',
        label: 'Camera Stream URL',
        type: 'scalar',
        value: url
      };

      publish(id, data);
    });
  }

  function initCamera(config, callback) {
    navigator.mediaDevices.getUserMedia(config).then(function (stream) {
      callback(stream);
    });
  }

  // public
  return {
    id: id,
    title: title,
    enabled: enabled,
    start: start
  };

})(this);
