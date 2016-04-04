/*

  Overview: Turning sensors into signals. For human consumption.

  * Use existing hardware like old smartphones.
  * Use built-in sensors to derive as much meaning from ambient information as possible.
  * Privacy: not recording voice, just presence/absence of sound.

  Use-Cases

  * No sound for 2hrs, something is wrong. Mom had a heart attack. 
  * Am traveling, get notification of power outage.
  * Am traveling, get notification of "Joe's iPhone" in the house. WTF.
  * Getting dark and no people are around, so turn the lights off.
  * How am i sleeping? Analyse relative noise/motion.

  TODO implement broad classification detectors

  * home vs away vs asleep
  * people present - active or not
  * relative noisiness
  * a person is in my house (bluetooth, sound, speech)
  * a person has arrived
  * a person has departed
  * how many people are around
  * detect a cat, dog, bird

  Signals

  * Hardware capabilities are 'sources', eg Wifi.
  * Sources can emit multiple signals, eg 'wifi connection lost', 'new wifi network found'
  * Properties:
  ** sourceId (string), eg 'bluetooth'
  ** sourceLabel (string), eg 'Bluetooth'
  ** sourceIcon (string URL)
  ** signalId: (string), eg 'newdevice'
  ** signalLabel (string): Readable description
  ** signalIcon (string URL)
  ** type (string), 'scalar' or 'stream'
  ** value (anything)

  Triggers

  * Triggers match signal events and configures notifications in response.
  * Can assign notifications per trigger for each criticality level
  * Properties:
  ** events (array), Array of event matcher objects
  ** actions (array), Array of actions
  ** notifications (array), Array of notifications

  Event Matching Triggers

  * An object that configures how a trigger matches against a signal
  * Properties:
  ** sourceId (string, reqd), id of source
  ** signalId (string, reqd), id of signal
  ** value: (mixed, opt), Unsure yet. Regex? Matching function? How to handle streams? Percent change?
  ** criticality (int, 1-3, reqd), the criticality resulting from a match

  Notifications

  * TODO: check against notification spec
  * Properties:
  ** title
  ** description
  ** icon
  ** criticality (int, 1-3)
  ** data

  Actions
  * actions to take based on a trigger match
  * TODO results are included in notifications somehow
  ** actionId (string), eg 'takePicture'
  ** actionLabel (string), eg 'Take picture'
  ** actionIcon (string URL), URL of icon
  ** actionOutput
  * action request
  ** actionId
  ** timeout


  Example code
  
  // Notify me when the power goes out.

  var trigger = {
    source: 'source-power',
    signal: 'batteryCharging',
    value: false,
    criticality: 3
  };

  var action = {
    id: 'takePicture',
    timeout: 1000
  };

  var notification = {
    title: '',
    description: '',
    icon: ''
  };

  registerTrigger([matcher], [action], [notification]);

  V1 TODO

  * set up default triggers: power, new bluetooth device
  * trigger support for cache in matches (eg: new bluetooth, compared to ever found)
  * fix tests (use default triggers?)
  * datastorage should be in signal
  * action system (takePicture, recordSound, saySomething, webRequest, beep, 
  * notification system: expand to use plugins
  * rewrite ui render using triggers?
  * test/fix device motion
  * test/fix device orientation
  * fix sound variable cache length
  * fix stream data scaling
  * persist data (have viz pull from persistent cache?)
  * settings UI for ifttt maker channel
  * settings UI integration for trigger/notification

  V2 TODO

  * storage infra (pouchdb)
  * store module logs
  * web socket & pusher support
  * move everything to a worker?
  * Connect listener devices via NFC, which installs app and registers for push notifications

  generated music
  * wifi networks add/remove
  * light
  * motion

*/

var firstRun = localStorage.firstRun || true,
    runTests = true,
    sources = {}, // keyed off source id
    triggers = {}, // keyed off source id, then signal id
    cache = {}; // keyed off source id, then signal id

const MAX_LEN_SPARKBLOCK = 60;

