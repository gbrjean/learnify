import * as z from 'zod'

export const QuizWithAiValidation = z.object({
  topic: z.string().min(3, {message: 'Must have at least 3 chars'}),
  questions_no: z.number().min(1, { message: 'Must have at least 1 question' }).max(10, { message: 'Maximum of 10 questions' }),
  type: z.enum(["open-ended", "mcq"])
})

const AnswersSchema = z.object({
  answer: z.string().min(5, {message: 'Must have at least 5 chars'})
})

const QuestionsSchema = z.object({
  question: z.string().min(10, {message: 'Must have at least 10 chars'}),
  answers: z.array(AnswersSchema).min(1, {message: 'Answers required'}),
  correct_answer: z.number().min(0, {message: 'Must have a correct answer'}),
})

export const QuizManualValidation = z.object({
  topic: z.string().min(3, {message: 'Must have at least 3 chars'}),
  type: z.enum(["open-ended", "mcq"]),
  questions: z.array(QuestionsSchema).min(1, {message: 'Fields required'})
})