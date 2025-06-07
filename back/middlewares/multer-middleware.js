const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../files');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('MIDDLEWARE: ', 'Middleware started', file);
    if (file.fieldname === 'image') cb(null, path.join(uploadDir, '/taskPictures'));
    if (file.fieldname === 'newAttachments') cb(null, path.join(uploadDir, '/attachments'));
    if (file.fieldname === 'attachments') cb(null, path.join(uploadDir, '/attachments'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.docx'];
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (allowedTypes.includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Недопустимый тип файла'), false);
//   }
// };

const upload = multer({
  storage: storage,
  // fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;
