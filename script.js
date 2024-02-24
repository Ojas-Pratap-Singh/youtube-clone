const BASE_URL = "https://www.googleapis.com/youtube/v3";

const API_KEY = "AIzaSyAYqP3wBHXY0TDm7DZPHx-shCRc6RSrzpo";

const CONTENT_DEATILS = "contentDetails"; // give length of vide
const STATS = "statistics"; // give live , no of comment , views count of video
const videoImg = document.querySelector(".thumbnail");
const videoContainer = document.querySelector(".video-wrapper");
const inputQuery = document.querySelector("input");
const button = document.querySelector("button");
const toggle = document.getElementById("toggle");
const header = document.querySelector("header");
// const input = document.querySelector("input");
// const side = document.querySelector(".sidebar");
// const contentt = document.querySelector(".content");
//const tagLine = document.querySelector(".tag-line");

// header.style.backgroundColor="white"
// header.style.color="black"
// side.style.backgroundColor="white"
// side.style.color="black"

button.addEventListener("click", () => {
  let searchQuery = inputQuery.value;
  videoContainer.innerHTML = "";
  fetchVideo(searchQuery, 20);
});

async function fetchVideo(searchQuery, maxResults) {
  try {
    const response = await fetch(
      BASE_URL +
        "/search" +
        `?key=${API_KEY}` +
        "&part=snippet" +
        `&q=${searchQuery}` +
        `&maxResults=${maxResults}` +
        "&type=video" +
        "&chart=mostPopular" +
        "$videoEmbeddable=true"
    );
    // this will give response object
    // snippet give additional information about video like channel detail i.e its channelID , channel titile etc.

    const data = await response.json();

    renderVideo(data.items);
  } catch (err) {
    console.log(err);
  }
}

async function renderVideo(items) {
  items.forEach(async (video) => {
    let imgUrl = video.snippet.thumbnails.high.url;
    let videoTitle = video.snippet.title;
    let channelTitle = video.snippet.channelTitle;
    let channelId = video.snippet.channelId;
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
    //adding click event to all video card

    videoCard.addEventListener("click", () => {
      //retrieving video id from video item
      let videoId = video.id.videoId;
      console.log("video id= ", videoId);
      //storing vide id in localStroage
      localStorage.setItem("selectedVideoId", videoId);

      //redirecting to video player html page
      // window.location.href = "http://127.0.0.1:5500/videoPlayer.html";
      
      // Get the current domain (e.g., https://ojas-pratap-singh.github.io)
      var domain = window.location.origin;

      // Construct the URL for the video player HTML page
      var videoPlayerUrl = domain + "/youtube-clone/videoPlayer.html";

      // Redirecting to video player html page
      window.location.href = videoPlayerUrl;
    });

    videoContainer.append(videoCard);
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

async function getComments(videoIdId) {
  try {
    const response = await fetch(
      BASE_URL +
        "/commentThreads" +
        `?key=${API_KEY}` +
        `&videoId=${videoIdId}` +
        `&maxResults=25&part=snippet`
    );
    const data = await response.json(); // this will give data promise
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
// getComments("358ZZYTnlV4");

fetchVideo("", 30);
// fetchVideoStats("ng438SIXyW4",STATS);
// fetchChannelLogo("UCJrpiw6dS09Zx2Z8d9AFWDA");
//search query
//comment
//views in video card
