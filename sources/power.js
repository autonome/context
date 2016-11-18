// Battery status
// * Not charging might mean a power outage, or someone took the phone away
var powerSource = (function(global) {

  var id = 'source-power',
      title = 'Power',
      enabled = 'getBattery' in navigator,
      lastVal = null;

  function start() {
    if (enabled) {
      notify();

      navigator.getBattery().then(function(battery) {
        battery.addEventListener('chargingchange', function(e) {
          if (lastVal != battery.charging) {
            notify();
          }

          lastVal = battery.charging;
        });
      });
    }
  }

  function notify() {
    navigator.getBattery().then(function(battery) {
      var details = {
        id: 'batteryCharging',
        label: 'Battery is charging',
        type: 'scalar',
        value: battery.charging,
        data: {
          charging: battery.charging,
          level: battery.level,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        }
      };

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
