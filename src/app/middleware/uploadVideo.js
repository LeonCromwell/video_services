const { storage, bucketName } = require("../../config/google");

async function uploadVideo(file, fileName) {
  return new Promise((resolve, reject) => {
    try {
      const blob = storage
        .bucket(bucketName)
        .file("videos/original_video/" + fileName + ".mp4");

      const blobStream = blob.createWriteStream({
        resumable: true,
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

      blobStream.end(file.buffer, "binary");
    } catch (error) {
      reject(new Error(error));
    }
  });
}

module.exports = uploadVideo;
