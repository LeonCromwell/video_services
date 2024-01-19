const { spawn } = require("child_process");
const ensureDirectoryExists = require("../../utils/ensureDirectoryExists");

function convertBufferToHls(file) {
  const fileName = file.originalname.split(".")[0];

  ensureDirectoryExists("./src/temp/" + fileName);
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      "pipe:0",
      "-c:v",
      "h264",
      "-c:a",
      "aac",
      "-hls_time",
      "10",
      "-hls_list_size",
      "0",
      "-f",
      "hls",
      "-hls_segment_filename",
      "./src/temp/" + fileName + "/output%03d.ts",
      "./src/temp/" + fileName + "/" + fileName + ".m3u8",
    ]);

    ffmpeg.stdin.write(file.buffer);
    ffmpeg.stdin.end();

    ffmpeg.on("error", (error) => {
      reject(error);
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        console.log("Chuyển đổi thành công.");
        resolve(fileName + ".m3u8");
      } else {
        reject(code);
      }
    });
  });
}

module.exports = convertBufferToHls;
