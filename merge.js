const config = require('./config');
const mergeConfig = require('./merge.config');
const utils = require('./libs/utils');
const fs = require('fs');
const FluentFfmpeg = require('fluent-ffmpeg');

const { ffmpegDrivePath } = config;
const { mergeOptions } = mergeConfig;

const folderPath = mergeOptions.folderPath || `${process.env.USERPROFILE}/Downloads/ffmpeg-merge`;
const { fileList } = mergeOptions;

if (!fileList.length) {
  console.warn('no file list');

  process.exit();
}

const [fullFileName] = fileList;

const ffmpeg = FluentFfmpeg();

try {
  fileList.forEach((fullFileName) => {
    const fullFilePath = `${folderPath}/${fullFileName}`;
  
    if (!fs.existsSync(fullFilePath)) {

      throw new Error(fullFilePath);
    }

    ffmpeg.addInput(fullFilePath);
  });
} catch (errorFilePath) {
  console.warn(`not found file "${errorFilePath}"`);

  process.exit();
}

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

const { saveFolderPath } = mergeOptions;
const mergeFolder = saveFolderPath || `${folderPath}/merge`;

if (!fs.existsSync(mergeFolder)){
  fs.mkdirSync(mergeFolder, { recursive: true });
}

const mergeFullFilePath = `${mergeFolder}/${fullFileName}`;

ffmpeg.mergeToFile(mergeFullFilePath, mergeFolder);
