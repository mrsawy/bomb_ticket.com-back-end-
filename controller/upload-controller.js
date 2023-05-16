var multer = require('multer');
var uploadMiddleware = require('../routes/upload-middleware');
module.exports = {
    uploadForm: function (req, res) {
        res.render('upload-form');
    },
    uploadFiles: function (req, res) {
        var upload = multer({
            storage: uploadMiddleware.files.storage(),
            allowedFiles: uploadMiddleware.files.allowedFiles
        }).single('pdfs');
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                res.send(err);
            } else if (err) {
                res.send(err);
            } else {
                res.render('upload-form');
            }

        })

    }
}