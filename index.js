const express = require("express");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const galleryRouter = require("./src/router/galleryRouter");
const userRouter = require("./src/router/userRouter");

const app = express();

const PORT = process.env.PORT || 4002;

// cloudinary
console.log(
  process.env.CLOUD_NAME,
  process.env.CLOUD_API_KEY,
  process.env.CLOUD_API_SECRET
);
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// middlewear
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));

app.use("/gallery", galleryRouter);
app.use("/user", userRouter);

const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server responded at ${PORT} port...`);
    });
  })
  .catch((err) => console.log(err));
