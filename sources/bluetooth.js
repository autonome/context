/*

Bluetooth

* Detecting a device locally might mean a person is around


http://mxr.mozilla.org/gaia/search?string=bluetoothmanager

*/

var bluetoothSource = (function(global) {
  
  var id = 'source-bluetooth-devices',
      title = 'Bluetooth Devices',
      devices = [],
      adapter = null;

  function initScan() {
    if (!navigator.mozBluetooth) {
      return;
    }

    navigator.mozBluetooth.addEventListener('attributechanged', (evt) => {
      adapter = navigator.mozBluetooth.defaultAdapter;

      adapter.stopDiscovery().then(function() {
        adapter.startDiscovery().then(handle => {
          handle.ondevicefound = e=> {
            var name = e.device.name || 'Unnamed device',
                type = e.device.type || ''

            var device = {
              name: name,
              type: type,
              desc: name + (type ? ' (' + type + ')' : '')
            };

            publish(id, {
              id: 'bluetoothDevice',
              label: 'Bluetooth Device',
              type: 'row',
              value: device.desc,
              data: device
            });
          };

        }, err => console.error(err))
      })

      /*
      if (adapter.startLeScan) {
        adapter.startLeScan([]).then(handle => {
          console.log('LE scan started', handle);
          handle.ondevicefound = e=> {
            console.log('device found?', e)
            var record = parseScanRecord(e.scanRecord);
            if (record) {
              console.log('Found an iBeacon', record.uuid, record.major, record.minor, e.rssi);
            }
          }
         
          setTimeout(() => {
            console.log('Stop LE scanning');
            navigator.mozBluetooth.defaultAdapter.stopLeScan(handle)
          }, 5000);
        }, err => console.error(err))
      }
      */
    });
  }

  function start() {
    initScan();
  }

  // public
  return {
    id: id,
    title: title,
    start: start
  };

})(this);
