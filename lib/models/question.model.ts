import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema({
  game_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  question: String,
  answer: String,
  question_type: { type: String, 
    enum: ['mcq', 'open_ended'],
  },
  options: mongoose.Schema.Types.Mixed,
  user_answer: String,
  iscorrect: Boolean,
  percentage_correct: Number,
});


const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

export default Question;