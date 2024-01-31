import { Router } from "express";

import {
  importJsonDataToExcelThenDb,
  importDataFromExcel,
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/excel.controller.js";

const router = Router();

router.post("/importJsonData", importJsonDataToExcelThenDb);
router.post("/importExcel", importDataFromExcel);

router.post("/student/create", createStudent);
router.get("/student", getStudents);
router.get("/student/:id", getStudentById);
router.put("/student/:id", updateStudent);
router.delete("/student/:id", deleteStudent);

export default router;
