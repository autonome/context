
function publish(id, data) {
  data.timestamp = Date.now();
  window.document.dispatchEvent(new CustomEvent(id, {
    detail: data
  }));
}

// Text-to-speech utility
function say(phrase) {
  if (window.speechSynthesis)
    speechSynthesis.speak(new SpeechSynthesisUtterance(phrase));
}

// Generic JSON loader
function loadJSON(url) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}

function sendJSON(url, obj) {
  var xhr = new XMLHttpRequest({mozSystem: true, mozAnon: true});
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log('resp', xhr.responseText);
    }
  }
  xhr.send(JSON.stringify(obj));
}

// Returned as an int
function percentDifference(a, b) {
  return Math.round((Math.abs(a) - Math.abs(b)) / Math.abs(a) * 100);
}

// Pick a card
function randomIntInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

