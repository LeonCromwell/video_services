const DeleteFile = (path) => {
  const fs = require("fs");

  try {
    fs.unlinkSync(path);
    console.log(`File ${path} deleted.`);
  } catch (error) {
    console.error(`Error deleting file: ${error}`);
  }
};

module.exports = DeleteFile;
