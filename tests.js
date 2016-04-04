(function(scope) {

  if (!scope.runTests) {
    return;
  }

  function mockSource(source, id, label, type, value) {
    //console.log('dispatching', source, id, label, type, value)

    var data = {
      id: id,
      label: label,
      type: type,
      value: value
    };

    if (type == 'stream') {
      setInterval(function() {
        data.value = randomIntInRange(0, 30);
        publish(source, data);
      }, 1000);
    }
    else {
      publish(source, data);
    }
  }

  var mockSources = [
    ['source-power', 'batteryCharging', 'Charging', 'scalar', true],
    ['source-sound', 'avgVolume', 'Average Volume', 'stream', null],
    ['source-sound', 'unexpectedNoise', 'Unexpected Noise', 'scalar', 'I heard something after a long silence.'],
    ['source-bluetooth-devices', 'bluetoothDevice', 'Bluetooth Device', 'row', 'Joe\'s iPhone'],
    ['source-bluetooth-devices', 'bluetoothDevice', 'Bluetooth Device', 'row', 'Amazon Echo'],
    ['source-power', 'batteryCharging', 'Charging', 'scalar', false]
  ];

  mockSources.forEach(function(s) {
    mockSource.apply(null, s);
  });


})(this);
