function checkIOS(e) {
  var name = e.detail.value;
  console.log(e.detail)

  //var name = "Dietrich's iPhone";

  if (name.indexOf("'s iPhone") != -1) {

    var h1 = document.querySelector('h1');
    h1.classList.add('hidden'); 
    h1.classList.remove('visible'); 

    var pre = name.split("'")[0];
    //var pre = name.split("(")[0];
    h1.innerText = 'Hey ' + pre + '!';
    h1.classList.add('visible'); 
    h1.classList.remove('hidden'); 

    // hide again after 30s
    setTimeout(function() { 
      h1.classList.add('hidden'); 
      h1.classList.remove('visible'); 
    }, 30000)
  }

  try {
  var url = 'http://maker.ifttt.com/trigger/leakingblue/with/key/bN9E9VBcWZM0anX2b3K8zJ'
    + '?value1=' + e.detail.value
    + '&value2=' + e.detail.timestamp;
  send(url);
  } catch(ex) {
    console.error(ex)
  }
}

function send(url) {
  var xhr = new XMLHttpRequest({mozSystem: true, mozAnon: true});
  xhr.open('GET', url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log('resp', xhr.responseText);
    }
  }
  xhr.send();
}
