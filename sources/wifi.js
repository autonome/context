/*

Wifi

* Notify via sms when wifi goes down
* New network might mean a new neighbor
* Lost network might someone moved away


* Basic on/off done.

TODO:
* Needs add/remove detection

*/

var wifiSource = (function(global) {

  var id = 'source-wifi',
      title = 'Wi-fi',
      enabled = 'mozWifiManager' in navigator;
  
  function start() {
    if (enabled) {

      var wifi = navigator.mozWifiManager;
      var lastStatus = wifi.connection.status;

      var details = {
        id: 'wifiConnection',
        label: 'Wi-fi Connection',
        type: 'scalar',
        value: lastStatus,
        status: wifi.connection.status,
        lastStatus: lastStatus
      };

      publish(id, details);

      wifi.onstatuschange = function(e) {
        if (lastStatus != wifi.connection.status) {
          details.value = 'Connection status changed from ' + lastStatus + ' to ' + wifi.connection.status;
          publish(id, details);
        }
      };

      /*
      var oldBSSIDs = [];

      function networkCheck() {
        console.log('networkCheck')
        if (wifi.enabled) {
          var request = wifi.getNetworks();
          request.onsuccess = function() {
            var networks = this.result,
                newNetworks = [],
                newBSSIDs = [];
            networks.forEach(function(network) {
              newBSSIDs.push(network.bssid);
              if (oldBSSIDs.indexOf(network.bssid) == -1) {
                // new network
                newNetworks.push(network);
              }
            });
            var missingNetworks = networkList.find(function(network) {
              return newBSSIDs.indexOf(network.bssid) == -1;
            });
            cb('wifi: ' + newNetworks.length + ' new networks and ' + missingNetworks.length + ' networks no longer present.')
            oldBSSIDs = newBSSIDs;
          }
        }
      }

      */

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
