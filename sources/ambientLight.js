/*

Ambient light
* Detecting a change might mean transition from day to night or back
* It might mean someone is present, blocking the light

TODO: Threshold value is not right, since values gradually
increase/decrease when for example you cover and take your
hand off the screen.

Take 1: only count every 5th event. Result, ehhhh is ok.
Event counter isn't always right because events come in at
variable rates.

Take 2: TODO wait n ms and take last result


TODO:
* not detecting brightened state in low light

*/

var ambientLightSource = (function(window) {
  var id = 'source-ambient-light',
      title = 'Ambient Light',
      enabled = true,
      lastVal = null,
      threshold = 45,
      eventCounter = 0,
      log = [];

  function start() {
    window.addEventListener('devicelight', function(e) {

      if (!lastVal)
        lastVal = e.value;

      var percentDiff = percentDifference(lastVal, e.value);

      //console.log('devicelight', lastVal, e.value, percentDiff)

      var data = {
        id: 'ambientLight',
        label: 'Ambient Light',
        type: 'scalar',
        value: null,
        level: e.value,
        lastVal: lastVal,
        percentDiff: percentDiff
      };

      if (e.value < lastVal && percentDiff > threshold) {
        // light dimmed!
        data.value = 'dimmed';
      } else if (e.value > lastVal && percentDiff > threshold) {
        // light brightened!
        data.value = 'brightened';
      }

      if (data.value) {
        publish(id, data);
      }

      lastVal = e.value;
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
