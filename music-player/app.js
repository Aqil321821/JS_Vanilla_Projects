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

// Initially load song details into DOM
loadSong(songs[songIndex]);

function loadSong(song) {
  title.innerText = song; //jo song name pass hoa wo set kia
  audio.src = `music/${song}.mp3`; //jo song pass hoa wo play ho
  cover.src = `images/${song}.jpg`; //related image load
}

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
