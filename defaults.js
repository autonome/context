(function(scope) {

  if (!scope.firstRun) {
    return;
  }

  // Set up power loss alerts
  var trigger = {
    source: 'source-power',
    signal: 'batteryCharging',
    value: false
  };

  var notification = {
    title: 'Power alert!',
    description: 'Power has been lost or disconnected',
    icon: ''
  };

  registerTrigger({
    trigger: trigger, 
    notification: notification
  });

})(this);
