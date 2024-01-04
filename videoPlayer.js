function onPlayerReady(event) {
  event.target.playVideo();
}
window.addEventListener("load", () => {
  // here we have to render my video logic
  let videoId = "FCQn1UVmfoo";
  if (YT) {
    new YT.Player("video-player", {
      height: "300",
      width: "500",
      videoId,
      events: {
        onReady: onPlayerReady,
      },
    });
  }
});
