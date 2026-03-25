/*

HTML `<video>` element par kaafi events available hote hain jo playback aur user interaction ko control 
karne ke liye use hote hain; common events me `play`, `pause`, `ended` (playback control), `timeupdate` 
(current time/progress), `loadedmetadata`, `loadeddata`, `canplay`, `canplaythrough` (loading stages),
 `waiting`, `playing`, `stalled` (buffering/network), `seeking`, `seeked` (forward/backward), `volumechange`,
  `ratechange` (audio/speed changes), `progress` (buffer progress) aur `error` (load failure) shamil hain — 
  in sab ko use karke tum fully custom video player bana sakte ho.

*/

const video = document.getElementById('video');
const play = document.getElementById('play');
const stop = document.getElementById('stop');
const progress = document.getElementById('progress');
const timestamp = document.getElementById('timestamp');

// Play & pause , video element has methods/properties to work with video api
function toggleVideoStatus() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

// change icon depending on status of video
function updatePlayIcon() {
  if (video.paused) {
    play.innerHTML = '<i class="fa fa-play fa-2x"></i>';
  } else {
    play.innerHTML = '<i class="fa fa-pause fa-2x"></i>';
  }
}

// Update progress & timestamp

// timeupdate : Jab video chal rahi hoti hai, to ye event baar baar trigger hota rehta hai.
//video has a property currentTime , shows current time of video
function updateProgress() {
  progress.value = (video.currentTime / video.duration) * 100;

  // Get minutes
  let mins = Math.floor(video.currentTime / 60);
  if (mins < 10) {
    mins = '0' + String(mins);
  }

  // Get seconds
  let secs = Math.floor(video.currentTime % 60);
  if (secs < 10) {
    secs = '0' + String(secs);
  }

  timestamp.innerHTML = `${mins}:${secs}`;
}

// Set video time to progress
//jab progress change kro to video wahan move ho jaye
function setVideoProgress() {
  video.currentTime = (Number(progress.value) * video.duration) / 100;
}

// Stop video
function stopVideo() {
  video.currentTime = 0;
  video.pause();
}

// Event listeners
video.addEventListener('click', toggleVideoStatus);
video.addEventListener('pause', updatePlayIcon);
video.addEventListener('play', updatePlayIcon);
video.addEventListener('timeupdate', updateProgress);

play.addEventListener('click', toggleVideoStatus);

stop.addEventListener('click', stopVideo);

progress.addEventListener('change', setVideoProgress);
