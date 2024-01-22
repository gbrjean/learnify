"use client"

import { TimerIcon } from "@public/assets/icons/TimerIcon"

import css from '@styles/quiz/quiz.module.scss'

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Check from "@public/assets/images/check-answer.png"
import Cross from "@public/assets/images/cross-answer.png"
import { GroupGame, UserAnswer } from "@types";
import { formatTimeDelta } from "@lib/utils";
import { differenceInSeconds } from "date-fns";
import { checkAnswer, endGame } from "@lib/actions/game.actions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";


const MCQ = ({group}: {group: GroupGame}) => {

  const router = useRouter();

  const [hasEnded, setHasEnded] = useState(false)

  const [pickDifficulty, setPickDifficulty] = useState(false) //? ONLY FOR FLASHCARD
  const [difficulty, setDifficulty] = useState<5 | 8 | 10 | undefined>(undefined) //? ONLY FOR FLASHCARD
 
  const [totalQuestionIndex, setTotalQuestionIndex] = useState(0)
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(0)
  
  const [gameIndex, setGameIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)

  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(undefined)

  const [answers, setAnswers] = useState<UserAnswer[]>([])

  const [stats, setStats] = useState({
    correct_answers: 0,
    wrong_answers: 0,
  })

  const timeStarted = useMemo(() => new Date(), [])
  const [now, setNow] = useState(new Date())


  useEffect(() => {
    group.games.forEach(game => setTotalQuestionsCount((prev) => prev + game.questions.length) )
  }, [])
  

  const game = useMemo(() => {
    return group.games[gameIndex];
  }, [gameIndex]);

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex]);

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return currentQuestion.options;
  }, [currentQuestion]);


  useEffect(() => {
    if(questionIndex !== 0){
      setQuestionIndex(0)
    }
  }, [gameIndex])
  

  const { mutate: checkCorrectAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      if(selectedAnswer !== undefined){
        let res: number | boolean | undefined

        if(group.games_genre == 'flashcards' && difficulty !== undefined){
          res = await checkAnswer(game._id, questionIndex, options[selectedAnswer], difficulty);
        } 

        if(group.games_genre == 'quizzes'){
          res = await checkAnswer(game._id, questionIndex, options[selectedAnswer]);
        }

        return res;
      }
    },
  });

  const { mutate: endGameId } = useMutation({
    mutationFn: async () => {
      const res = await endGame(
        group._id, 
        answers, 
        timeStarted, 
        group.games_genre == 'quizzes' ? 'collections' : 'decks'
      )
      return res;
    },
  });


  const handleNextFlashcard = () => {
    setPickDifficulty(true)
  }


  const handleNext = useCallback(() => {
    if(selectedAnswer !== undefined){

      if(group.games_genre == 'flashcards' && difficulty === undefined){
        toast.info('Please select an option')
        return
      }

      checkCorrectAnswer(undefined, {
        onSuccess: (isCorrect) => {
          if (typeof isCorrect === 'boolean' && isCorrect) {

            if(group.games_genre == 'flashcards' && difficulty !== undefined){
              setAnswers((prevAnswers) => {
                const currentAnswer: UserAnswer = {
                  answer: options[selectedAnswer],
                  is_correct: true,
                  difficulty: difficulty,
                };
                return [...prevAnswers, currentAnswer];
              });

            } else {
              //? Is quiz
              setAnswers((prevAnswers) => {
                const currentAnswer: UserAnswer = {
                  answer: options[selectedAnswer],
                  is_correct: true,
                };
                return [...prevAnswers, currentAnswer];
              });
            }

            setStats((stats) => ({
              ...stats,
              correct_answers: stats.correct_answers + 1,
            }));

            toast.success("Correct. You got it right!")

          } else {

            if(group.games_genre == 'flashcards' && difficulty !== undefined){
              setAnswers((prevAnswers) => {
                const currentAnswer: UserAnswer = {
                  answer: options[selectedAnswer],
                  is_correct: false,
                  difficulty: difficulty,
                };
                return [...prevAnswers, currentAnswer];
              });
              

            } else {
              //? Is quiz
              setAnswers((prevAnswers) => {
                const currentAnswer: UserAnswer = {
                  answer: options[selectedAnswer],
                  is_correct: false,
                };
                return [...prevAnswers, currentAnswer];
              });
            }

            setStats((stats) => ({
              ...stats,
              wrong_answers: stats.wrong_answers + 1,
            }));

            toast.error("Incorrect. You got it wrong!")

          }

          
          if (questionIndex === game.questions.length - 1) {
            if (gameIndex === group.games.length - 1) {
              setHasEnded(true)
              return;
            }
            setGameIndex((gameIndex) => gameIndex + 1)
          }


          setSelectedAnswer(undefined)
          setQuestionIndex((questionIndex) => questionIndex + 1);
          setTotalQuestionIndex((totalQuestionIndex) => totalQuestionIndex + 1)

          if(group.games_genre == 'flashcards' && difficulty !== undefined){
            setPickDifficulty(false)
            setDifficulty(undefined)
          }

        },
        onError: (error) => {
          console.error(error);
          toast.error("Something went wrong")
        },
      });

    }
  }, [checkCorrectAnswer, selectedAnswer, questionIndex, endGameId, answers, group.games_genre, game.questions.length, pickDifficulty, difficulty, gameIndex])


  useEffect(() => {
    if (hasEnded) {
      endGameId(undefined, {
        onSuccess: (summaryId) => {
          router.push(`/summary/${summaryId}`)
        }
      });
    }
  }, [endGameId, game.questions.length, hasEnded])
  


  useEffect(() => {
    const interval = setInterval(() => {
        setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);



  return (
    <section className={css.section}>

      <div className={css.quiz_header}>
        <span>{group.games_genre == 'quizzes' ? 'Collection' : 'Deck'}</span>
        <h1>{group.title.charAt(0).toUpperCase() + group.title.slice(1)}</h1>
      </div>
      

      { pickDifficulty &&
        <div className={css.quiz_difficulty_picker_wrapper}>
          <div className={css.quiz_difficulty_picker}>
            <span>How well did you know this question?</span>
            
              <button className={difficulty === 5 ? "btn-selectable btn-selected" : "btn-selectable"} onClick={() => setDifficulty(5)}>Not well</button>
              <button className={difficulty === 8 ? "btn-selectable btn-selected" : "btn-selectable"} onClick={() => setDifficulty(8)}>Good</button>
              <button className={difficulty === 10 ? "btn-selectable btn-selected" : "btn-selectable"} onClick={() => setDifficulty(10)}>Excellent</button>
            

            <button className="btn-primary" disabled={isChecking} onClick={() => handleNext()}>Next question</button>
          </div>
        </div>
      }


      <div className={css.quiz_status}>
        <div className={css.quiz_timer}>
          <TimerIcon />
          <span>{formatTimeDelta(differenceInSeconds(now, timeStarted))}</span>
        </div>

        <div className={`${css.quiz_stats} card`}>
          <div>
            <Image src={Check} width={32} height={32} alt="" />
            <span>{stats.correct_answers}</span>
          </div>
          <div>
            <span>{stats.wrong_answers}</span>
            <Image src={Cross} width={32} height={32} alt="" />
          </div>
        </div>

      </div>

      <div className={`${css.quiz_question} card`}>
        <div className={css.quiz_question_no}>
          <span>{totalQuestionIndex + 1}</span>
          <span>{totalQuestionsCount}</span>
          {/* <span>{questionIndex + 1}</span> */}
          {/* <span>{game.questions.length}</span> */}
        </div>

        <p>{currentQuestion?.question}</p>
      </div>

      <div className="quiz-options">

        { options.map((option, index) => (
            <div 
              key={index}
              className={selectedAnswer === index ? "quiz-answer card --selected" : "quiz-answer card"}
              onClick={() => setSelectedAnswer(index)}
            >
              <div className="quiz-answer-no">
                <span>{index+1}</span>
              </div>
              <span>{option}</span>
            </div>
        ))}

      </div>


      {!pickDifficulty && <button className="btn-primary" disabled={isChecking} onClick={() => group.games_genre == 'quizzes' ? handleNext() : handleNextFlashcard()}>Next question</button> }


    </section>
  )
}

export default MCQ