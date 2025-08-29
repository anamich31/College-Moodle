import multer from "multer";
import path from "path";

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  // Only accept PDF files
  const ext = path.extname(file.originalname);
  if (ext !== ".pdf") {
    cb(new Error("Only PDF files are allowed"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter });


// New Multer configuration for Excel files
const excelFileFilter = (req, file, cb) => {
  // Only accept .xlsx or .xls files
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".xlsx" && ext !== ".xls") {
    cb(new Error("Only Excel files (.xlsx or .xls) are allowed"), false);
  } else {
    cb(null, true);
  }
};

const excelStorage = multer.memoryStorage(); // Store in memory for processing
const excelUpload = multer({ storage: excelStorage, fileFilter: excelFileFilter });

export { excelUpload,upload };


