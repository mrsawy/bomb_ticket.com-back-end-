var multer = require('multer');
//  Multer Configuration Starts Here
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "application/pdf": "pdf",
};

module.exports.files = {
    storage: function () {
        var storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const isValid = MIME_TYPE_MAP[file.mimetype];
                let error = new Error("Invalid mime type");
                if (isValid) {
                    error = null;
                }
                cb(error, "Images");
            },
            filename: (req, file, cb) => {
                const name = file.originalname
                    .toLowerCase()
                    .split(" ")
                    .join("-");
                const ext = MIME_TYPE_MAP[file.mimetype];
                cb(null, +Date.now() + "." + ext);
            }
        })

        return storage;
    }
}