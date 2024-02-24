function onPlayerReady(event) {
  event.target.playVideo();
}
function showReplies(commentId) {
  // Fetch and display replies when the "Show Replies" button is clicked
  console.log("show replies fucntion");
  fetchReplies(commentId);
}

const BASE_URL = "https://www.googleapis.com/youtube/v3";

const API_KEY = "AIzaSyDhhLy6XkdJf-3PC978OBGRTay--n8ttmQ";

const CONTENT_DEATILS = "contentDetails"; // give length of vide
const STATS = "statistics"; // give live , no of comment , views count of video

window.addEventListener("load", () => {
  const sideRec = document.querySelector(".sideRecom");

  // here we have to render my video logic

  // Retrieve the video ID from local storage
  let storedVideoId = localStorage.getItem("selectedVideoId");

  console.log("storeagevideoid = ", storedVideoId);
  
  if (YT) {
    new YT.Player("video-player", {
      height: "100%",
      width: "100%",
      videoId: storedVideoId,
      events: {
        onReady: onPlayerReady,
      },
    });
  }
  // Fetch video details when the player is ready
  fetchVideoDetails(storedVideoId);
  
  // Fetch comments for the video
  fetchComments(storedVideoId);
  

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

  fetchVideo("", 10);

  //
  async function fetchVideoDetails(videoId) {
    try {
      const response = await fetch(
        `${BASE_URL}/videos?key=${API_KEY}&part=snippet,statistics&id=${videoId}`
      );
      const data = await response.json();
      const videoDetails = data.items[0].snippet;
      const vd = data.items[0];

      // Update video details on the page
      document.querySelector(".video-title").textContent = videoDetails.title;
      document.querySelector(".like-count").textContent = vd.likeCount;
      document.querySelector(".share-count").textContent = vd.shareCount;
      document.querySelector(".video-description").textContent =
        videoDetails.description;
    } catch (err) {
      console.error("Error fetching video details:", err);
    }
  }

  async function fetchComments(videoId) {
    try {
      const response = await fetch(
        `${BASE_URL}/commentThreads?key=${API_KEY}&videoId=${videoId}&maxResults=10&part=snippet`
      );
      const data = await response.json();

      // Update the comments on the page
      console.log(data);
      renderComments(data.items);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  }

  function renderComments(comments) {
    const commentsList = document.querySelector(".comments-list");
    comments.forEach((comment) => {
      const commentItem = document.createElement("li");
      commentItem.innerHTML = `
        <div class="comment-details">
          <span class="comment-author">${comment.snippet.topLevelComment.snippet.authorDisplayName}</span>
          <p class="comment-text">${comment.snippet.topLevelComment.snippet.textDisplay}</p>
          <button class="show-replies-btn" data-comment-id="${comment.id}" onclick="showReplies('${comment.id}')">Show Replies</button>
        </div>
        <ul class="replies-list" id="replies-${comment.id}"></ul>
      `;
      commentsList.appendChild(commentItem);
    });
  }
});
async function fetchReplies(parentCommentId) {
  try {
    const response = await fetch(
      `${BASE_URL}/comments?key=${API_KEY}&parentId=${parentCommentId}&maxResults=5&part=snippet`
    );
    const data = await response.json();

    // Update and display the replies on the page
    console.log("fetch replies fucntion", data);

    renderReplies(parentCommentId, data.items);
  } catch (err) {
    console.error("Error fetching replies:", err);
  }
}
function renderReplies(parentCommentId, replies) {
  const repliesList = document.getElementById(`replies-${parentCommentId}`);
  replies.forEach((reply) => {
    const replyItem = document.createElement("li");
    replyItem.innerHTML = `
      <div class="reply-details">
        <span class="reply-author">${reply.snippet.authorDisplayName}</span>
        <p class="reply-text">${reply.snippet.textDisplay}</p>
      </div>
    `;
    console.log("render replies fucntion");

    console.log(replyItem);
    repliesList.appendChild(replyItem);
  });
}
