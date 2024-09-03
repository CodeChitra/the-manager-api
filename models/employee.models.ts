import mongoose from "mongoose";

interface IEmployee {
  name: string;
  age: number;
  role: string;
  skills: string[];
  experience: number;
  location: string;
  createdBy: mongoose.Types.ObjectId;
}

const employeeSchema = new mongoose.Schema<IEmployee>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Username is required!"],
      lowercase: true,
      minlength: [3, "Username should contain atleast 3 characters."],
      maxlength: [40, "Username can not contain more than 40 characters."],
    },
    age: {
      type: Number,
      required: [true, "Employee Age is required!"],
      min: [16, "Employee age can not be less than 16."],
      max: [60, "Employee age can not be greater than 60."],
    },
    role: {
      type: String,
      required: [true, "Employee Role is required!"],
      lowercase: true,
    },
    skills: {
      type: [String],
      required: [true, "Please provide Employee's skills."],
      validate: [
        {
          validator: (v: string[]) => v.length > 0,
          message: "At least one skill is required.",
        },
        {
          validator: (v: string[]) => v.length <= 8,
          message: "No more than 8 skills are allowed.",
        },
      ],
    },
    experience: {
      type: Number,
      required: [true, "Please provide Employee's work experience in days."],
      min: [0, "Please fill valid experience in years."],
      max: [60, "Please fill valid experience in years."],
      default: 0,
    },
    location: {
      trim: true,
      type: String,
      required: [true, "Plaes provide Employee's work location."],
      lowercase: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
