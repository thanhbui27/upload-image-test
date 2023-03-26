const path = require("path")

const fileExtLimiter = (allowedExtArray) => {
    return (req, res, next) => {
        const files = req.files

        const fileExtensions = []
        Object.keys(files).forEach(key => {
            fileExtensions.push(path.extname(files[key].name))
        })

        // Are the file extension allowed? 
        const allowed = fileExtensions.every(ext => allowedExtArray.includes(ext))

        if (!allowed) {
            const message = `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(",", ", ");

            return res.status(422).json( {
                success: false,
                data: {
                  files : [],
                  message: message,
                  baseurl: req.protocol+"://"+req.headers.host+"/uploads/",
                  error: message,
                  path: []
                },
              });
        }

        next()
    }
}

module.exports = fileExtLimiter