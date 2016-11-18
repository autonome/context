var firstRun = localStorage.firstRun || true,
    runTests = false,
    sources = {}, // keyed off source id
    triggers = {}, // keyed off source id, then signal id
    cache = {}; // keyed off source id, then signal id

const MAX_LEN_SPARKBLOCK = 30;

function init() {

  // force the screen to stay on forever
  if (navigator.requestWakeLock) {
    navigator.requestWakeLock('screen');
  }
  else {
    console.log('No ability to requestWakeLock');
  }

  [ ambientLightSource,
    bluetoothSource,
    cameraSource, // TODO: implement me
    deviceMotionSource,
    deviceOrientationSource,
    powerSource,
    proximitySource,
    soundSource, // TODO: implement activity
    speechSource, // TODO: implement me
  ].forEach(function(d) {

    // based on feature detection
    if (d.enabled) {

      // initialize source
      d.start();

      // cache source
      sources[d.id] = d;

      // display all registered sources
      render(d);

      // listent for data from the source
      document.addEventListener(d.id, processEvent);
    }

  });

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

  console.log('Context Event', sourceId, signalId, e.detail.label, e.detail.value);

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
      if (!match.trigger['value'] ||
          match.trigger.value == e.detail.value) {
        processNotification(match.trigger, match.notification, e.detail);
      }
    });
  }
  else {
    //console.log('no trigger+signal matches')
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

    // enabled?
    if (!source.enabled) {
      containerTpl.content.querySelector('h2').innerText += ' (Not supported by device)';
    }

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
      var start = cachedData.length < MAX_LEN_SPARKBLOCK ? 0 : (cachedData.length - MAX_LEN_SPARKBLOCK);
      var show = cachedData.slice(start, cachedData.length);
      value.textContent = data.value; //sparkline.generate(show, MAX_LEN_SPARKBLOCK);
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
