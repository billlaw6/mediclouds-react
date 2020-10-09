const path = require("path");
const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const axios = require("axios");

const app = express();

app.use(cors());

app.use("/dev-api/case_files", async (req, res, next) => {
  console.log("req.originalUrl", req.path);
  try {
    const _res = await fs.readFile(
      path.resolve(__dirname, `pdf${Math.ceil(Math.random() * 4)}.pdf`),
    );

    res.append("Content-Type", "application/pdf");
    res.send(_res);

    await next();
  } catch (error) {
    console.error(">> err", error);
  }
});

app.listen(3001, () => {
  console.log(">> server is running http://localhost:3001");
});
