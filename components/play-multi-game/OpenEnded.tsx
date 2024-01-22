"use client"

import { TimerIcon } from "@public/assets/icons/TimerIcon"

import css from '@styles/quiz/quiz.module.scss'

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Accuracy from "@public/assets/images/accuracy.png"
import BlankAnswerInput from "@components/BlankAnswerInput";
import { GroupGame, UserAnswer } from "@types";
import { formatTimeDelta } from "@lib/utils";
import { differenceInSeconds } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { checkAnswer, endGame } from "@lib/actions/game.actions";
import { toast } from "react-toastify";

const OpenEnded = ({group}: {group: GroupGame}) => {

  const router = useRouter();

  const [hasEnded, setHasEnded] = useState(false)

  const [pickDifficulty, setPickDifficulty] = useState(false) //? ONLY FOR FLASHCARD
  const [difficulty, setDifficulty] = useState<5 | 8 | 10 | undefined>(undefined) //? ONLY FOR FLASHCARD

  const [totalQuestionIndex, setTotalQuestionIndex] = useState(0)
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(0)

  const [gameIndex, setGameIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)

  const [blankAnswer, setBlankAnswer] = useState("");
  const [filledAnswer, setFilledAnswer] = useState("");

  const [answers, setAnswers] = useState<UserAnswer[]>([])

  const [averagePercentage, setAveragePercentage] = useState<number>(0);

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
  }, [questionIndex, game]);


  useEffect(() => {
    if(group.games_genre == 'quizzes'){
      setQuestionIndex(0)
    }
  }, [gameIndex])

  // useEffect(() => {
  //   console.log(group)
  // }, [group])

  // useEffect(() => {
  //   console.log(game)
  // }, [game])

  // useEffect(() => {
  //   console.log(currentQuestion)
  // }, [currentQuestion])

  // useEffect(() => {
  //   console.log(questionIndex)
  // }, [questionIndex])
  

  
  const { mutate: checkCorrectAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      let updatedFilledAnswer = blankAnswer;
      document.querySelectorAll<HTMLInputElement>("#blank-input").forEach((input) => {
        updatedFilledAnswer = updatedFilledAnswer.replace("_____", input.value);
        input.value = "";
      });
      setFilledAnswer(updatedFilledAnswer)

      let percentageSimilar: number | boolean | undefined

      if(group.games_genre == 'flashcards' && difficulty !== undefined){
        percentageSimilar = await checkAnswer(game._id, questionIndex, updatedFilledAnswer, difficulty);
      } 

      if(group.games_genre == 'quizzes'){
        percentageSimilar = await checkAnswer(game._id, questionIndex, updatedFilledAnswer);
      }

      return {percentageSimilar, updatedFilledAnswer};
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

    if(group.games_genre == 'flashcards' && difficulty === undefined){
      toast.info('Please select an option')
      return
    }

    checkCorrectAnswer(undefined, {
      onSuccess: ({percentageSimilar, updatedFilledAnswer}) => {
        if (typeof percentageSimilar === "number") {

          toast.info(`Your answer is ${percentageSimilar}% similar to the correct answer`)

          setAveragePercentage((prev) => Math.round( (prev + percentageSimilar) / (totalQuestionIndex + 1) ));

          if(group.games_genre == 'flashcards' && difficulty !== undefined){
            setAnswers((prevAnswers) => {
              const currentAnswer: UserAnswer = {
                answer: updatedFilledAnswer,
                percentage_correct: percentageSimilar,
                difficulty: difficulty,
              };
              return [...prevAnswers, currentAnswer];
            });

          } else {
            //? Is quiz
            setAnswers((prevAnswers) => {
              const currentAnswer: UserAnswer = {
                answer: updatedFilledAnswer,
                percentage_correct: percentageSimilar,
              };
              return [...prevAnswers, currentAnswer];
            });
          }

          
          if (questionIndex === game.questions.length - 1) {
            if (gameIndex === group.games.length - 1) {
              setHasEnded(true)
              return;
            }
            if(group.games_genre == 'quizzes'){
              setQuestionIndex(0)
            }
            setGameIndex((gameIndex) => gameIndex + 1)
          }

          if(group.games_genre == 'quizzes' && questionIndex > game.questions.length - 1) {
            setQuestionIndex((prev) => prev + 1);
          }
          setTotalQuestionIndex((prev) => prev + 1)

          if(group.games_genre == 'flashcards' && difficulty !== undefined){
            setPickDifficulty(false)
            setDifficulty(undefined)
          }
          
        }
      },
      onError: (error) => {
        console.error(error);
        toast.error("Something went wrong")
      },
    });
  }, [checkAnswer, questionIndex, endGame, answers, group.games_genre, game.questions.length, filledAnswer, pickDifficulty, difficulty, gameIndex]);


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
          <div className={css._accuracy}>
            <Image src={Accuracy} width={38} height={38} alt="" />
            <span>{averagePercentage} <span>%</span> </span>
          </div>
        </div>

      </div>

      <div className={`${css.quiz_question} card`}>
        <div className={css.quiz_question_no}>
          <span>{totalQuestionIndex + 1}</span>
          <span>{totalQuestionsCount}</span>
        </div>

        <p>{currentQuestion?.question}</p>
      </div>

      <div className="quiz-options">

        <BlankAnswerInput 
          setBlankAnswer={setBlankAnswer}
          answer={currentQuestion.answer}
          mode={game.game_mode}
        />

      </div>


      {!pickDifficulty && <button className="btn-primary" disabled={isChecking} onClick={() => group.games_genre == 'quizzes' ? handleNext() : handleNextFlashcard()}>Next question</button> }

    </section>
  )
}

export default OpenEnded