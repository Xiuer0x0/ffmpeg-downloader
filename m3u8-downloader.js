const TsFetcher = require('m3u8_to_mpegts');

TsFetcher({
  uri: 'https://masmao-toera.mushroomtrack.com/hls/CmStPfXSqdYi8hyvI4PZMw/1677345108/15000/15417/15417.m3u8',
    cwd: 'destinationDirectory',
    preferLowQuality: false,
  }, 
  function(...args){
    console.log('Download of chunk files complete', args);
    // convertTSFilesToMp4();
  }
);
