document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const videoPlane = document.getElementById("videoPlane");
  const scanText = document.getElementById("scanText");
  const audioIcon = document.getElementById("audioIcon");

  const target = document.querySelector("[mindar-image-target]");

  // STATE
  let audioUnlocked = false;
  let hasEnded = false;
  let iconTimeout = null;

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  // -------- UI HELPERS --------

  const showIcon = () => {
    audioIcon.style.opacity = 1;
  };

  const hideIcon = () => {
    audioIcon.style.opacity = 0;
  };

  const updateIcon = () => {
    audioIcon.src = video.muted
      ? "assets/icons/unmute.png"
      : "assets/icons/mute.png";
  };

  // -------- VIDEO FADE --------

  const fadeInVideo = () => {
    let opacity = 0;
    const interval = setInterval(() => {
      opacity += 0.08;
      videoPlane.setAttribute("material", "opacity", opacity);
      if (opacity >= 1) clearInterval(interval);
    }, 30);
  };

  // -------- TARGET EVENTS --------

  target.addEventListener("targetFound", () => {
    scanText.innerText = "Ready";

    setTimeout(() => {
      scanText.classList.add("hidden");
    }, 2500);

    if (navigator.vibrate) navigator.vibrate(50);

    if (!hasEnded) {
      video.play().catch(() => {});
    } else {
      video.currentTime = 0;
      video.play();
      hasEnded = false;
    }

    fadeInVideo();

    if (video.muted) {
      showIcon();
      updateIcon();
    }
  });

  target.addEventListener("targetLost", () => {
    video.pause();
  });

  // -------- VIDEO EVENTS --------

  video.addEventListener("ended", () => {
    hasEnded = true;
  });

  // -------- AUDIO UNLOCK --------

  const unlockAudio = () => {
    if (audioUnlocked) return;

    video.muted = false;

    video.play().then(() => {
      audioUnlocked = true;
      updateIcon();

      clearTimeout(iconTimeout);
      iconTimeout = setTimeout(hideIcon, 3000);
    }).catch(() => {
      video.muted = true;
      showIcon();
      updateIcon();
    });
  };

  if (isAndroid) {
    window.addEventListener("mousedown", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });
  }

  // -------- ICON INTERACTION --------

  audioIcon.addEventListener("mousedown", () => {
    video.muted = !video.muted;

    updateIcon();

    if (!video.muted) {
      audioUnlocked = true;

      clearTimeout(iconTimeout);
      iconTimeout = setTimeout(hideIcon, 3000);
    }
  });

  // -------- INITIAL STATE --------

  video.muted = true;
  updateIcon();
});
