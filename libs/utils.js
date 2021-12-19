const dayjs = require('dayjs');
const { timemarkToSeconds } = require('fluent-ffmpeg/lib/utils');

module.exports = {
  /**
   * @param {NodeJS.Process} process
   */
  pressAnyKeyToExit(process) {
    console.log('\nPress any key to exit!');

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
  },
  /**
   * @param {NodeJS.Process} process
   * @param {string} fullFileName
   * @param {string} title
   */
  updateWindowTitle(process, fullFileName, label = '') {
    const windowTitle = `ffmpeg-downloader - "${fullFileName}" ${label}`;

    process.title = windowTitle;
  },
  /**
   * @param {NodeJS.Process} process
   * @returns 
   */
  getProcessArgs(process) {
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
  },
  getTimeSecond(startTimeString = '00:00:00') {
    const baseDateString = '2000-01-01';
    const baseDate = dayjs(baseDateString).valueOf();
    const time = dayjs(`${baseDateString} ${startTimeString}`);
  
    const diffTime = time.diff(baseDate, 'second');
  
    return diffTime;
  },
  getTimeMark(timeMarkString, baseTimeSecond = 0) {
    const timeMarkSecond = timemarkToSeconds(timeMarkString);
    const realTimeMarkSecond = timeMarkSecond + baseTimeSecond;
    const baseDate = dayjs().startOf('day');
    const realTimeMark = baseDate.add(realTimeMarkSecond, 'second');
    const realTimeMarkString = realTimeMark.format('HH:mm:ss');

    return realTimeMarkString;
  },
  getNowDate() {
    const date = dayjs().format('YYYY-MM-DD HH:mm:ss');

    return date;
  },
};