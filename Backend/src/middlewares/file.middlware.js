//Isme humme joh bhi input main aayegi file usse handle karna hain using the multer package
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024 //3MB
  }
});
module.exports = upload;