// Proximity
var proximitySource = (function(window) {

  var id = 'source-proximity',
      title = 'Proximity',
      enabled = false;

  function start() {
    window.addEventListener('userproximity', function(e) {

      var details = {
        id: 'proximityNear',
        label: 'Things nearby',
        type: 'scalar',
        value: null,
        near: e.near
      };

      if (e.near) {
        // something is near
        details.value = 'Something is very near. Is it a cat?';
      } else {
        // something is no longer near
        details.desc = 'Something is not near.';
      }

      publish(id, details);

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
