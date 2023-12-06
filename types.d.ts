import { Session } from "next-auth";

declare interface CustomSession extends Session {
  user: {
    id?: string | null | undefined;
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
}

declare type TableData = {
  titles: string[];
  topics?: string[];
  topicAsLink?: boolean;
  elements: Array<Array<string | number>>;
  isResult?: boolean;
  isAccuracy?: boolean;
  checks?: number[];
  crosses?: number[];
  accuracies?: number[];
  ids?: string[];
  isSummary?: boolean;
  isMCQ?: boolean;
  correct_answers?: number[];
  ctaFunctions?: ('deleteGame' | 'addGame')[];
}

declare type HistoryTypes = 'quizzes' | 'flashcards' | 'collections' | 'decks'

declare type Game = {
  _id: string;
  user_id: string;
  questions: {
    question: string;
    answer: string;
    options?: string[];
  }[];
  created_at: Date;
  topic: string;
  game_type: 'mcq' | 'open-ended';
  game_genre: 'quiz' | 'flashcard';
  game_mode: 'AI' | 'manual';
}

declare type GroupGame = {
  _id: string;
  title: string;
  games_type: 'mcq' | 'open-ended';
  games_genre: 'quizzes' | 'flashcards';
  games: Game[];
}

declare type UserAnswer = {
  answer: string;
  is_correct?: boolean;
  percentage_correct?: number;
  difficulty?: number;
}

declare type mcqQuestion = {
  question: string;
  answer: string;
  option1: string;
  option2: string;
  option3: string;
}

declare type openEndedQuestion = {
  question: string;
  answer: string;
}