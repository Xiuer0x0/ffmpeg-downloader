const dayjs = require('dayjs');
const { timemarkToSeconds } = require('fluent-ffmpeg/lib/utils');

module.exports = {
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
};