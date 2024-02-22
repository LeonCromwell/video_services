const DeleteFile = (path) => {
  const fs = require("fs");

  try {
    fs.unlinkSync(path);
    console.log(`Deleted ${path}`);
  } catch (error) {
    console.error(`Error deleting file: ${error}`);
  }
};

module.exports = DeleteFile;
