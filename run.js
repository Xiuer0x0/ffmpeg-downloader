const m3u8 = 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8';
const fullFileName = `Test-${new Date().valueOf()}`;

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

const Ffmpeg = require('fluent-ffmpeg');
const ffmpegDrivePath = 'C:/FreeSoftware/ffmpeg-N-104348-gbb10f8d802-win64-gpl/bin/ffmpeg';

const ffmpeg = Ffmpeg(m3u8)
  .setFfmpegPath(ffmpegDrivePath)
  .inputOption('-headers', 'Origin: {origin}\r\nReferer: {referer}\r\n')
  .inputOption('-user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36')
  .outputOptions([
    '-protocol_whitelist concat,file,http,https,tcp,tls,crypto',
    '-c copy',
    '-bsf:a aac_adtstoasc',
  ])
  .output(`${savePathFolder}/${fullFileName}`)
  .on('start', function(commandLine) {
    console.log(`Spawned Ffmpeg with command: ${commandLine}`);
  })
  .on('progress', function (progress) {
    const nowDate = getNowDate();
    const { percent, timemark } = progress;

    const progressPercentString = (percent) ? `, progressing: ${percent.toFixed(3)}% ` : '';
    const timemarkString = (timemark) ? `, time: ${timemark}` : '';

    console.log(`${nowDate} - Download "${fullFileName}"${progressPercentString}${timemarkString}`);
  })
  .on('end', function () {
    const nowDate = getNowDate();
    console.log(`${nowDate} - Download done!`);
  })
  .on('error', function (err) {
    const nowDate = getNowDate();
    console.log(`${nowDate} - Error:`, err);
  });

ffmpeg.run();
