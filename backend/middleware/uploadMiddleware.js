import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes = /pdf|docx|msword|vnd.openxmlformats-officedocument.wordprocessingml.document/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype =
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/octet-stream';

  if (extname || mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF and DOCX files are allowed!'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});
