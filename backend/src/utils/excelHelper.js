import fs from 'fs';
import ExcelJS from 'exceljs';
import moment from 'moment';
import { Student } from '../models/student.model.js';


const validateAndFormatDate = (dateString, rowNumber) => {
  const validDate = moment(dateString, 'YYYY-MM-DD', true).isValid();
  if (!validDate) {
    throw new Error(`Invalid date format for enrollmentDate at row ${rowNumber}`);
  }
  return validDate ? moment(dateString).toDate() : null;
};

export const processJsonToExcelToDb = async (jsonFilePath, excelFilePath) => {
  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Students');

  worksheet.columns = [
    { header: 'Name', key: 'name', width: 10 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Enrollment Date', key: 'enrollmentDate', width: 15 },
    { header: 'State', key: 'state', width: 25 },
  ];

  jsonData.forEach((e, index) => {
    e.enrollmentDate = validateAndFormatDate(e.enrollmentDate, index + 2);
    worksheet.addRow(e);
  });

  await workbook.xlsx.writeFile(excelFilePath);
  await Student.insertMany(jsonData);
};


export const importExcelData = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(1);

  const students = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber !== 1) { // Skip header row
      const [name, email, enrollmentDateString] = row.values.slice(1);
      const enrollmentDate = validateAndFormatDate(enrollmentDateString, rowNumber);

      students.push({
        name,
        email,
        enrollmentDate,
      });
    }
  });
  await Student.insertMany(students);
};

export const createStudentJsonToExcelToDb = async (studentData) => {
  const newStudent = {
    name: studentData.name,
    email: studentData.email,
    enrollmentDate: validateAndFormatDate(studentData.enrollmentDate),
  };

  // Update JSON file
  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
  jsonData.push(newStudent);
  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

  // Update Excel file
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelFilePath);
  const worksheet = workbook.getWorksheet(1);
  worksheet.addRow(newStudent);
  await workbook.xlsx.writeFile(excelFilePath);

  // Insert into MongoDB
  await Student.create(newStudent);

  return newStudent;
};

export const getStudentsJsonToExcelToDb = async () => {
  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
  return jsonData;
};

export const getStudentByIdJsonToExcelToDb = async (id) => {
  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
  const student = jsonData.find((s) => s.id === id);
  return student;
};

export const updateStudentByIdJsonToExcelToDb = async (id, updatedData) => {
  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
  const index = jsonData.findIndex((s) => s.id === id);

  if (index !== -1) {
    const updatedStudent = {
      id,
      name: updatedData.name || jsonData[index].name,
      email: updatedData.email || jsonData[index].email,
      enrollmentDate: validateAndFormatDate(updatedData.enrollmentDate) || jsonData[index].enrollmentDate,
    };

    // Update JSON file
    jsonData[index] = updatedStudent;
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

    // Update Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelFilePath);
    const worksheet = workbook.getWorksheet(1);
    worksheet.spliceRows(index + 2, 1, [updatedStudent]);
    await workbook.xlsx.writeFile(excelFilePath);

    // Update in MongoDB
    await Student.findByIdAndUpdate(id, updatedStudent);

    return updatedStudent;
  } else {
    throw new Error(`Student with ID ${id} not found.`);
  }
};

export const deleteStudentByIdJsonToExcelToDb = async (id) => {
  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
  const index = jsonData.findIndex((s) => s.id === id);

  if (index !== -1) {
    // Remove from JSON file
    jsonData.splice(index, 1);
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

    // Remove from Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(excelFilePath);
    const worksheet = workbook.getWorksheet(1);
    worksheet.spliceRows(index + 2, 1);
    await workbook.xlsx.writeFile(excelFilePath);

    // Remove from MongoDB
    await Student.findByIdAndDelete(id);

    return `Student with ID ${id} deleted successfully.`;
  } else {
    throw new Error(`Student with ID ${id} not found.`);
  }
};


