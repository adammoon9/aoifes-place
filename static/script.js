window.onSpotifyIframeApiReady = (IFrameAPI) => {
  //
};

window.onSpotifyIframeApiReady = (IFrameAPI) => {
  const element = document.getElementById('embed-iframe');
  const options = {
      uri: 'spotify:playlist:4voL8mGVBfAF0zDXH0vGqF'
    };
  const callback = (EmbedController) => {};
  IFrameAPI.createController(element, options, callback);
};