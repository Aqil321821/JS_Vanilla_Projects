const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');

// Song titles , must match with names of songs
const songs = ['hey', 'summer', 'ukulele'];
// Keep track of song
let songIndex = 2;

function loadSong(song) {
  title.innerText = song; //jo song name pass hoa wo set kia
  audio.src = `music/${song}.mp3`; //jo song pass hoa wo play ho
  cover.src = `images/${song}.jpg`; //related image load
}

// Initially load song details into DOM
loadSong(songs[songIndex]);

//play and pause song functions
function playSong() {
  musicContainer.classList.add('play');
  //remove play icon and put pause icon
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');

  audio.play();
}

//audio api has bunch of methods to use and events also like video api
function pauseSong() {
  //opoposite of what we have done in playSong function
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');
  audio.pause();
}

// Previous song and Next song functions
function prevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}
function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
}
// for progress we have event on audio api "timeUpdate" which is keep firing
//we can get duration of video and currentTime , pull these two from audio object

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  // console.log(duration , currentTime);
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

// click progress bar and phr song time wahan set krdo or progress ki value b wohi
function setProgress(e) {
  //this refers to element i.e. container of progress
  const width = this.clientWidth; //total width of container
  const clickX = e.offsetX; //where we click exactly
  const duration = audio.duration; // song ki cmplt duration
  audio.currentTime = (clickX / width) * duration; //set time of song
}

// my all event listeners
playBtn.addEventListener('click', () => {
  //check if song is playing or not then decide to play or pause
  const isPlaying = musicContainer.classList.contains('play');
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
//when a song ends call next song function
audio.addEventListener('ended', nextSong);
