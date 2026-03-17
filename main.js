const video = document.querySelector("#video");
const videoPlane = document.querySelector("#videoPlane");
const muteBtn = document.querySelector("#muteBtn");
const replayBtn3D = document.querySelector("#replayBtn3D");

const scanMsg = document.getElementById("scan-message");
const scanEffect = document.getElementById("scan-effect");

let audioUnlocked = false;
let hasEnded = false;

// --------------------
// VIDEO SIZE (AUTO FIT)
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

    console.log("TARGET FOUND");

    // UI
    scanEffect.style.display = "none";
    scanMsg.innerText = "Ready";

    setTimeout(() => {
      scanMsg.style.opacity = 0;
    }, 3000);

    // Haptic
    if (navigator.vibrate) navigator.vibrate(50);

    // Resume video (DON'T reset unless ended)
    video.muted = !audioUnlocked;

    if (!hasEnded) {
      video.play();
    }

    // Show video
    videoPlane.setAttribute("material", "opacity: 1");

    // Force texture update (important)
    video.addEventListener('play', () => {
      const mesh = videoPlane.getObject3D('mesh');
      if (mesh && mesh.material.map) {
        mesh.material.map.needsUpdate = true;
      }
    });

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

  const playPromise = video.play();

  if (playPromise !== undefined) {
    playPromise.then(() => {
      console.log("Audio unlocked");
    }).catch(() => {
      console.log("Audio failed");
    });
  }

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
// VIDEO END → SHOW REPLAY
// --------------------
video.addEventListener("ended", () => {
  hasEnded = true;

  replayBtn3D.setAttribute("visible", true);

  // Optional pop animation
  replayBtn3D.setAttribute("animation__scale", {
    property: "scale",
    from: "0 0 0",
    to: "1 1 1",
    dur: 200,
    easing: "easeOutBack"
  });
});

// --------------------
// REPLAY BUTTON CLICK (FIXED)
// --------------------
replayBtn3D.addEventListener("mousedown", (e) => {
  e.stopPropagation();

  console.log("Replay clicked");

  video.currentTime = 0;
  video.play();

  hasEnded = false;

  replayBtn3D.setAttribute("visible", false);
});
