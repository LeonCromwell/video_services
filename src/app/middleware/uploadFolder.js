const fs = require("fs");
const path = require("path");
const deleteFolderRecursive = require("../../utils/deleteFolderRecursive");
const DeleteFile = require("../../utils/deleteFile");
const { storage, bucketName } = require("../../config/google");

async function uploadFolder(folderPath) {
  const fileName = folderPath.split("/")[4];
  try {
    // Get a list of all files in the folder
    const files = fs.readdirSync(folderPath);

    // Upload each file to Google Cloud Storage
    for (const file of files) {
      const filePath = path.join(folderPath, file);

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
    // await DeleteFile(`./src/temp/original_video/${fileName}.mp4`);
    console.log("Upload complete.");
  } catch (error) {
    console.error("Error uploading folder:", error);
  }
}

module.exports = uploadFolder;
