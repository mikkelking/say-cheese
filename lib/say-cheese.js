/*
 * Say Cheese!
 * Lee Machin, 2012
 * http://leemach.in, http://new-bamboo.co.uk
 *
 * Minimal javascript library for integrating a webcam and snapshots into your app.
 *
 * Handles starting up the webcam and rendering the element, and also capturing shots
 * in a separate canvas element.
 *
 * Depends on video and canvas, and of course, getUserMedia. It's unlikely to work
 * on anything but the newest browsers.
 */

SayCheese = (function() {

  var SayCheese;

  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia ||
                            false);

  window.AudioContext = (window.AudioContext ||
                         window.webkitAudioContext);

  window.URL = (window.URL ||
                window.webkitURL);
                
  var ERRORS = {
    NOT_SUPPORTED: 'NOT_SUPPORTED',
    AUDIO_NOT_SUPPORTED: 'AUDIO_NOT_SUPPORTED'
  }
//console.log("Cheeses! I am inside the mousetrap!");
  SayCheese = function SayCheese(element, options) {
    this.video = null,
    this.events = {},
    this.stream = null,
    this.options = {
      snapshots: true,
      audio: false,
      width: 320,
      format: 'dataurl'       // Do this by default, can select 'blob' instead
    };

    this.setOptions(options);
    this.element = document.querySelector(element);
    return this;
  };

  SayCheese.prototype.on = function on(evt, handler) {
    if (this.events.hasOwnProperty(evt) === false) {
      this.events[evt] = [];
    }

    this.events[evt].push(handler)
  };

  SayCheese.prototype.off = function off(evt, handler) {
    this.events[evt] = this.events[evt].filter(function(h) {
      return h !== handler;
    });
  };

  SayCheese.prototype.trigger = function trigger(evt, data) {
    if (this.events.hasOwnProperty(evt) === false) {
      return false;
    }

    this.events[evt].forEach(function(handler) {
      handler.call(this, data);
    }.bind(this));
  };

  SayCheese.prototype.setOptions = function setOptions(options) {
    // just use naïve, shallow cloning
    for (var opt in options) {
      this.options[opt] = options[opt];
    }
  }

  SayCheese.prototype.getStreamUrl = function getStreamUrl() {
    if (window.URL && window.URL.createObjectURL) {
      return window.URL.createObjectURL(this.stream);
    } else {
      return this.stream;
    }
  };

  SayCheese.prototype.createVideo = function createVideo() {
    var width     = this.options.width,
        height    = 0,
        streaming = false;
    if (!this.video){
	  console.log("Creating video element");
      this.video = document.createElement('video');
      return this.trigger('start');
    } else {
      this.video.addEventListener('canplay', function() {
        if (!streaming) {
          height = this.video.videoHeight / (this.video.videoWidth / width);
          this.video.width = width;
          this.video.height = height;
          streaming = true;
          return this.trigger('start');
        }
      }.bind(this), false);
    }   
  };

  SayCheese.prototype.linkAudio = function linkAudio() {
    this.audioCtx = new window.AudioContext();
    this.audioStream = this.audioCtx.createMediaStreamSource(this.stream);

    var biquadFilter = this.audioCtx.createBiquadFilter();

    this.audioStream.connect(biquadFilter);
    biquadFilter.connect(this.audioCtx.destination);
  };

  SayCheese.prototype.takeSnapshot = function takeSnapshot(width, height) {
    if (this.options.snapshots === false) {
      return false;
    }

    width  = width || this.video.videoWidth;    // Use either the supplied dimensions, or the size of the actual video preview
    height = height || this.video.videoHeight;

    var snapshot = document.createElement('canvas'),
        ctx      = snapshot.getContext('2d');

    if (this.options.widths) {
      var that = this;
      var snapList = [];
      console.log("Grabbing "+this.options.widths.length+" images");
      var aspectRatio = width/height;
      _.each(this.options.widths, function(w, index, list) {
        snapshot.width = w ;    // Pick up the dimensions from the video frame 
        snapshot.height = w / aspectRatio;  // - then it's not clipped (if in portrait mode)
        console.log("Grabbing an image at "+snapshot.width+"x"+snapshot.height);
        ctx.drawImage(that.video, 0, 0, snapshot.width, snapshot.height);
        if (that.options.format === 'dataurl') {
          snapList.push(snapshot.toDataURL('image/png'));
        }
        if (that.options.format === 'blob') {
          snapshot.toBlob(function(blob) {console.log('Saving blob');snapList.push(blob)},'image/png');
        }
      });
      that.trigger('snapshot', snapList);

    } else {
      console.log("Grabbing a single image at "+width+"x"+height);
      snapshot.width  = width;
      snapshot.height = height;

      ctx.drawImage(this.video, 0, 0, width, height);
// Pass back the dataURL
      if (this.options.format === 'dataurl') {
        this.trigger('snapshot', [snapshot.toDataURL('image/png')]);
      } 
// Pass back a blob
      if (this.options.format === 'blob') {
        snapshot.toBlob(function(blob) {this.trigger('snapshot', [blob]) },'image/png');
      }
    }

    ctx = null;
  };

  // Start up the stream, if possible */
  SayCheese.prototype.start = function start() {

    // fail fast and softly if browser not supported
    if (navigator.getUserMedia === false) {
      this.trigger('error', ERRORS.NOT_SUPPORTED);
      return false;
    }

    var success = function success(stream) {
      this.stream = stream;
      this.createVideo();

      if (navigator.mozGetUserMedia) {
        this.video.mozSrcObject = stream;
      } else {
        this.video.src = this.getStreamUrl();
      }

      if (this.options.audio === true) {
        try {
          this.linkAudio();
        } catch(e) {
          this.trigger('error', ERRORS.AUDIO_NOT_SUPPORTED);
        }
      }

      this.element.appendChild(this.video);
      this.video.play();
    }.bind(this);

    // error is also called when someone denies access 
    var error = function error(error) {
      this.trigger('error', error);
    }.bind(this);

    return navigator.getUserMedia({ video: true, audio: this.options.audio }, success, error);
  };

  SayCheese.prototype.stop = function stop() {
    this.stream.stop();

    if (window.URL && window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL(this.video.src);
    }

    return this.trigger('stop');
  };

  return SayCheese;

})();
