const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const { Router } = express;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    console.log("destination: ", JSON.stringify(file, null, 2));
    cb(null, file.originalname);
  },
});

const app = express();
const router = Router();
const upload = multer({
  storage: storage,
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
}).array("file");

router.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err instanceof multer.MulterError) {
      console.error("MULTER ERR: ", err);
    } else if (err) {
      console.error("OTHER ERR: ", err);
    }

    res.send(200);
  });
});

app.use(bodyParser.json());
app.use(cors());
app.use("/", router);

app.listen(3002, "0.0.0.0", () => {
  console.log("service is running http://localhost:3002");
});
