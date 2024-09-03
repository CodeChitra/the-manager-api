import mongoose from "mongoose";
import validator from "validator";
interface IUser {
  name: string;
  email: string;
  password: string;
  refreshToken: string;
}
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Username is required!"],
      lowercase: true,
      minlength: [3, "Username should contain atleast 3 characters."],
      maxlength: [40, "Username can not contain more than 40 characters."],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email is required!"],
      lowercase: true,
      unique: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "Please fill a valid email!",
      },
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
