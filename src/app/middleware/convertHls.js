const { spawn } = require("child_process");
const { storage, bucketName } = require("../../config/google");

function convertBufferToHls(file, fileName) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(
      "ffmpeg",
      [
        "-i",
        "pipe:0",
        "-vf",
        "scale=640:-2",
        "-c:v",
        "h264",
        "-c:a",
        "aac",
        "-hls_time",
        "20",
        "-hls_list_size",
        "0",
        "-f",
        "hls",
        "pipe:1",
      ],
      { stdio: ["pipe", "pipe", "pipe"] }
    );

    const m3u8Destination = `videos/hls_video/${fileName}/output.m3u8`;
    const tsDestination = `videos/hls_video/${fileName}/output%03d.ts`;
    // Create a Write Stream for .m3u8 file
    const m3u8UploadStream = storage
      .bucket(bucketName)
      .file(m3u8Destination)
      .createWriteStream({
        resumable: true,
        metadata: {
          contentType: "application/vnd.apple.mpegurl", // Set the correct content type for M3U8
        },
      });

    // Create a new pipe for .ts files
    const tsUploadStream = ffmpeg.stdout.pipe(
      storage
        .bucket(bucketName)
        .file(tsDestination)
        .createWriteStream({
          resumable: true,
          metadata: {
            contentType: "video/MP2T", // Set the correct content type for TS segments
          },
        })
    );

    // Pipe FFmpeg output directly to Google Cloud Storage for .m3u8
    ffmpeg.stdout.pipe(m3u8UploadStream);

    m3u8UploadStream.on("error", (error) => {
      console.error("Error uploading .m3u8 to Google Cloud Storage:", error);
      reject(error);
    });

    m3u8UploadStream.on("finish", () => {
      console.log(".m3u8 Upload to Google Cloud Storage complete.");
    });

    // Handle errors and logs
    ffmpeg.stderr.on("data", (data) => {
      console.log("ffmpeg stderr data", data.toString());
    });
    ffmpeg.stdout.on("data", (data) => {
      console.log("ffmpeg stdout data", data.toString());
    });
    ffmpeg.stdout.on("end", () => {
      console.log("ffmpeg stdout ended");
      // Xử lý việc kết thúc dữ liệu đầu ra của FFmpeg ở đây
    });

    ffmpeg.stdin.write(file.buffer);
    ffmpeg.stdin.end();
  });
}

module.exports = convertBufferToHls;
