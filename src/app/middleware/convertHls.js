var FfmpegCommand = require("fluent-ffmpeg");

const { storage, bucketName } = require("../../config/google");

async function convertBufferToHls(file, fileName) {
  try {
    const resolutions = [
      {
        resolution: "320x180",
        videoBitrate: "500k",
        audioBitrate: "64k",
      },
      {
        resolution: "854x480",
        videoBitrate: "1000k",
        audioBitrate: "128k",
      },
      {
        resolution: "1280x720",
        videoBitrate: "2500k",
        audioBitrate: "192k",
      },
    ];

    for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
      console.log(`Hls ${resolution} started`);
      let mp4FileName = file.originalname.split(".")[0];
      const outputFileName = `${mp4FileName.replace(
        ".",
        "_"
      )}_${resolution}.m3u8`;
      const segmentFileName = `${mp4FileName.replace(
        ".",
        "_"
      )}_${resolution}_%03d.ts`;
      console.log(file.buffer);
      await new Promise((resolve, reject) => {
        FfmpegCommand()
          .outputOptions([
            `-c:v h264`,
            `-b:v ${videoBitrate}`,
            `-c:a aac`,
            `-b:a ${audioBitrate}`,
            `-vf scale=${resolution}`,
            `-f hls`,
            `-hls_time 10`,
            `-hls_list_size 0`,
            `-hls_segment_filename ./hls/${segmentFileName}`,
          ])
          .output(`./hls/${outputFileName}`)
          .on("end", () => {
            console.log(`Hls ${resolution} finished`);
            resolve();
          })
          .on("error", (error) => {
            console.log(`Hls ${resolution} error`);
            reject(error);
          })
          .run();
      });
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = convertBufferToHls;
