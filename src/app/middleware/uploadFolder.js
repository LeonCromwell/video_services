const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const path = require("path");
const deleteFolderRecursive = require("../../utils/deleteFolderRecursive");

const storage = new Storage({
  projectId: "driven-airway-411306",
  keyFilename: "./driven-airway-411306-1cfba86e458c.json",
});

const bucketName = "hlsstreaming";

async function uploadFolder(folderPath) {
  const fileName = folderPath.split("/")[3];
  try {
    // Get a list of all files in the folder
    const files = fs.readdirSync(folderPath);

    // Upload each file to Google Cloud Storage
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const destination = path.join("videos/hls_video/" + fileName + "/", file); // Set the destination path in the bucket

      await storage.bucket(bucketName).upload(filePath, {
        destination: `videos/hls_video/${fileName}/${file}`,
        gzip: true,
        metadata: {
          cacheControl: "public, max-age=31536000",
        },
      });

      console.log(`Uploaded ${file} to videos/hls_video/${fileName}/${file}`);
    }

    // Delete temp folder
    await deleteFolderRecursive(folderPath);
    console.log("Upload complete.");
  } catch (error) {
    console.error("Error uploading folder:", error);
  }
}

module.exports = uploadFolder;
