function onPlayerReady(event) {
  event.target.playVideo();
}
const BASE_URL = "https://www.googleapis.com/youtube/v3";

const API_KEY = "AIzaSyDhhLy6XkdJf-3PC978OBGRTay--n8ttmQ";

const CONTENT_DEATILS = "contentDetails"; // give length of vide
const STATS = "statistics"; // give live , no of comment , views count of video

window.addEventListener("load", () => {
  const sideRec = document.querySelector(".sideRecom");
  // here we have to render my video logic

  // Retrieve the video ID from local storage
  const storedVideoId = localStorage.getItem("selectedVideoId");

  console.log("storeagevideoid = ", storedVideoId);
  // if (storedVideoId) {
    // Call your API with the retrieved video ID
    // let videoId = "FCQn1UVmfoo";
    if (YT) {
      new YT.Player("video-player", {
        height: "50%",
        width: "60%",
        videoId:storedVideoId,
        events: {
          onReady: onPlayerReady,
        },
      });
    }
    // fetchVideoDetails(storedVideoId);
  // } else {
  //   console.error("No video ID found in local storage");
  // }


  
  // if (YT) {
  //   new YT.Player("video-player", {
  //     height: "50%",
  //     width: "60%",
  //     storedVideoId,
  //     events: {
  //       onReady: onPlayerReady,
  //     },
  //   });
  // }

  async function fetchVideo(searchQuery, maxResults) {
    try {
      const response = await fetch(
        BASE_URL +
          "/search" +
          `?key=${API_KEY}` +
          "&part=snippet" +
          `&q=${searchQuery}` +
          `&maxResults=${maxResults}`
      ); // this will give response object
      // snippet give additional information about vide like channel detail i.e its channelID , channel titile etc.
      const data = await response.json();
      // console.log(data);
      renderVideo(data.items);
    } catch (err) {
      console.log(err);
    }
  }

  async function renderVideo(items) {
    items.forEach(async (video) => {
      let imgUrl = video.snippet.thumbnails.high.url;
      let videoTitle = video.snippet.title;
      // console.log(videoTitle);
      let channelTitle = video.snippet.channelTitle;
      let channelId = video.snippet.channelId;
      // console.log(channelId);
      let channelurl = await fetchChannelLogo(channelId);

        // console.log(channelurl);

      let videoCard = document.createElement("div");
      videoCard.className = "video";
      videoCard.innerHTML = `
    <div class="video-content">
    <img src="${imgUrl}" alt="tumbnail" class="thumbnail" />
  </div>
  <div class="video-details">
    <div class="channel-logo">
      <img src="${channelurl}" alt="" class="channel-icon" />
    </div>
    <div class="details">
      <h3 class="title">${videoTitle}</h3>
      <div class="channel-name">${channelTitle}</div>
    </div>
  </div>
    `;
      sideRec.append(videoCard);
    });
  }

  //api to get video statistics from videoID
  async function fetchVideoStats(videoId, TypeOFDetails) {
    try {
      const response = await fetch(
        BASE_URL +
          "/videos" +
          `?key=${API_KEY}` +
          `&part=${TypeOFDetails}` +
          `&id=${videoId}`
      );
      const data = await response.json(); // this will give data promise
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchChannelLogo(channelId) {
    try {
      const response = await fetch(
        BASE_URL +
          "/channels" +
          `?key=${API_KEY}` +
          `&part=snippet` +
          `&id=${channelId}`
      );
      const data = await response.json(); // this will give data promise
      // console.log(data);
      let ChannelLogourl = data.items[0].snippet.thumbnails.high.url;
      // console.log("channel url ==" , ChannelLogourl );
      return ChannelLogourl;
    } catch (err) {
      console.log(err);
    }
  }

  fetchVideo("",5);

});
