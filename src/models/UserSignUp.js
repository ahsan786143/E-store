import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    
    },

    avatar: String,
    public_id: String,

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    deletedAt: {
      type: Date,
      default: null,
      index: true,
      select: false,
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
  
  next();
});

// Compare password method
userSchema.methods={
  comparePassword :async function (password) {
  return await bcrypt.compare(password, this.password);
}
}


const UserModel = mongoose.models.User || mongoose.model("User", userSchema, `users`);

export default UserModel;
