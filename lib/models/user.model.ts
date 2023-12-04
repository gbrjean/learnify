import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  image: String,
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  created_at: { type: Date, default: Date.now },
});


const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;