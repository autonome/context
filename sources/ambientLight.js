// Ambient light
// * Detecting a change might mean transition from day to night or back
// * It might mean someone is present, blocking the light
//
// TODO: Threshold value is not right, since values gradually
// increase/decrease when for example you cover and take your
// hand off the screen.
//
// Take 1: only count every 5th event. Result, ehhhh is ok.
// Event counter isn't always right because events come in at
// variable rates.
//
// Take 2: TODO wait n ms and take last result

var ambientLightSource = (function(window) {
  var id = 'source-ambient-light',
      title = 'Ambient Light',
      lastVal = null,
      threshold = 45,
      eventCounter = 0,
      log = [];

  function start() {
    window.addEventListener('devicelight', function(e) {
      if (!lastVal)
        lastVal = e.value;

      if (eventCounter == 5) {
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

        eventCounter = 0;
        lastVal = e.value;
      }

      eventCounter++;
    });
  }

  // public
  return {
    id: id,
    title: title,
    start: start
  };

})(this);
