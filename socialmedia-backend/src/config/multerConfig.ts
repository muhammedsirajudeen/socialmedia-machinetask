import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,"../uploads/")); // Uploads will be stored in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

// File filter for allowed file types
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Multer upload configuration
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter,
});

export default upload;