function init() {

  // force the screen to stay on forever
  if (navigator.requestWakeLock) {
    navigator.requestWakeLock('screen');
  }
  else {
    console.log('No ability to requestWakeLock');
  }

  [ ambientLightSource, // TODO: not detecting brightened state in low light
    bluetoothSource, // done scan enumeration, TODO: LE scanning, add/remove detection
    cameraSource, // TODO: implement me
    deviceMotionSource, // DONE
    deviceOrientationSource, // DONE
    powerSource, // TODO: test me with wifi debugging
    proximitySource, // DONE
    //soundSource, // TODO: implement activity
    //speechSource, // TODO: implement me
    wifiSource // Basic on/off done. TODO: Needs add/remove detection
  ].forEach(function(d) {

    // initialize source
    d.start();

    // cache source
    sources[d.id] = d;

    // display all registered sources
    render(d);

    // listent for data from the source
    document.addEventListener(d.id, processEvent);
  });

  notifyIFTTT("Power has been lost.");
  notifyIFTTT("Device moved significantly.");
  notifyIFTTT("New Bluetooth device detected: \"alan's iPhone\".");
  notifyIFTTT("It's 9am and there's been no sound for two hours.");
  notifyIFTTT("The wi-fi internet connection has been lost.");

}
window.addEventListener('DOMContentLoaded', init);

function registerTrigger(trigger, action, notification) {
  if (!triggers[trigger.source])
    triggers[trigger.source] = [];
  if (!triggers[trigger.source][trigger.signal])
    triggers[trigger.source][trigger.signal] = [];

  triggers[trigger.source][trigger.signal].push({
    trigger: trigger, 
    action: action,
    notification: notification
  });
}

function processEvent(e) {
  var source = sources[e.type],
      sourceId = source.id,
      signalId = e.detail.id;

  // cache source data by source id, then by signal id
  // TODO: persistentize this?
  // TOOD: cap this
  if (!cache[sourceId])
    cache[sourceId] = []
  if (!cache[sourceId][signalId])
    cache[sourceId][signalId] = []
  cache[sourceId][signalId].push(e.detail.value);

  //notifyIFTTT(signalId, e.detail.label, e.detail.value) {

  // render the data
  render(source, e.detail, cache[sourceId][signalId]);

  // find matching triggers
  if (triggers[sourceId] && triggers[sourceId][signalId]) {
    var matched = triggers[sourceId][signalId];
    console.log('matched?', matched)
    matched.forEach(function(match) {
      if (match.trigger.value == e.detail.value) {
        processNotification(match.trigger, match.notification, e.detail);
      }
    });
  }
  else {
    console.log('no trigger+signal matches')
  }
}

function processNotification(trigger, notification, data) {
  if (!("Notification" in window)) {
    console.error("This browser does not support desktop notification");
  }

  Notification.requestPermission(function (permission) {
    if (permission === "granted") {
      new Notification(notification.title, {
        body: notification.description,
        icon: notification.icon
      });
    }
  });
}

// Data renderer
function render(source, data, cachedData) {
  // get the container for this source
  var container = document.querySelector('#' + source.id);

  // if the signal container doesn't exist yet, create it
  if (!container) {
    var containerTpl = document.querySelector('#template-signal')

    // set the title
    containerTpl.content.querySelector('h2').innerText = source.title;

    // add to document
    var containerClone = document.importNode(containerTpl.content, true);
    containerTpl.parentNode.appendChild(containerClone);

    // get newly added element and give it an id
    container = containerTpl.parentNode.lastElementChild;
    container.setAttribute('id', source.id);
  }

  if (data) {
    var dataContainer = container.querySelector('.data'),
        entryNode = dataContainer.querySelector('.' + data.id);

    if (!entryNode) {
      var entryTpl = document.querySelector('#template-signal-entry');
      entryNode = document.importNode(entryTpl.content, true).firstElementChild;
      entryNode.classList.add(data.id);
    }

    if (data.type == 'row') {
      entryNode = entryNode.cloneNode(true);
    }

    var label = entryNode.querySelector('.label');
    label.textContent = data.label;

    var value = entryNode.querySelector('.value');

    if (data.type == 'scalar' || data.type == 'row') {
      value.textContent = data.value;
    }
    else if (data.type == 'stream') {
      var start = cachedData < MAX_LEN_SPARKBLOCK ? 0 : cachedData.length - MAX_LEN_SPARKBLOCK;
      var show = cachedData.slice(start, cachedData.length - 1);
      value.textContent = sparkline.generate(show);
    }

    dataContainer.appendChild(entryNode);
  }
}

function notifyIFTTT(value1, value2, value3) {
  var url = 'https://maker.ifttt.com/trigger/yourAppName/with/key/yourIFTTTKey';

  var msg = {
    value1: value1,
    value2: value2,
    value3: value3
  };

  sendJSON(url, msg);
}
