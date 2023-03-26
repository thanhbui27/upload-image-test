const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const filesPayloadExists = require("./middleware/filesPayloadExists");
const fileExtLimiter = require("./middleware/fileExtLimiter");
const fileSizeLimiter = require("./middleware/fileSizeLimiter");

const PORT = process.env.PORT || 3500;

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

var rimraf = require("rimraf");
var fs = require("fs");

setInterval(() => {
  var uploadsDir = __dirname + "/uploads";

  fs.readdir(uploadsDir, function (err, files) {
    files.forEach(function (file, index) {
      fs.stat(path.join(uploadsDir, file), function (err, stat) {
        var endTime, now;
        if (err) {
          return console.error(err);
        }
        now = new Date().getTime();
        endTime = new Date(stat.ctime).getTime() + 30000;
        if (now > endTime) {
          return rimraf(path.join(uploadsDir, file));
        }
      });
    });
  });
}, 30000);

app.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter([".png", ".jpg", ".jpeg"]),
  fileSizeLimiter,
  (req, res) => {
    const files = req.files;
    console.log(files);

    Object.keys(files).forEach((key) => {
      const filepath = path.join(__dirname, "uploads", files[key].name);
      files[key].mv(filepath, (err) => {
        if (err)
          return res.status(500).json({
            success: false,
            data: {
              files: [],
              message: "upload failed",
              baseurl: req.protocol + "://" + req.headers.host + "/uploads/",
              error: err,
              path: [],
            },
          });
      });
    });

    return res.json({
      success: true,
      data: {
        files: Object.keys(files),
        message: "upload success",
        baseurl: req.protocol + "://" + req.headers.host + "/uploads/",
        error: "",
        path: Object.keys(files).map(
          (image) =>
            req.protocol + "://" + req.headers.host + "/uploads/" + image
        ),
      },
    });
  }
);
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
