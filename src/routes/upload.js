const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();

const UploadController = require("../app/controllers/UploadController");

router.post("/", upload.single("video"), UploadController.save);

module.exports = router;
