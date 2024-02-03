const { storage, bucketName } = require("../../config/google");
const fs = require("fs");

async function downloadVideo(videoName, localPath) {
  return new Promise((resolve, reject) => {
    try {
      const writeStream = fs.createWriteStream(localPath + videoName + ".mp4");
      const blob = storage
        .bucket(bucketName)
        .file(`videos/original_video/${videoName}.mp4`)
        .createReadStream()
        .pipe(writeStream);
      blob.on("finish", () => {
        resolve(localPath + videoName + ".mp4");
      });
      blob.on("error", (error) => {
        reject(new Error(error));
      });
    } catch (error) {
      reject(new Error(error));
    }
  });
}

module.exports = downloadVideo;
