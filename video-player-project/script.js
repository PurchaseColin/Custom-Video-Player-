// condition ? exprIfTrue : expIfFalse
//for(declares variable; condition; increment ){ do something}

const container = document.querySelector(".container"),
  mainVideo = container.querySelector("video"),
  videoTimeline = container.querySelector(".video-timeline"),
  videoDuration = container.querySelector(".video-duration"),
  progressBar = container.querySelector(".progress-bar"),
  volumeBtn = container.querySelector(".volume i"),
  volumeSlider = container.querySelector(".left input"),
  currentVidTime = container.querySelector(".current-time"),
  skipForward = container.querySelector(".skip-forward"),
  skipBackward = container.querySelector(".skip-backward"),
  playPauseBtn = container.querySelector(".play-pause i"),
  speedBtn = container.querySelector(".playback-speed span"),
  speedOptions = container.querySelector(".speed-options"),
  picInPicBtn = container.querySelector(".pic_in_pic span"),
  fullscreenBtn = container.querySelector(".fullscreen i");
let timer;

const hideControls = () => {
  if (mainVideo.paused) return;
  timer = setTimeout(() => {
    container.classList.remove("show-controls");
  }, 3000);
};

hideControls();

container.addEventListener("mousemove", () => {
  container.classList.add("show-controls");
  clearTimeout(timer);
  hideControls();
});

const formatTime = (time) => {
  // getting seconds, minutes, hours
  let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

  // adding 0 at the begining od the particuakr value is less than 10
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  hours = hours < 10 ? `0${hours}` : hours;

  if (hours == 0) {
    return `${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
};

mainVideo.addEventListener("timeupdate", (e) => {
  let { currentTime, duration } = e.target; // getting currentTime and diration of the video
  let percent = (currentTime / duration) * 100;
  progressBar.style.width = `${percent}%`;
  currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", (e) => {
  videoDuration.innerText = formatTime(e.target.duration); // passing video duratoion as innertext
});

videoTimeline.addEventListener("click", (e) => {
  let timelineWidth = videoTimeline.clientWidth; // getting videoTimeline width
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // updating video cuurent time
});

const draggableProgressBar = (e) => {
  let timelineWidth = videoTimeline.clientWidth; // getting videoTimeline width
  progressBar.style.width = `${e.offsetX}px`; // passing offsetX value as progressbar width
  mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
  // updatinf the video currentTime

  currentVidTime.innerText = formatTime(mainVideo.currentTime);
};

videoTimeline.addEventListener("mousedown", () => {
  videoTimeline.addEventListener("mousemove", draggableProgressBar);
});

document.addEventListener("mouseup", () => {
  videoTimeline.removeEventListener("mousemove", draggableProgressBar);
});

videoTimeline.addEventListener("mousemove", (e) => {
  const progressTime = videoTimeline.querySelector("span");
  let offsetX = e.offsetX; // passing offsetx value as progressTime left value
  progressTime.style.left = `${offsetX}px`;
  let timelineWidth = videoTimeline.clientWidth;
  let percent = (e.offsetX / timelineWidth) * mainVideo.duration;
  progressTime.innerText = formatTime(percent); // passing percent as progressTime innerText
});

volumeBtn.addEventListener("click", () => {
  if (!volumeBtn.classList.contains("fa-volume-high")) {
    // if volume icon isn't volume high icon
    mainVideo.volume = 0.5; // passing .5 valuse as video volume
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  } else {
    mainVideo.volume = 0.0; // passing .0 value as video volume, so the video mute
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  }

  volumeSlider.value = mainVideo.volume; // upgrade the slider volume to the
});

volumeSlider.addEventListener("input", (e) => {
  mainVideo.volume = e.target.value; // passing slider value as video volume
  if (e.target.value == 0) {
    // if slidervalue is 0, change the icon to mute icon
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  } else {
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  }
});

speedBtn.addEventListener("click", () => {
  speedOptions.classList.toggle("show");
});

speedOptions.querySelectorAll("li").forEach((option) => {
  option.addEventListener("click", () => {
    // adding click event in all speed options
    mainVideo.playbackRate = option.dataset.speed; //passing option dataset value as video playback value as video playback value
    speedOptions.querySelector(".active").classList.remove("active"); // remove active class
    option.classList.add("active"); // addinf active class on selected option n
  });
});

document.addEventListener("click", (e) => {
  // hide options on document click
  if (
    e.target.tagName !== "SPAN" ||
    e.target.className !== "material-symbols-outlined"
  ) {
    speedOptions.classList.remove("show");
  }
});

picInPicBtn.addEventListener("click", () => {
  mainVideo.requestPictureInPicture();
});

fullscreenBtn.addEventListener("click", () => {
  container.classList.toggle("fullscreen");
  if (document.fullscreenElement) {
    fullscreenBtn.classList.replace("fa-compress", "fa-expand");
    return document.exitFullscreen();
  }
  fullscreenBtn.classList.replace("fa-expand", "fa-compress");
  container.requestFullscreen();
});

skipBackward.addEventListener("click", () => {
  mainVideo.currentTime -= 5;
});

skipForward.addEventListener("click", () => {
  mainVideo.currentTime += 5;
});

playPauseBtn.addEventListener("click", () => {
  // if video is paused play the video else pause the video
  mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener("play", () => {
  // if video is play, change icon to pause
  playPauseBtn.classList.replace("fa-play", "fa-pause");
});

mainVideo.addEventListener("pause", () => {
  // if video is pause, change icon to play
  playPauseBtn.classList.replace("fa-pause", "fa-play");
});
