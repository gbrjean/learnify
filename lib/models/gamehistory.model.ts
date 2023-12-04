import mongoose, { Schema } from "mongoose";

const gameHistorySchema = new Schema({
  game_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
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
    enum: ['quizzez', 'flashcards', 'decks', 'collections'],
  },
});




const GameHistory = mongoose.models.GameHistory || mongoose.model('GameHistory', gameHistorySchema);

export default GameHistory;