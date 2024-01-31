import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import { app } from "./app.js";

dotenv.config({ path: './env' })


const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at port : http://localhost:${PORT}`.blue.bold.underline);
    })
  })
  .catch((err) => {
    console.log(`MongoDB connection Failed: ${err}`)
  });