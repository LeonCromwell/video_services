const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: "driven-airway-411306",
  keyFilename: "./driven-airway-411306-1cfba86e458c.json",
});

const bucketName = "hlsstreaming";

async function uploadVideo(file) {
  try {
    const uploadPath = "videos/" + file.originalname;
    const filestream = storage
      .bucket(bucketName)
      .file(uploadPath)
      .createWriteStream();

    filestream.on("error", (err) => {
      throw new Error(err);
    });

    filestream.on("finish", () => {
      logger.info(`Upload ${file.originalname} success`);
    });

    filestream.end(file.buffer);
    return;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = uploadVideo;
