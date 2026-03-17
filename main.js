document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const videoPlane = document.getElementById("videoPlane");
  const scanText = document.getElementById("scanText");
  const audioIcon = document.getElementById("audioIcon");

  const sceneEl = document.querySelector("a-scene");
  const target = document.querySelector("[mindar-image-target]");

  // STATE
  let audioUnlocked = false;
  let hasEnded = false;
  let isTargetVisible = false;
  let iconTimeout = null;

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  // ----------- UI HELPERS -----------

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

  // ----------- VIDEO FADE -----------

  const fadeInVideo = () => {
    let opacity = 0;
    const interval = setInterval(() => {
      opacity += 0.08;
      videoPlane.setAttribute("material", "opacity", opacity);

      if (opacity >= 1) clearInterval(interval);
    }, 30);
  };

  // ----------- TARGET EVENTS -----------

  target.addEventListener("targetFound", () => {
    isTargetVisible = true;

    scanText.innerText = "Ready";

    setTimeout(() => {
      scanText.classList.add("hidden");
    }, 2500);

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(50);

    // Resume video (no restart)
    if (!hasEnded) {
      video.play().catch(() => {});
    } else {
      video.currentTime = 0;
      video.play();
      hasEnded = false;
    }

    fadeInVideo();

    // Show icon if muted
    if (video.muted) {
      showIcon();
      updateIcon();
    }
  });

  target.addEventListener("targetLost", () => {
    isTargetVisible = false;
    video.pause();
  });

  // ----------- VIDEO EVENTS -----------

  video.addEventListener("ended", () => {
    hasEnded = true;
  });

  // ----------- AUDIO UNLOCK -----------

  const unlockAudio = () => {
    if (audioUnlocked) return;

    video.muted = false;

    video.play().then(() => {
      audioUnlocked = true;
      updateIcon();

      clearTimeout(iconTimeout);
      iconTimeout = setTimeout(hideIcon, 3000);
    }).catch(() => {
      // fallback → keep muted
      video.muted = true;
      showIcon();
      updateIcon();
    });
  };

  // Android attempt on first interaction
  if (isAndroid) {
    window.addEventListener("mousedown", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });
  }

  // ----------- ICON CLICK -----------

  audioIcon.addEventListener("mousedown", () => {
    video.muted = !video.muted;

    updateIcon();

    if (!video.muted) {
      audioUnlocked = true;

      clearTimeout(iconTimeout);
      iconTimeout = setTimeout(hideIcon, 3000);
    }
  });

  // ----------- INITIAL STATE -----------

  video.muted = true;
  updateIcon();
});
