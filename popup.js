function toggleEmptyMessage() {
  if($('.videos').is(':empty')) {
    $('.empty').show();
    return;
  }
  
  $('.empty').hide();
}

function removeVideo(index) {
  chrome.storage.sync.get("videos", function(elements) {
    var videos = elements.videos;

    videos.splice(index, 1);

    chrome.storage.sync.set({ "videos":  videos }, function() {
      loadVideos();
    });
  });
}

function loadVideos() {
  $('.videos').empty();

  chrome.storage.sync.get({ videos: [] }, function(elements) {
    if (elements.videos.length) $('.videos').append('<h2>Continue watching...</h2>');
    
    elements.videos.forEach((video, index) => {
      const card = `
        <div class="video-card" index="` + index + `">`
        + `<div class="video-info">`
          + `<a class="video-channel-name" href="` + video.channel.url + `" target="_blank">` + video.channel.name + `</a>`
          + `<a class="video-title" href="` + video.url + `" target="_blank">` + video.title + `</a>`
          + `<span class="video-time">` + video.timeWatched + ` / ` + video.duration + `</span>`
        + `</div>`
          + `<div class="video-actions">`
          +   `<img src="images/remove.svg" class="remove" width="24" />`
          + `</div>`
        + `</div>`;
        
      $('.videos').append(card);
    });

    toggleEmptyMessage();
  });
}

window.addEventListener("DOMContentLoaded", function() {
  loadVideos();
  
  $(document).on('click', '.remove', function(e) {
    removeVideo($(e.target).closest('.video-card').attr('index'));
  });
  
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var activeTab = tabs[0];

    if (activeTab.url.includes('watch') && activeTab.url.includes('v=')) {
      $('#save').toggle();
    }

    $('#save').on('click', function() {
      chrome.tabs.sendMessage(activeTab.id, { "message": "save_video" });
    });
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "reload_videos") loadVideos();
  }
);