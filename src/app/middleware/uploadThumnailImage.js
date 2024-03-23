const { storage, bucketName } = require("../../config/google");

async function uploadThumnailImage(file, fileName) {
  return new Promise(async (resolve, reject) => {
    try {
      const blob = storage.bucket(bucketName).upload(file, {
        destination: `videos/thumbnail/${fileName}.png`,
        gzip: true,
        metadata: {
          cacheControl: "public, max-age=31536000",
        },
      });

      const thumbnailUrl = storage
        .bucket(bucketName)
        .file(`videos/thumbnail/${fileName}.png`)
        .getSignedUrl({
          action: "read",
          expires: "12-31-2025",
        });
      console.log(`Uploaded ${file} to videos/thumbnail/${fileName}.png`);

      resolve(thumbnailUrl);
    } catch (error) {
      reject(new Error(error));
    }
  });
}

module.exports = uploadThumnailImage;
