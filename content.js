function saveVideo() {
  const time = document.querySelector(".ytp-time-current").innerText;

  var timeToInt = 0;
  
  const timeParts = time.split(':');

  timeParts.forEach((time, index) => {
    timeToInt += (time) * 60**(timeParts.length - index - 1);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('v');
  
  chrome.storage.sync.get("videos", function(elements) {
    var videos = elements.videos;

    videos.push({
      title: document.querySelector(".title > .ytd-video-primary-info-renderer").innerText,
      channel: {
        name: document.querySelector("#meta .ytd-channel-name a").innerText,
        url: $('.ytd-channel-name a').prop("href")
      },
      url: 'https://youtu.be/' + videoId + '?t=' + timeToInt,
      timeWatched: time,
      duration: document.querySelector(".ytp-time-duration").innerText
    });

    chrome.storage.sync.set({ "videos":  videos }, function() {
      chrome.runtime.sendMessage({ "message": "reload_videos" });
    });
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "save_video") saveVideo();
  }
);