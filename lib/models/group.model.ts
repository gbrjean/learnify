import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['collection', 'deck'],
    required: true
  },
  games_genre: {
    type: String,
    enum: ['quizzes', 'flashcards'],
    required: true
  },
  games_type: {
    type: String,
    enum: ['mcq', 'open-ended'],
  },
  games: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  created_at: { type: Date, default: Date.now },
});



const Group = mongoose.models.Group || mongoose.model('Group', groupSchema);

export default Group;