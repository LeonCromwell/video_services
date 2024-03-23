const express = require("express");
const multer = require("multer");
const router = express.Router();

const multeStorage = multer.memoryStorage();
const upload = multer({ storage: multeStorage });

const VideoController = require("../app/controllers/VideoController");

router.post("/upload", upload.single("video"), VideoController.save);
router.get("/search", VideoController.search);
router.get("/getvideo", VideoController.GetVideo);
router.get("/:id", VideoController.Detail);
router.get("/", VideoController.index);

module.exports = router;
