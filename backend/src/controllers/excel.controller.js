import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


import { fileURLToPath } from 'url';
import path from 'path';
import { processExcel, processJsonToExcelToDb, importExcelData } from "../utils/excelHelper.js";
import { Student } from "../models/student.model.js";

// Get the __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const uploadExcel = asyncHandler(async (req, res) => {
  console.log('req.file:', req.file); // Check the file object

  const buffer = req.file.buffer;

  console.log(buffer)

  const studentsData = await processExcel(buffer);


  await Student.insertMany(studentsData);

  return res.status(201).json(new ApiResponse(200, result, 'Import process completed.'));

});


const importJsonDataToExcelThenDb = asyncHandler(async (req, res) => {
  try {
    // Specify the Excel file path
    const excelFilePath = path.resolve(__dirname, '../controllers\\student.xlsx');
    const jsonFilePath = path.resolve(__dirname, '../json/fakeData.json');

    const result = await processJsonToExcelToDb(jsonFilePath, excelFilePath);

    return res.status(201).json(new ApiResponse(200, result, 'Import process completed.'));

  } catch (error) {
    console.error('Error during import process:', error.message);
    return res.status(500).json(new ApiResponse(500, error.message, 'Internal Server Error'));

  }
});

const importDataFromExcel = asyncHandler(async (req, res) => {
  try {
    // Specify the Excel file path
    const excelFilePath = path.resolve(__dirname, '../controllers\\student.xlsx');

    // Import data from Excel file
    const result = await importExcelData(excelFilePath);

    return res.status(201).json(new ApiResponse(200, result, 'Import process completed.'));

  } catch (error) {
    console.error('Error during import process:', error.message);
    return res.status(500).json(new ApiResponse(500, error.message, 'Internal Server Error'));

  }
});

const createStudent = asyncHandler(async (req, res) => {
  const newStudent = req.body;

  const { name, email, enrollmentDate, state } = newStudent;

  if (!name || !email || !enrollmentDate || !state) {
    throw new ApiError(400, 'Name, email, enrollmentDate, and state are required fields.');
  }

  const student = await Student.create(newStudent);

  return res.status(201).json(new ApiResponse(201, student, 'Student created successfully.'));
});

const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // const { name, email, enrollmentDate, state, } = req.body;
  const updatedStudent = req.body;

  if (Object.keys(updatedStudent).length === 0) {
    throw new ApiError(400, 'No update data provided');
  }

  const student = await Student.findByIdAndUpdate(id, updatedStudent, { new: true });
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  return res.status(200).json(new ApiResponse(200, student, 'Student updated successfully.'));
});

const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find();

  return res.status(200).json(new ApiResponse(200, { students: students, totalStudents: students.length, }, 'List of students.'));
});

const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const student = await Student.findById(id);
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  return res.status(200).json(new ApiResponse(200, student, 'Student details.'));
});

const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const student = await Student.findByIdAndDelete(id);
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  return res.status(200).json(new ApiResponse(200, {}, 'Student deleted successfully.'));
});

export {
  uploadExcel,


  importJsonDataToExcelThenDb,
  importDataFromExcel,
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
}