import multer from "multer";

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes('excel') ||
    file.mimetype.includes('spreadsheetml') ||
    file.mimetype.includes('xlsx')
  ) {
    cb(null, true);
  } else {
    cb('Please upload only excel file.', false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-excel-${file.originalname}`)
  },
})

export const upload = multer({ storage: storage, fileFilter: excelFilter })
