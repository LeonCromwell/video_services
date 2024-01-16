const express = require("express");
const multer = require("multer");
const router = express.Router();

const multeStorage = multer.memoryStorage();
const upload = multer({ storage: multeStorage });

const UploadController = require("../app/controllers/UploadController");

router.post("/", upload.single("video"), UploadController.save);

module.exports = router;
