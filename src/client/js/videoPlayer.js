const { default: fetch } = require("node-fetch");

const video = document.querySelector("video");
const playBtn = document.getElementById("play"); 
const muteBtn = document.getElementById("mute");
const volume = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeLine = document.getElementById("timeLine");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");


let volumeTmp;
let controlsTimeout = null;
let controlsMovementTimeout = null;

const playPauseFunc = () => {
    if(video.paused) {
        video.play();
        playBtn.firstChild.classList.remove("fa-play");
        playBtn.firstChild.classList.add("fa-pause");
    } else {
        video.pause();
        playBtn.firstChild.classList.remove("fa-pause");
        playBtn.firstChild.classList.add("fa-play");
    }
}

const handlePlayClick = (e) => {
    playPauseFunc();
}

const muteFunc = () => {
    video.muted = true;
    muteBtn.firstChild.classList.remove("fa-volume-up");
    muteBtn.firstChild.classList.add("fa-volume-mute");
}

const unMuteFunc = () => {
    video.muted = false;
    muteBtn.firstChild.classList.remove("fa-volume-mute");
    muteBtn.firstChild.classList.add("fa-volume-up");
}

const handleMute = (e) => {
    if(video.muted) {
        unMuteFunc();
    } else {
        muteFunc();
    }
    volumeTmp = video.muted ? volume.value : volumeTmp;
    volume.value = video.muted ? 0 : volumeTmp;
}

const handleVolumeChange = (event) => {
    const {target: {value}} = event;
    if(value === "0") {
        muteFunc();
        volumeTmp = 0.5;
    } else if(Number(value) <= 0.3 ) {
        muteBtn.firstChild.classList.remove("fa-volume-up");
        muteBtn.firstChild.classList.remove("fa-volume-mute");
        muteBtn.firstChild.classList.add("fa-volume-down");
    } else {
        unMuteFunc();
        volumeTmp = value;
    }
}

const formatTime = (seconds) => new Date(seconds*1000).toISOString().substr(11,8);
const hideControls = () => videoControls.classList.add("hiding");

const handleLoadedMetaData = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeLine.max = Math.floor(video.duration);
    setTimeout(hideControls, 2000);
}

const handleTimeUpdate = () => {
    currentTime.innerText =formatTime(Math.floor(video.currentTime));
    timeLine.value = Math.floor(video.currentTime);
}

const handleTimeLineChange = (event) => {
    const {target : {value}} = event;
    video.currentTime = value;
}

const handleFullScreen = (e) => {
    const fullscreen = document.fullscreenElement;
    if(fullscreen) {
        document.exitFullscreen();
        fullScreenBtn.firstChild.classList.remove("fa-compress");
        fullScreenBtn.firstChild.classList.add("fa-expand");
    } else {
        videoContainer.requestFullscreen();
        fullScreenBtn.firstChild.classList.remove("fa-expand");
        fullScreenBtn.firstChild.classList.add("fa-compress");
    }
}


const handleMouseMove = () => {
    if(controlsTimeout) {
        clearTimeout(controlsTimeout);
    }
    if(controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
    }
    videoControls.classList.remove("hiding");
    controlsMovementTimeout = setTimeout(hideControls,1000);
}

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls,1000);
}

const handleMousePlay = (e) => {
    playPauseFunc();
}

const handleSpaceKye = (e) => {
    if(e.code !== "Space") return;
    handlePlayClick();
}
const handleFullScreenKye = (e) => {
    if(e.code !== "Enter" && e.code !== "KeyF") return;
    handleFullScreen();
}

const handleEscKye = () => {
    if(document.fullscreenElement !== null) return;
    fullScreenBtn.firstChild.classList.remove("fa-compress");
    fullScreenBtn.firstChild.classList.add("fa-expand");
}

const handleEnded = () => {
    const { id } = videoContainer.dataset
    fetch(`/api/videos/${id}/view`, {method:"post"})

}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volume.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata",handleLoadedMetaData);
video.addEventListener("timeupdate",handleTimeUpdate);
timeLine.addEventListener("input", handleTimeLineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("dblclick", handleFullScreen);
video.addEventListener("click",handleMousePlay);
video.addEventListener("ended", handleEnded);
document.addEventListener("keydown", handleSpaceKye);
document.addEventListener("keydown", handleFullScreenKye);
document.addEventListener("fullscreenchange", handleEscKye);