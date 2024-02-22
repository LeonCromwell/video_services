var FfmpegCommand = require("fluent-ffmpeg");

const ensureDirectoryExists = require("../../utils/ensureDirectoryExists");

async function convertBufferToHls(fileName) {
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
      const outputFileName = `${fileName}_${resolution}.m3u8`;
      const segmentFileName = `${fileName}_${resolution}_%03d.ts`;
      await ensureDirectoryExists(`./src/temp/hls_video/${fileName}`);

      await new Promise((resolve, reject) => {
        FfmpegCommand("./src/temp/original_video/" + fileName + ".mp4")
          .outputOptions([
            `-c:v h264`,
            `-b:v ${videoBitrate}`,
            `-c:a aac`,
            `-b:a ${audioBitrate}`,
            `-vf scale=${resolution}`,
            `-f hls`,
            `-hls_time 10`,
            `-hls_list_size 0`,
            `-hls_segment_filename ./src/temp/hls_video/${fileName}/${segmentFileName}`,
          ])
          .output(`./src/temp/hls_video/${fileName}/${outputFileName}`)
          .on("end", async () => {
            console.log(`Hls ${resolution} finished`);
            // await uploadFolder("./src/temp/" + fileName);
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
