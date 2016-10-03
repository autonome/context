# Context - Using old smartphones as stationary IoT devices

Overview: Turning sensors into signals for human consumption.

* Use existing hardware like old smartphones.
* Use built-in sensors to passively derive as much meaning from ambient information as possible.
* Privacy: eg, not recording voice, just presence/absence of sound.

Use-Cases

* No sound for 2hrs, something is wrong. Mom had a heart attack. 
* While traveling, get notification of power outage at home.
* While at work, get notification of "Joe's iPhone" in the house. WTF.
* Getting dark and no people are around, so turn the lights off.
* How am I sleeping? Analyse relative noise/motion.
* You haven't left the house in 5 days (Genevieve Bell)

## Usage

There's no UI for this yet.

Example code for listening to a sensor and taking action based on it.

````
// Notify me when the power goes out.

var trigger = {
  source: 'source-power',
  signal: 'batteryCharging',
  value: false // trigger when the value for batteryCharging changes to false
};

var notification = {
  title: 'Power Outage',
  description: 'The power went out!'
};

registerTrigger([matcher], [], [notification]);

// Take a picture and send it to me when a new Bluetooth device is detected.

var trigger = {
  source: 'source-bluetooth-devices',
  signal: 'bluetoothDevice'
};

var action = {
  id: 'takePicture',
  timeout: 1000
};

var notification = {
  title: 'New Bluetooth Device',
  description: 'New Bluetooth device detected.'
};

registerTrigger(matcher, action, notification);

````

## Concepts

Sources & Signals

* Hardware capabilities are 'sources', eg Wifi.
* Sources can emit multiple signals, eg 'current wifi connection lost', 'new wifi network found'
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



## Contributing

## TODO

Post
* build api capabilities grid across mobile browsers
* 4 mins: audience loads URL at beginning and lead them through learning what can be inferred with each api

Implement broad classifications:

* home vs away vs asleep
* people present - active or not
* relative noisiness
* a person is in my house (bluetooth, sound, speech)
* a person has arrived
* a person has departed
* how many people are around
* detect a cat, dog, bird

V1 TODO

* set up some default triggers: power, camera, sound
* trigger support for cache in matches (eg: new bluetooth device, compared to if ever found)
* triggers for any value change (eg, true/false in batteryCharging - you want to know when the power goes back on)
* fix tests (use default triggers?)
* datastorage should be in signal?
* notification system: expand to use plugins
* rewrite ui render using triggers?
* fix sound variable cache length
* fix stream data scaling
* persist data (have viz pull from persistent cache?)
* settings UI for ifttt maker channel
* settings UI integration for trigger/notification
* check notifications config against web notification spec
* list unsupported sensors (output to console?)
* generated docs from sources

V2 TODO

* storage infra (pouchdb)
* store module logs
* action system (takePicture, recordSound, saySomething, webRequest, beep, 
* move everything to a worker?
* Connect listener devices via NFC, which installs app and registers for push notifications

## Fun Stuff TODO
* generated music
* wifi networks add/remove
* light
* motion
