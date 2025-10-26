import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  tokens: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);
export default User;   // ✅ default export
