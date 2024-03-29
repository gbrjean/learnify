import mongoose, { Schema } from "mongoose";

const gameHistorySchema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  game_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  time_started: Date,
  time_ended: { type: Date, default: Date.now },
  answers: [
    {
      answer: { type: String, required: true },
      is_correct: Boolean,
      percentage_correct: Number,
      difficulty: Number,
    }
  ],
  history_type: {
    type: String,
    enum: ['quizzes', 'flashcards', 'decks', 'collections'],
  },
});




const GameHistory = mongoose.models.GameHistory || mongoose.model('GameHistory', gameHistorySchema);

export default GameHistory;