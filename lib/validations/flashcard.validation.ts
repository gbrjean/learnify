import * as z from 'zod'

const AnswersSchema = z.object({
  answer: z.string().min(5, {message: 'Must have at least 5 chars'})
})

const QuestionsSchema = z.object({
  question: z.string().min(10, {message: 'Must have at least 10 chars'}),
  answers: z.array(AnswersSchema).min(1, {message: 'Fields required'}),
  correct_answer: z.number().min(0, {message: 'Must have a correct answer'}),
})

export const FlashcardValidation = z.object({
  topic: z.string().min(3, {message: 'Must have at least 3 chars'}),
  type: z.enum(["open-ended", "mcq"]),
  questions: z.array(QuestionsSchema).min(1, {message: 'Fields required'})
})