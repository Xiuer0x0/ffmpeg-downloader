const download = require('node-hls-downloader').download;

class Timer {
  padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  start() {
    this.startTime = new Date();
  }

  end() {
    this.endTime = new Date();
  }

  diff() {
    const diffTime = this.endTime - this.startTime;
    const date = new Date('1/1/22');

    date.setMilliseconds(diffTime);

    const [hour, minutes, seconds] = [
      this.padTo2Digits(date.getHours()),
      this.padTo2Digits(date.getMinutes()),
      this.padTo2Digits(date.getSeconds()),
    ];

    const dateTimeString = `${hour}:${minutes}:${seconds}`;

    return dateTimeString;
  }
}

(async function run() {
  const timer = new Timer();

  timer.start();

  const downloadFolder = `${process.env.USERPROFILE}/Downloads/hls-downloader`;
  const tempPath = `${downloadFolder}/temp/${timer.startTime.valueOf()}`;

  await download({
    quality: 'best',
    concurrency: 10,
    outputFile: `${downloadFolder}/SSIS-445c.mp4`,
    streamUrl: 'https://yes-keep.mushroomtrack.com/hls/0E9LGzHOatiSMdkiG-cK9g/1666623428/25000/25030/25030.m3u8',
    httpHeaders: {
      'Origin': 'https://jable.tv',
      'Referer': 'https://jable.tv',
    },
    mergedSegmentsFile: `${tempPath}/index.ts`,
    segmentsDir: `${tempPath}/`,
  });

  timer.end();

  const diffTime = timer.diff();

  console.log('Run time:', diffTime);
}());
