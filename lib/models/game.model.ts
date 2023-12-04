import mongoose, { Schema } from "mongoose";

const gameSchema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [
    {
      question: String,
      answer: String,
      options: mongoose.Schema.Types.Mixed, // ONLY for MCQ
    }
  ],
  created_at: { type: Date, default: Date.now },
  topic: String,
  game_type: {
    type: String,
    enum: ['mcq', 'open-ended'],
  },
  game_genre: {
    type: String,
    enum: ['quiz', 'flashcard'],
  },
  game_mode: {
    type: String,
    enum: ['AI', 'manual'],
  },
  average_difficulty: Number, // ONLY FOR game_genre FLASHCARD
  played_times: Number, // ONLY FOR game_genre FLASHCARD
});



const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);

export default Game;