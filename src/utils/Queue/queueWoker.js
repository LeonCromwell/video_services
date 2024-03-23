const kue = require("kue");
const queue = kue.createQueue();

const downloadVideo = require("../../app/middleware/downloadVideo");
const ensureDirectoryExists = require("../ensureDirectoryExists");
const convertBufferToHls = require("../../app/middleware/convertHls");
const createThumnailImage = require("../createThumnailImage");
const uploadThumnailImage = require("../../app/middleware/uploadThumnailImage");
const Video = require("../../app/models/video");
const DeleteFile = require("../deleteFile");

function processJobVideo() {
  queue.process("video", 1, async (job, done) => {
    console.log("Processing job with data", job.data);
    ensureDirectoryExists("./src/temp/original_video/");
    const videoName = job.data.name;
    const local_video_path = "src/temp/original_video/";
    await downloadVideo(videoName, local_video_path);
    console.log("Video downloaded to", local_video_path);
    await createThumnailImage(videoName);
    const thumbnailUrl = await uploadThumnailImage(
      `./src/temp/thumbnail/${videoName}.png`,
      videoName
    );
    console.log("Thumbnail uploaded to", thumbnailUrl);
    await Video.updateOne(
      { name: videoName },
      { $set: { thumbnail: thumbnailUrl[0] } },
      { upsert: true }
    );
    await DeleteFile(`./src/temp/thumbnail/${videoName}.png`);
    await convertBufferToHls(videoName);
    await DeleteFile(`./src/temp/original_video/${videoName}.mp4`);
    // await uploadFolder(`./src/temp/hls_video/${videoName}`);
    done();
    job.remove((err) => {
      if (err) throw err;
      console.log(`Job ${job.id} removed from the queue.`);
    });
  });
}

module.exports = processJobVideo;
