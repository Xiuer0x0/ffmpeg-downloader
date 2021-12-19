const utils = require('./libs/utils');
const FluentFfmpeg = require('fluent-ffmpeg');
// ffmpeg.exe path
const ffmpegDrivePath = 'C:/FreeSoftware/ffmpeg-N-104348-gbb10f8d802-win64-gpl/bin/ffmpeg';

const folder = `${process.env.USERPROFILE}/Downloads/ffmpeg-download`;
const fileList = [
  'File.mp4',
  'File_2.mp4',
];
const fullFileName = fileList[0];

const ffmpeg = FluentFfmpeg();

fileList.forEach((fullFileName) => {
  const fullFilePath = `${folder}/${fullFileName}`;

  ffmpeg.addInput(fullFilePath);
});

ffmpeg
  .setFfmpegPath(ffmpegDrivePath)
  .on('progress', function(progress) {
    const nowDate = utils.getNowDate();
    const { percent } = progress;

    const progressPercentString = (percent) ? ` ${percent.toFixed(3)}% ` : '';

    if (percent) {
      utils.updateWindowTitle(process, fullFileName, `Merging ${progressPercentString}`);
    }

    console.log(`${nowDate} - Merging "${fullFileName}"${progressPercentString}`);
  })
  .on('end', function() {
    const nowDate = utils.getNowDate();

    utils.updateWindowTitle(process, fullFileName, `done!`);

    console.log(`${nowDate} - Merging done!`);

    utils.pressAnyKeyToExit(process);
  })
  .on('error', function(err) {
    const nowDate = utils.getNowDate();

    utils.updateWindowTitle(process, fullFileName, 'on error');

    console.log(`${nowDate} - Error:`, err.message);

    utils.pressAnyKeyToExit(process);
  });

const mergeFileName = `merge-${fileList[0]}`;
const mergeFolder = `${folder}/merge`;

const fs = require('fs');

if (!fs.existsSync(mergeFolder)){
  fs.mkdirSync(mergeFolder, { recursive: true });
}

ffmpeg.output(`${mergeFolder}/${fullFileName}`);
ffmpeg.mergeToFile(mergeFileName, mergeFolder);
