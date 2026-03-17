const video = document.querySelector("#video");
const videoPlane = document.querySelector("#videoPlane");
const muteBtn = document.querySelector("#muteBtn");
const replayBtn3D = document.querySelector("#replayBtn3D");

const scanMsg = document.getElementById("scan-message");
const scanEffect = document.getElementById("scan-effect");

let audioUnlocked = false;
let hasEnded = false;

// --------------------
// VIDEO SIZE FIX
// --------------------
video.addEventListener("loadedmetadata", () => {
  const ratio = video.videoHeight / video.videoWidth;
  videoPlane.setAttribute("width", 1);
  videoPlane.setAttribute("height", ratio);
});

// --------------------
// TARGET EVENTS
// --------------------
document.querySelector("a-scene").addEventListener("renderstart", () => {

  const target = document.querySelector("[mindar-image-target]");

  target.addEventListener("targetFound", () => {

    scanEffect.style.display = "none";
    scanMsg.innerText = "Ready";

    setTimeout(() => {
      scanMsg.style.opacity = 0;
    }, 3000);

    if (navigator.vibrate) navigator.vibrate(50);

    // Resume video (DO NOT RESET)
    video.muted = !audioUnlocked;

    if (!hasEnded) {
      video.play();
    }

    videoPlane.setAttribute("material", "opacity: 1");

    showMuteIcon();

  });

  target.addEventListener("targetLost", () => {
    video.pause();
  });

});

// --------------------
// AUDIO UNLOCK
// --------------------
muteBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  video.muted = false;

  video.play().then(() => {
    console.log("Audio unlocked");
  });

  audioUnlocked = true;

  muteBtn.src = "assets/icons/unmute.png";

  setTimeout(() => {
    muteBtn.style.opacity = 0;
  }, 5000);
});

function showMuteIcon() {
  if (!audioUnlocked) {
    muteBtn.style.opacity = 1;
  }
}

// --------------------
// VIDEO END
// --------------------
video.addEventListener("ended", () => {
  hasEnded = true;

  replayBtn3D.setAttribute("visible", true);
});

// --------------------
// REPLAY BUTTON (3D)
// --------------------
replayBtn3D.addEventListener("click", (e) => {
  e.stopPropagation();

  video.currentTime = 0;
  video.play();

  hasEnded = false;

  replayBtn3D.setAttribute("visible", false);
});
