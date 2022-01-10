const config = require('./config');
const utils = require('./libs/utils');

const { downloadOptions } = config;
const { m3u8URL, startTime: startTimeString, } = downloadOptions;

const saveFileName = downloadOptions.saveFileName || `m3u8-downloader-${new Date().valueOf()}`;
const saveFolderPath = downloadOptions.saveFolderPath || `${process.env.USERPROFILE}/Downloads/ffmpeg-download`;

if (!m3u8URL) {
  console.log('need "m3u8" URL source');

  process.exit();
}

const fs = require('fs');

if (!fs.existsSync(saveFolderPath)){
  fs.mkdirSync(saveFolderPath, { recursive: true });
}

utils.updateWindowTitle(process, saveFileName);

const FluentFfmpeg = require('fluent-ffmpeg');
const { ffmpegDrivePath } = config;
const startTimeSecond = utils.getTimeSecond(startTimeString);

const ffmpeg = FluentFfmpeg(m3u8URL)
  .setFfmpegPath(ffmpegDrivePath)
  .setStartTime(startTimeSecond)
  .outputOptions([
    '-protocol_whitelist concat,file,http,https,tcp,tls,crypto',
    '-c copy',
    '-bsf:a aac_adtstoasc',
  ])
  .output(`${saveFolderPath}/${saveFileName}`)
  .on('start', function(commandLine) {
    utils.updateWindowTitle(process, saveFileName, 'downloading');

    console.log(`Spawned Ffmpeg with command: ${commandLine}`);
  })
  .on('progress', function (progress) {
    const nowDate = utils.getNowDate();
    const { percent, timemark } = progress;

    const progressPercentString = (percent) ? ` ${percent.toFixed(3)}% ` : '';
    const timeMarkString = utils.getTimeMark(timemark, startTimeSecond);
    const timeMarkMessage = `, time: ${timeMarkString}`;

    if (percent) {
      utils.updateWindowTitle(process, saveFileName, `downloading ${progressPercentString}`);
    }

    console.log(`${nowDate} - Download "${saveFileName}"${progressPercentString}${timeMarkMessage}`);
  })
  .on('end', function () {
    const nowDate = utils.getNowDate();

    utils.updateWindowTitle(process, saveFileName, `done!`);

    console.log(`${nowDate} - Download done!`);

    utils.pressAnyKeyToExit(process);
  })
  .on('error', function (err) {
    const nowDate = utils.getNowDate();

    utils.updateWindowTitle(process, saveFileName, 'on error');

    console.log(`${nowDate} - Error:`, err);

    utils.pressAnyKeyToExit(process);
  });

const { httpOptions } = config;

if (httpOptions.headers) {
  ffmpeg.inputOption('-headers', httpOptions.headers);
}

if (httpOptions.userAgent) {
  ffmpeg.inputOption('-user_agent', httpOptions.userAgent);
}

ffmpeg.run();
