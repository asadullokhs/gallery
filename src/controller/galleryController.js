const Gallery = require("../models/galleryModel");
const cloudinary = require("cloudinary");
const fs = require("fs");

const removeTemp = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      throw err;
    }
  });
};

const galleryCtrl = {
  addPhoto: async (req, res) => {
    try {
      const { title } = req.body;
      const { photo } = req.files;

      const result = await cloudinary.v2.uploader.upload(
        photo.tempFilePath,
        {
          folder: "Albom",
        },
        async (err, result) => {
          if (err) {
            throw err;
          }

          removeTemp(photo.tempFilePath);

          return result;
        }
      );

      const image = { url: result.secure_url, public_id: result.public_id };

      const newPhoto = await Gallery.create({ title, image });

      res.status(201).send({ message: "Succesfully created", newPhoto });
    } catch (error) {
      res.status(503).send(error);
      console.log(error);
    }
  },
  getPhotos: async (req, res) => {
    try {
      const photos = await Gallery.find();

      res.status(200).send({ message: "All photos", photos });
    } catch (error) {
      res.status(503).send(error);
      console.log(error);
    }
  },
  deletePhoto: async (req, res) => {
    try {
      const { id } = req.params;

      const photo = await Gallery.findById(id);

      let public_id = photo.image.public_id;
      if (photo) {
        await cloudinary.v2.uploader.destroy(public_id, async (err) => {
          if (err) {
            throw err;
          }
        });

        await Gallery.findByIdAndDelete(id);
        res.status(200).send({ message: "Successfully ochirildi", photo });
      }

      res.status(200).send({ message: "All photos", photos });
    } catch (error) {
      res.status(503).send(error);
      console.log(error);
    }
  },
  updatePhoto: async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const { image } = req.files;

      const photo = await Gallery.findById(id);

      if (photo) {
        let public_id = photo.image.public_id;
        await cloudinary.v2.uploader.destroy(public_id, async (err) => {
          if (err) {
            throw err;
          }
        });

        const result = await cloudinary.v2.uploader.upload(
          image.tempFilePath,
          {
            folder: "Albom",
          },
          async (err, result) => {
            if (err) {
              throw err;
            }

            removeTemp(image.tempFilePath);

            return result;
          }
        );

        const rasm = { url: result.secure_url, public_id: result.public_id };

        const newPhoto = await Gallery.findByIdAndUpdate(
          id,
          { title, image: rasm },
          {
            new: true,
          }
        );

        res.status(200).send({ message: "Successfully updated", newPhoto });
      } else {
        res.status(404).send({ message: "Not found" });
      }
    } catch (error) {
      res.status(503).send(error);
      console.log(error);
    }
  },
  searchPhoto: async (req, res) => {
    const { title } = req.query;

    if (!title) {
      const photos = await Gallery.find();
      return res.status(200).send({ message: "All photos", photos });
    }

    const key = new RegExp(title, "i");

    const result = await Gallery.find({
      $or: [{ title: { $regex: key } }],
    });

    res.status(200).send({ message: "Found photos", result });
  },
};

module.exports = galleryCtrl;
