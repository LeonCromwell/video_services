const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: "driven-airway-411306",
  keyFilename: "./driven-airway-411306-1cfba86e458c.json",
});

const bucketName = "hlsstreaming";

async function uploadVideo(file) {
  return new Promise((resolve, reject) => {
    try {
      const blob = storage
        .bucket(bucketName)
        .file("videos/" + file.originalname);

      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream.on("finish", async () => {
        try {
          console.log("Video uploaded to Google Cloud Storage.");
          const [publicUrl] = await blob.getSignedUrl({
            action: "read",
            expires: "12-31-2025",
          });
          resolve(publicUrl);
        } catch (error) {
          reject(new Error(error));
        }
      });

      blobStream.on("error", (error) => {
        reject(new Error(error));
      });

      blobStream.end(file.buffer);
    } catch (error) {
      reject(new Error(error));
    }
  });
}

module.exports = uploadVideo;
