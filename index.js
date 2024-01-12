const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require('cors');
const mongoose = require("mongoose");
const Tracks = require("./models/Tracks");

const app = express();
const PORT = 3001;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = getUploadPath(file.fieldname);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const getUploadPath = (fieldname) => {
  switch (fieldname) {
    case 'cover':
      return 'public/covers';
    case 'song':
      return 'public/songs/';
    default:
      return 'public/others/';
  }
}

const upload = multer({ storage: storage });

const start = async () => {
  try {
    app.use(cors());
    app.use(express.json());
    app.use(express.static('public'));
    // const path = require('path');
    // app.use('/static', express.static(path.join(__dirname, 'public')))


    await mongoose.connect("mongodb+srv://DanSher:tziO4kvuG0lQIvoN@cluster0.c9ughq4.mongodb.net/".concat("musicPlayer"));

    app.get("/", (req, res) => {
      Tracks.find().then(result => {
        // console.log(result);
        res.json(result);
      })
    })

    app.post("/upload", upload.fields([{ name: "cover", maxCount: 1 }, { name: "song", maxCount: 1 }]), async (req, res) => {
      let postTrack = new Tracks(req.body)
      if (req.files.cover) {
        postTrack.cover = req.files.cover[0].path;
      }
      if (req.files.song) {
        postTrack.song = req.files.song[0].path;
      }
      try {
        await postTrack.save();
        res.status(200).send(postTrack);
      }
      catch (error) {
        if (error.name === "ValidationError") {
          let errors = {};

          Object.keys(error.errors).forEach((key) => {
            errors[key] = error.errors[key].message;
          });
          console.log(errors);
          return res.status(400).send(errors);
        }
      }
      res.status(500).send("Something went wrong");
    })

    app.listen(PORT, () => {
      console.log('server started');
    });
  }
  catch (e) {
    // console.log(e);
  }
}

start();