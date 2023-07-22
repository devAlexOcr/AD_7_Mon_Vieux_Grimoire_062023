const multer = require("multer");
const sharp = require('sharp');
const SharpMulter = require("sharp-Multer");


const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp' : 'webp'
};



  newFilenameFunction = (og_filename)  => {

  const name = og_filename.split(' ').join('_');
  const ref = `${Date.now()}-${name}.webp`;
  return ref;
  }

//   await sharp(buffer)
//     .webp({ quality: 20 })
//     .toFile('./images/' + ref);
//     const link = `${req.protocol}://${req.get('host')}/images/${ref}`;


    const  storage  =  SharpMulter({
        destination:  (req,  file,  callback)  => callback(null,  "images"),
    
        imageOptions:  {
            fileFormat:  "webp",
            quality:  20,
            },

        filename: newFilenameFunction
        });
    //     const mimeTypeVerify = MIME_TYPES.includes(mimetype) 
    // if (mimeTypeVerify === false) {
    //     res.status(400).json({message : 'format image non supporté'})
    // }else {
    //     fs.access('./images', (error) => {
    //         if (error) {
    //           fs.mkdirSync('./images');
    //         }
    //       });
        



// const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload.single('image');
