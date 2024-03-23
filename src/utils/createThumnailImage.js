const FfmpegCommand = require("fluent-ffmpeg");

const ensureDirectoryExists = require("./ensureDirectoryExists");

const createThumnailImage = async (fileName) => {
  try {
    await ensureDirectoryExists(`./src/temp/thumbnail/`);
    await new Promise((resolve, reject) => {
      FfmpegCommand("./src/temp/original_video/" + fileName + ".mp4")
        .screenshots({
          count: 1,
          folder: `./src/temp/thumbnail/`,
          filename: `${fileName}.png`,
          timestamps: ["0%"],
          //   size: "320x180",
        })
        .on("end", async () => {
          console.log(`Thumbnail created`);
          resolve();
        })
        .on("error", (error) => {
          console.log(`Thumbnail error`);
          reject(error);
        });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = createThumnailImage;
