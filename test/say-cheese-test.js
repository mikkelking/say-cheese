asyncTest("triggers 'start' event when access permitted (click Allow)", function() {
  var sayCheese = new SayCheese('#camera-test');
  sayCheese.on('start', function() {
    ok(true, "start event triggered");
    start();
  });

  sayCheese.start();
});

asyncTest("triggers 'snapshot' event when taking a snapshot", function() {
  var sayCheese = new SayCheese('#camera-test');

  sayCheese.on('start', function() {
    this.takeSnapshot();
  });

  sayCheese.on('snapshot', function(evt, snapshot) {
    ok(snapshot.tagName === 'CANVAS', "snapshot event triggered");
    start();
  });

  sayCheese.start();
});


asyncTest("triggers 'error' event when not supported", function() {
  var sayCheese = new SayCheese('#camera-test');

  // store correct property so we can switch it back after following test
  var origGetUserMedia = navigator.getUserMedia;

  // simulate the lack of functionality
  navigator.getUserMedia = false;

  sayCheese.on('error', function(evt, err) {
    navigator.getUserMedia = origGetUserMedia;
    ok(err === "NOT_SUPPORTED", "not supported event triggered");
    start();
  });

  sayCheese.start();
});

asyncTest("triggers 'error' event when access denied (click Deny)", function() {
  var sayCheese = new SayCheese('#camera-test');

  sayCheese.on('error', function(evt, err) {
    ok(true, "access denied event triggered");
    start();
  });

  sayCheese.start();
});