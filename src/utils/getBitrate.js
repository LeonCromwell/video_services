const { spawn } = require("child_process");

function getBitrateFromBuffer(fileBuffer) {
  return new Promise((resolve, reject) => {
    // Sử dụng spawn thay vì exec để có thể truyền dữ liệu từ buffer
    const ffprobe = spawn("ffprobe", [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=bit_rate",
      "-of",
      "default=nw=1:nk=1",
      "-i",
      "pipe:0", // Sử dụng 'pipe:0' để chấp nhận đầu vào từ pipe
    ]);

    // Gửi dữ liệu từ buffer vào ffprobe
    ffprobe.stdin.write(fileBuffer);
    ffprobe.stdin.end();

    let stdout = "";
    let stderr = "";

    ffprobe.stdout.on("data", (data) => {
      stdout += data;
    });

    ffprobe.stderr.on("data", (data) => {
      stderr += data;
    });

    ffprobe.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `FFprobe process exited with code ${code}, stderr: ${stderr}`
          )
        );
      } else {
        resolve(Number(stdout.trim()));
      }
    });
  });
}

module.exports = getBitrateFromBuffer;
