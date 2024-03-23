var FfmpegCommand = require("fluent-ffmpeg");

const ensureDirectoryExists = require("../../utils/ensureDirectoryExists");
const uploadFolder = require("./uploadFolder");
const Video = require("../models/video");

async function convertBufferToHls(fileName) {
  try {
    const resolutions = [
      {
        resolution: "250x144",
        videoBitrate: "300k",
        audioBitrate: "64k",
      },
      {
        resolution: "480x360",
        videoBitrate: "750k",
        audioBitrate: "96k",
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
      {
        resolution: "1920x1080",
        videoBitrate: "5000k",
        audioBitrate: "384k",
      },
    ];

    for (const { resolution, videoBitrate, audioBitrate } of resolutions) {
      console.log(`Hls ${resolution} started`);
      const outputFileName = `${fileName}_${resolution}.m3u8`;
      const segmentFileName = `${fileName}_${resolution}_%03d.ts`;
      await ensureDirectoryExists(`./src/temp/hls_video/${fileName}`);

      await new Promise((resolve, reject) => {
        FfmpegCommand("./src/temp/original_video/" + fileName + ".mp4")
          .inputOptions([`-hwaccel cuda`])
          .outputOptions([
            `-c:v h264`,
            `-b:v ${videoBitrate}`,
            `-c:a aac`,
            `-b:a ${audioBitrate}`,
            `-vf scale=${resolution}`,
            `-preset veryfast`,
            `-threads 4`,
            `-f hls`,
            `-hls_time 10`,
            `-hls_list_size 0`,
            `-hls_segment_filename ./src/temp/hls_video/${fileName}/${segmentFileName}`,
          ])
          .output(`./src/temp/hls_video/${fileName}/${outputFileName}`)
          .on("end", async () => {
            console.log(`Hls ${resolution} finished`);
            await uploadFolder("./src/temp/hls_video/" + fileName);

            await Video.updateOne(
              { name: fileName },
              { $push: { resolution: resolution } },
              { upsert: true }
            );
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
