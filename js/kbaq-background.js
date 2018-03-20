/*
  author: Russell Loniello, www.loniello.com
  KBAQ Chrome Extension
*/

var state = {
  isPlaying: false,
  isMuted: false,
  volume: 80
}

var audio = new Audio();

function getAudio() {
  //generate a random port number.
  var random = Math.floor(Math.random() * 1001);
  //set audio object
  audio = new Audio('https://kjzz.streamguys1.com/kbaq_mp3_128?nocache=' + random);
}

//Adjust volume.
function Volume(value) {
  audio.volume = value / 100;
}

//...
function Play() {
   getAudio();
   audio.play();
   chrome.browserAction.setBadgeText({
     text: "►"
   })
}

//...
function Pause() {
  chrome.browserAction.setBadgeText({
    text: ""
  }), audio.pause()
}


/*
** Check Time-Out **
  Checking to end streaming music every 5 Minutes. (300000 ms)
  ( About the average length of a single piece of classical music )

  This is a work around to Google Chrome's Idle API
  We are not using Google Chrome's idle because user may
  be playing music while not 'on' the computer/browser.

  Instead we are checking if the user is unknownly using the
  extension. (Its muted, and playing), and stopping if this is the case.

*/
var timer = setInterval(function(){ endStreaming() }, 300000);

function endStreaming() {

  if ( (state.isPlaying) && (state.isMuted) ) {
    Pause();
    state.isPlaying = false;
    //get the popup view(s).
    var views = chrome.extension.getViews({
      type: "popup"
    });
    //update it's UI.
    for (var i = 0; i < views.length; i++) {
      views[i].document.getElementById('play_stop').classList.remove("pause");
    }
  }

}
