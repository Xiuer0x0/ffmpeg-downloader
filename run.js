function getProcessArgs() {
  const pressProcessArgs = process.argv.map((value, index) => {
    if (index > 1) {
      const [key, str] = value.split('=');

      return [key, str];
    }
  });

  const filterProcessArgs = pressProcessArgs.filter((value) => {
    if (value) {
      return true;
    }
  });

  const processData = Object.fromEntries(filterProcessArgs);

  return processData;
}

// test file
// const m3u8 = 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8';
// const fullFileName = `Test-${new Date().valueOf()}.mp4`;

const { m3u8, fullFileName } = getProcessArgs();

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

function updateWindowTitle(label = '') {
  const windowTitle = `ffmpeg-downloader - "${fullFileName}" ${label}`;

  process.title = windowTitle;
}

updateWindowTitle();

function pressAnyKeyToExit() {
  console.log('\nPress any key to exit!');

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', process.exit.bind(process, 0));
}

const Ffmpeg = require('fluent-ffmpeg');
// ffmpeg.exe path
const ffmpegDrivePath = 'C:/FreeSoftware/ffmpeg-N-104348-gbb10f8d802-win64-gpl/bin/ffmpeg';

const ffmpeg = Ffmpeg(m3u8)
  .setFfmpegPath(ffmpegDrivePath)
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
    updateWindowTitle('downloading');

    console.log(`Spawned Ffmpeg with command: ${commandLine}`);
  })
  .on('progress', function (progress) {
    const nowDate = getNowDate();
    const { percent, timemark } = progress;

    const progressPercentString = (percent) ? ` ${percent.toFixed(3)}% ` : '';
    const timemarkString = (timemark) ? `, time: ${timemark}` : '';

    if (percent) {
      updateWindowTitle(`downloading ${progressPercentString}`);
    }

    console.log(`${nowDate} - Download "${fullFileName}"${progressPercentString}${timemarkString}`);
  })
  .on('end', function () {
    const nowDate = getNowDate();

    updateWindowTitle(`done!`);

    console.log(`${nowDate} - Download done!`);

    pressAnyKeyToExit();
  })
  .on('error', function (err) {
    const nowDate = getNowDate();

    updateWindowTitle('on error');

    console.log(`${nowDate} - Error:`, err);

    pressAnyKeyToExit();
  });

ffmpeg.run();
