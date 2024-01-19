const uploadVideo = require("../middleware/uploadVideo");
const uploadFolder = require("../middleware/uploadFolder");
const convertBufferToHls = require("../middleware/convertHls");

class UploadController {
  // [post] /upload
  async save(req, res) {
    try {
      const file = req.file;
      const fileUpload = await convertBufferToHls(file);
      await uploadFolder("./src/temp/" + fileUpload);
      const publicUrl = await uploadVideo(file);
      return res.status(200).json({
        message: "Upload success",
        original_video: publicUrl,
        file: fileUpload,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new UploadController();
