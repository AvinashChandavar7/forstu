import mongoose from 'mongoose';


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
