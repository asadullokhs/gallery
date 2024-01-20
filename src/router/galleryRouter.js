const express = require("express");
const router = express.Router();

const galleryCtrl = require("../controller/galleryController");

router.post("/", galleryCtrl.addPhoto);
router.get("/", galleryCtrl.getPhotos);
router.get("/search", galleryCtrl.searchPhoto);
router.delete("/:id", galleryCtrl.deletePhoto);
router.put("/:id", galleryCtrl.updatePhoto);

module.exports = router;
