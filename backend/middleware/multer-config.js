const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (req.body.publication) {
      req.imagePath = 'images/publications';
      callback(null, 'images/publications');
    } else if (req.body.user) {
      req.imagePath = 'images/profil-pic';
      callback(null, 'images/profil-pic');
    }
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const filename = path.parse(name).name;
    const extension = MIME_TYPES[file.mimetype];

    callback(null, filename + '-' + Date.now() + '.' + extension);
  },
});

module.exports = multer({ storage: storage }).single('image');
