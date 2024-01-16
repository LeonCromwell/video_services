const uploadVideo = require("../middleware/upload");

class UploadController {
  // [post] /upload
  async save(req, res) {
    try {
      const file = req.file;
      const publicUrl = await uploadVideo(file);
      return res
        .status(200)
        .json({ message: "Upload success", url: publicUrl });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new UploadController();