// src/middlewares/multer.middleware.js
import multer from 'multer';
import path from 'path';

// Temporary storage (file will be uploaded to Cloudinary later)
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, JPG, WEBP allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
