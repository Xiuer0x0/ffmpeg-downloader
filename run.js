const utils = require('./libs/utils');

// test file
// const m3u8 = 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8';
// const fullFileName = `Test-${new Date().valueOf()}.mp4`;

const { m3u8, fullFileName, startTime: startTimeString } = utils.getProcessArgs();

if (!m3u8) {
  console.log('need "m3u8" URL source');

  process.exit();
}

if (!fullFileName) {
  console.log('need "fullFileName"');

  process.exit();
}

const savePathFolder = `${process.env.USERPROFILE}/Downloads/ffmpeg-download`;

const dayjs = require('dayjs');

function getNowDate() {
  const date = dayjs().format('YYYY-MM-DD HH:mm:ss');

  return date;
}

const fs = require('fs');

if (!fs.existsSync(savePathFolder)){
  fs.mkdirSync(savePathFolder, { recursive: true });
}

utils.updateWindowTitle(process, fullFileName);

const FluentFfmpeg = require('fluent-ffmpeg');
// ffmpeg.exe path
const ffmpegDrivePath = 'C:/FreeSoftware/ffmpeg-N-104348-gbb10f8d802-win64-gpl/bin/ffmpeg';
const startTimeSecond = utils.getTimeSecond(startTimeString);

const ffmpeg = FluentFfmpeg(m3u8)
  .setFfmpegPath(ffmpegDrivePath)
  .setStartTime(startTimeSecond)
  // http headers settings
  // .inputOption('-headers', 'Origin: {origin}\r\nReferer: {referer}\r\n')
  // .inputOption('-user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36')
  .outputOptions([
    '-protocol_whitelist concat,file,http,https,tcp,tls,crypto',
    '-c copy',
    '-bsf:a aac_adtstoasc',
  ])
  .output(`${savePathFolder}/${fullFileName}`)
  .on('start', function(commandLine) {
    utils.updateWindowTitle(process, fullFileName, 'downloading');

    console.log(`Spawned Ffmpeg with command: ${commandLine}`);
  })
  .on('progress', function (progress) {
    const nowDate = getNowDate();
    const { percent, timemark } = progress;

    const progressPercentString = (percent) ? ` ${percent.toFixed(3)}% ` : '';
    const timeMarkString = utils.getTimeMark(timemark, startTimeSecond);
    const timeMarkMessage = `, time: ${timeMarkString}`;

    if (percent) {
      utils.updateWindowTitle(process, fullFileName, `downloading ${progressPercentString}`);
    }

    console.log(`${nowDate} - Download "${fullFileName}"${progressPercentString}${timeMarkMessage}`);
  })
  .on('end', function () {
    const nowDate = getNowDate();

    utils.updateWindowTitle(process, fullFileName, `done!`);

    console.log(`${nowDate} - Download done!`);

    utils.pressAnyKeyToExit(process);
  })
  .on('error', function (err) {
    const nowDate = getNowDate();

    utils.updateWindowTitle(process, fullFileName, 'on error');

    console.log(`${nowDate} - Error:`, err);

    utils.pressAnyKeyToExit(process);
  });

ffmpeg.run();
