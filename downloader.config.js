module.exports = {
  downloadOptions: {
    // test file
    m3u8URL: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
    saveFileName: 'Test-file.mp4',
    saveFolderPath: '',
    startTime: ''
  },
  httpOptions: {
    // headers: 'Origin: https://jable.tv\r\nReferer: https://jable.tv/\r\n',
    // userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36'
    headers: 'Origin: https://bitdash-a.akamaihd.net\r\nReferer: https://bitdash-a.akamaihd.net/\r\n',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
  },
};
