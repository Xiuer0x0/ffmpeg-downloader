title FFMPEG downloader

set fullFileName=Test-123.mp4
set m3u8=https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8

node run.js fullFileName=%fullFileName% m3u8=%m3u8%
