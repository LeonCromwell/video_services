const kue = require("kue");
const queue = kue.createQueue();

const downloadVideo = require("../../app/middleware/downloadVideo");
const ensureDirectoryExists = require("../ensureDirectoryExists");
const convertBufferToHls = require("../../app/middleware/convertHls");
const uploadFolder = require("../../app/middleware/uploadFolder");

function processJobVideo() {
  queue.process("video", 1, async (job, done) => {
    console.log("Processing job with data", job.data);
    ensureDirectoryExists("./src/temp/original_video/");
    const videoName = job.data.name;
    const local_video_path = "src/temp/original_video/";
    await downloadVideo(videoName, local_video_path);
    console.log("Video downloaded to", local_video_path);
    await convertBufferToHls(videoName);
    await uploadFolder(`./src/temp/hls_video/${videoName}`);
    done();
    job.remove((err) => {
      if (err) throw err;
      console.log(`Job ${job.id} removed from the queue.`);
    });
  });
}

module.exports = processJobVideo;
