import { Router } from "express";

import {
  uploadExcel,
  importJsonDataToExcelThenDb,
  importDataFromExcel,
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/excel.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post('/uploadExcel', upload.single('upload'), uploadExcel);


router.post("/importJsonData", importJsonDataToExcelThenDb);
router.post("/importExcel", importDataFromExcel);

router.post("/student/create", createStudent);
router.get("/student", getStudents);
router.get("/student/:id", getStudentById);
router.put("/student/:id", updateStudent);
router.delete("/student/:id", deleteStudent);

export default router;

/**

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));


app.use(express.json({ limit: "16kb" }))

app.use(express.urlencoded({ extended: true, limit: "16kb" }))

app.use(express.static("public"))

app.use(cookieParser());

//! routes import
import excelRouter from "./routes/excel.routes.js";

//! routes declarations

app.use("/api/v1/excel", excelRouter)

export { app };



import { Router } from "express";

import multer from "multer";

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes('excel') ||
    file.mimetype.includes('spreadsheetml')
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


import { uploadExcel } from "../controllers/excel.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post('/uploadExcel', upload.single('file'), uploadExcel);
export default router;
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    enrollmentDate: { type: Date, required: true },
    state: { type: String, default: 'Maharashtra' },
  },
  { timestamps: true }
);

export const Student = mongoose.model('Student', studentSchema);


import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


import { fileURLToPath } from 'url';
import path from 'path';
import { processExcel } from "../utils/excelHelper.js";
import { Student } from "../models/student.model.js";

// Get the __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const uploadExcel = asyncHandler(async (req, res) => {
  const buffer = req.file.buffer;
  const studentsData = await processExcel(buffer);

  await Student.insertMany(studentsData);
  return res.status(201).json(new ApiResponse(200, result, 'Import process completed.'));

});

import fs from 'fs';
import ExcelJS from 'exceljs';
import moment from 'moment';
import { Student } from '../models/student.model.js';


export const processExcel = async (buffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const sheet = workbook.getWorksheet(1);
  const studentsData = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) { // Skip header row
      studentsData.push({
        name: row.getCell(1).value,
        age: row.getCell(2).value,
      });
    }
  });

  return studentsData;
};

 */