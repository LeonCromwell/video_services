const fs = require("fs").promises;

async function ensureDirectoryExists(directory) {
  try {
    await fs.mkdir(directory, { recursive: true });
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
}

module.exports = ensureDirectoryExists;
