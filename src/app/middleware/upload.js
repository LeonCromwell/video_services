const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: "driven-airway-411306",
  keyFilename: "./driven-airway-411306-1cfba86e458c.json",
});

const bucketName = "hlsstreaming";

async function uploadVideo(file) {
  try {
    const blob = storage.bucket(bucketName).file("videos/" + file.originalname);

    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream.on("finish", () => {
      console.log("Video uploaded to Google Cloud Storage.");
    });

    blobStream.end(file.buffer);

    res.send("Video uploaded to Google Cloud Storage.");
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = uploadVideo;
