document.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector("#video");
  const statusText = document.querySelector("#statusText");
  const audioControl = document.querySelector("#audioControl");
  const audioIcon = document.querySelector("#audioIcon");
  const target = document.querySelector("[mindar-image-target]");

  let hasPlayed = false;
  let hideTimeout = null;

  // -------------------------
  // TARGET FOUND
  // -------------------------
  target.addEventListener("targetFound", () => {
    statusText.innerText = "Ready";

    // Vibrate
    if (navigator.vibrate) navigator.vibrate(200);

    // Fade out text
    setTimeout(() => {
      statusText.style.opacity = 0;
    }, 500);

    // Show audio button
    audioControl.style.display = "block";

    // Resume or play
    if (!hasPlayed) {
      video.currentTime = 0;
      video.play();
      hasPlayed = true;
    } else {
      video.play();
    }
  });

  // -------------------------
  // TARGET LOST
  // -------------------------
  target.addEventListener("targetLost", () => {
    video.pause();
  });

  // -------------------------
  // AUDIO CONTROL
  // -------------------------
  audioControl.addEventListener("click", () => {
    video.muted = !video.muted;

    audioIcon.src = video.muted
      ? "assets/icons/mute.png"
      : "assets/icons/unmute.png";

    // Auto hide after 3s
    if (hideTimeout) clearTimeout(hideTimeout);

    hideTimeout = setTimeout(() => {
      audioControl.style.display = "none";
    }, 3000);
  });

  // -------------------------
  // VIDEO END → REPLAY
  // -------------------------
  video.addEventListener("ended", () => {
    video.currentTime = 0;
    video.play();
  });
});
