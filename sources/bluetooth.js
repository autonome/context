/*

Bluetooth

* Detecting a device locally might mean a person is around


http://mxr.mozilla.org/gaia/search?string=bluetoothmanager

TODO:
* LE scanning

*/

var bluetoothSource = (function(global) {
  
  var id = 'source-bluetooth-devices',
      title = 'Bluetooth Devices',
      enabled = 'mozBluetooth' in navigator,
      devices = [],
      adapter = null;

  function initScan() {

    console.log('bt: starting scan');

    navigator.mozBluetooth.addEventListener('attributechanged', (evt) => {
      doScan();
    });
  }

  function doScan() {

    console.log('bt: starting scan');
    var adapter = navigator.mozBluetooth.defaultAdapter;

    //console.log('bt: got adapter', adapter);

    adapter.stopDiscovery().then(function() {
      console.log('bt: stopped discovery');
      adapter.startDiscovery().then(handle => {
      console.log('bt: started discovery');
        handle.ondevicefound = e=> {
          console.log('bt: found device');
          var name = e.device.name || 'Unnamed device',
              type = e.device.type || ''

          var device = {
            name: name,
            type: type,
            desc: name + (type ? ' (' + type + ')' : '')
          };

          console.log('bt: device found', device);

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
  }


  function start() {
    if (enabled) {
      initScan();
      // Re-scan every minute
      setInterval(doScan, 60 * 1000);
    }
  }

  // public
  return {
    id: id,
    title: title,
    enabled: enabled,
    start: start
  };

})(this);
