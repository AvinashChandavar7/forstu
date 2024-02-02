import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { readFileSync } from 'fs';
import swaggerUi from 'swagger-ui-express';
const swaggerDocumentPath = './src/json/swagger-output.json';
const swaggerDocument = JSON.parse(readFileSync(swaggerDocumentPath, 'utf-8'));


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

app.use("/api/v1/excel", excelRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export { app };
