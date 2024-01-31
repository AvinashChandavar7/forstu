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
