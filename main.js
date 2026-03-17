const video = document.querySelector("#video");
const muteBtn = document.querySelector("#muteBtn");
const replayBtn = document.querySelector("#replayBtn");
const scanMsg = document.getElementById("scan-message");
const scanEffect = document.getElementById("scan-effect");

const glow = document.querySelector("#glow");
const videoPlane = document.querySelector("#videoPlane");

let audioUnlocked = false;

// --------------------
// TARGET EVENTS
// --------------------
document.querySelector("a-scene").addEventListener("renderstart", () => {

  const target = document.querySelector("[mindar-image-target]");

  target.addEventListener("targetFound", () => {

    // UI updates
    scanEffect.style.display = "none";
    scanMsg.innerText = "Ready";

    setTimeout(() => {
      scanMsg.style.opacity = 0;
    }, 1500);

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(50);

    // Glow animation
    glow.setAttribute("animation__glow", {
      property: "opacity",
      from: 0,
      to: 0.35,
      dur: 200,
      easing: "easeOutQuad"
    });

    // Lock-in pulse
    videoPlane.setAttribute("animation__scale", {
      property: "scale",
      from: "0.95 0.95 1",
      to: "1 1 1",
      dur: 200,
      easing: "easeOutBack"
    });

    videoPlane.setAttribute("animation__pulse", {
      property: "scale",
      to: "1.03 1.03 1",
      dir: "alternate",
      loop: 2,
      dur: 120
    });

    // Fade in video
    videoPlane.setAttribute("animation__fade", {
      property: "material.opacity",
      from: 0,
      to: 1,
      dur: 200
    });

    // Play video muted
    video.muted = true;
    video.play();

    showMuteIcon();
  });

  target.addEventListener("targetLost", () => {
    video.pause();
  });

});

// --------------------
// AUDIO CONTROL
// --------------------
muteBtn.addEventListener("click", () => {

  video.muted = false;
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
// VIDEO END → REPLAY
// --------------------
video.addEventListener("ended", () => {
  replayBtn.style.opacity = 1;
});

replayBtn.addEventListener("click", () => {
  video.currentTime = 0;
  video.play();
  replayBtn.style.opacity = 0;
});