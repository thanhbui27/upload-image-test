const filesPayloadExists = (req, res, next) => {
  if (!req.files)
    return res.status(400).json({
      success: false,
      data: {
        files: [],
        message: "Missing files",
        baseurl: req.protocol + "://" + req.headers.host + "/uploads/",
        error: message,
        path: [],
      },
    });

  next();
};

module.exports = filesPayloadExists;
