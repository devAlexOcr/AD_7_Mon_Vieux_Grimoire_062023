const multer = require("multer");
const sharp = require('sharp');
const SharpMulter = require("sharp-Multer");

rename = (file)  => {
  const name = file.split(' ').join('_');
  const ref = `${Date.now()}-${name}.webp`;
  return ref;
  }



const  storage  =  SharpMulter({
    destination:  (req,  file,  callback)  => callback(null,  "images"),
    imageOptions:  {
            fileFormat:  "webp",
            quality:  20,
            },
    filename: (file) => rename(file)
});

const upload = multer({ storage });

module.exports = upload.single('image');
