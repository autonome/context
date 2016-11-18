// Device orientation
//
// * If the device moved it might mean someone is taking it
// * Or an earthquake
// * Or someone walked by
// * Or maybe that the house is floating away
//
// TODO: log the delta and respond differently for minor changes
// like a rumble from someone stomping vs very large changes
// like the device being moved

var deviceOrientationSource = (function(window) {
  var id = 'source-device-orientation',
      title = 'Device Orientation',
      enabled = true,
      last = null,
      threshold = 25;

  function start() {
    window.addEventListener('deviceorientation', function(e) {
      if (!last) {
        last = {
          alpha: e.alpha,
          beta: e.beta,
          gamma: e.gamma
        };
      }

      var changed = Object.keys(last).some(function(key) {
        var diff = percentDifference(last[key], e[key]);
        //console.log('orientation', key, last[key], e[key], diff)
        if (last[key] && e[key] && diff > threshold) {
          //console.log('orientation', key, last[key], e[key], diff)
          return diff > threshold;
        }
        return false;
      });

      if (changed) {
        //console.log('orientation changed', last, changed)

        var details = {
          id: 'deviceOrientationThreshold',
          label: 'Device Orientation',
          type: 'scalar',
          value: 'The device orientation changed',
          alpha: e.alpha,
          beta: e.beta,
          gamma: e.gamma,
          lastAlpha: last.alpha,
          lastBeta: last.beta,
          lastGamma: last.gamma
        };

        last.alpha    = e.alpha;
        last.beta     = e.beta;
        last.gamma    = e.gamma;

        publish(id, details);
      }
    }, true);
  }

  // public
  return {
    id: id,
    title: title,
    enabled: enabled,
    start: start
  };

})(this);
