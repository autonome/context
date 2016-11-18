// Device motion
//
// * If the device moved it might mean someone is taking it
// * Or an earthquake
// * Or someone walked by
// * Or maybe that the house is floating away
//
// TODO: all null values on Flame device

var deviceMotionSource = (function(window) {
  var id = 'source-device-motion',
      title = 'Device Motion',
      enabled = true,
      last = null,
      threshold = 100; // meters per second

  function start() {
    window.addEventListener('devicemotion', function(e) {

      var acceleration = e.acceleration.x ? e.acceleration :
                         e.accelerationIncludingGravity;

      if (!last) {
        last = {
          x: acceleration.x,
          y: acceleration.y,
          z: acceleration.z
        };
      }

      var changed = Object.keys(last).some(function(key) {
        var diff = percentDifference(last[key], acceleration[key]);
        //console.log('motion', key, last[key], acceleration[key], diff)
        if (last[key] && acceleration[key] && diff > threshold) {
          //console.log('motion', key, last[key], acceleration[key], diff)
          return diff > threshold;
        }
        return false;
      });

      if (changed) {
        var details = {
          id: 'deviceMotionThreshold',
          label: 'Device Motion',
          type: 'scalar',
          value: 'The device is in motion.',
          x: acceleration.x,
          y: acceleration.y,
          z: acceleration.z,
          lastX: last.x,
          lastY: last.y,
          lastZ: last.z
        };

        publish(id, details);

        //console.log('device is in motion', last, changed);
        last.x = acceleration.x,
        last.y = acceleration.y,
        last.z = acceleration.z
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
