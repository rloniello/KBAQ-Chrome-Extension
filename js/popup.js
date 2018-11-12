$(document).ready(function(){

  //get the background page
  var bp = chrome.extension.getBackgroundPage();

  //Don't block the main thread while getting info.
  async function getStreamInfo() {
    $.post("https://kbaq.org/onnow.php", function(data) {
      var raw = data.split("{");
      var host =  raw[0];
      var track = raw[1];

      //Update html and state
      if( host != "" ){
        $('#host').html(host);
      }
      if( track != "" ) {
        $('#track').html(track);
      }
    });
  }


  /*
    Event Handlers
  */

  //Play or Stop? ... toggle is evil
  $("#play_stop").click(function () {
    //if it is currently paused and we need to play:
    if( !($(this).hasClass('pause')) ) {

      //update state
      bp.state.isPlaying = true;
      bp.state.isMuted = false;

      //set the ui's volume back to it's value from state
      $("input[type=range]").val(bp.state.volume);
      $("#volume div").width(bp.state.volume + "%");
      $(".volume").removeClass('mute');

      //set the audio volume
      bp.Volume(bp.state.volume);
      //load and play
      bp.audio.load();
      bp.Play();

      //Update stream track and host
      getStreamInfo();

      // Update the play button
      $(this).addClass('pause');
    } else {
      //Otherwise we are just pausing audio
      bp.Pause();
      //update state
      bp.state.isPlaying = false;
      // Update the play button
      $(this).removeClass('pause');
    }

  });

 //Mute Volume On/Off
 $(".volume").click(function () {
   //if it is currently muted, unmute and set state and volume.
   if(bp.state.isMuted) {
     //It is currently muted, turn the sound back on.
     $("input[type=range]").val(bp.state.volume);
     $("#volume div").width(bp.state.volume + "%");
     //set the audio volume
     bp.Volume(bp.state.volume);
     //update state
     bp.state.isMuted = false;
     // Update the volume button
     $(this).removeClass('mute');

   } else {
     //It is NOT Muted, user wishes to mute.

     //set ui volume to zero
     $("input[type=range]").val(0);
     $("#volume div").width(0);
     //mute the audio volume, and update state.
     bp.Volume(0);
     bp.state.isMuted = true;
     // Update the volume button
     $(this).addClass('mute');

   }
 });

 /* User Changed Volume */
 $("input[type=range]").change(function () {
   //Update state's volume
   bp.state.volume = $(this).val();
   //set audio volume
   bp.Volume(bp.state.volume);
   //update volume UI.
   $("#volume div").width(bp.state.volume + "%");

   //if the volume has been changed to less than half
   if( $(this).val() < 50 ) {
     //add the class of "half" which will update the volume button ui.
     $(".volume").addClass('half');
   } else {
     //Otherwise it was previously below half, remove the class half.
     $(".volume").removeClass('half');
   }

   //The user dragged the volume input to zero.
   if($(this).val() == 0){
     //update state
     bp.state.isMuted = true;
     //if the volume button has the class half, we are going to remove it.
     $(".volume").removeClass('half');
     //and add the mute class
     $(".volume").addClass('mute');
   } else {
     //otherwise, always set state isMuted to false
     bp.state.isMuted = false;
     // and remove the mute class if it exists.
     $(".volume").removeClass('mute');
   }
 });



  /* Code executed on Relaunch (re-open from BrowerAction) */
  //if we are playing music:
  if(bp.state.isPlaying) {
    //set pause state on play button (tell the user they can pause).
    $("#play_stop").addClass('pause');
    //set the current volume from state.
    $("input[type=range]").val(bp.state.volume);
    $("#volume div").width(bp.state.volume + "%");

    //if we are playing and we are muted
    if(bp.state.isMuted) {
      //update ui to show muted on volume.
      $(".volume").addClass('mute');
      $("input[type=range]").val(0);
      $("#volume div").width(0);
    }

    //if the volume has been changed to less than half
    if( $("input[type=range]").val() < 50 ) {
      //add the class of "half" which will update the volume button ui.
      $(".volume").addClass('half');
    } else {
      //Otherwise it was previously below half, remove the class half.
      $(".volume").removeClass('half');
    }

    //Music is playing and regardless if music is muted
    //update stream UI.
    getStreamInfo();
  } else {
    //Otherwise, music is not playing, remove the class pause if it exists.
    //(tell the user they can play).
    $("#play_stop").removeClass('pause');
  }


});
//eof
