"use client"

import { hasBlankWords, hasEmptyFields } from "@lib/utils";
import { useEffect, useState } from "react";
import { useFormContext, Controller, useFieldArray } from "react-hook-form"
import { toast } from "react-toastify";
import css from '@styles/creation/creation.module.scss'

interface AnswerInputProps {
  questionIndex: number;
  answerIndex: number;
}

interface QuestionInputProps {
  questionIndex: number;
}


const AnswerInput = ({ questionIndex, answerIndex }: AnswerInputProps) => {
  const { control, formState } = useFormContext();

  const answerErrors = formState.errors.questions as Record<string, any>[] | undefined;
  const answerError =
    answerErrors &&
    answerErrors[questionIndex]?.answers &&
    answerErrors[questionIndex]?.answers[answerIndex]?.answer;

  return (
    <div className={css.input_wrapper}>
      <span className={css.input_title}>Answer</span>
      <Controller
        name={`questions[${questionIndex}].answers[${answerIndex}].answer`}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <input
            {...field}
            type="text"
            placeholder="Enter the answer"
            onChange={field.onChange}
          />
        )}
      />
      { answerError 
          ? <p className="error">{answerError.message as string}</p>
          : <p>Please provide the answer.</p>
      }

      <p dangerouslySetInnerHTML={{__html:
        `To mask words, write them between a < and a > <br />
         Eg: This is a <masked answer> <br />
         Will display: This is a ______ _____ <br />
        `
      }} />
    </div>
  );
};


const QuestionInput = ({ questionIndex }: QuestionInputProps) => {

  const { control, formState } = useFormContext();
  const { fields: answers } = useFieldArray({
    control,
    name: `questions[${questionIndex}].answers`,
  });

  const questionErrors = formState.errors.questions as Record<string, any>[] | undefined;
  const questionError = questionErrors && questionErrors[questionIndex]?.question;
  

  return (
    <>
    <div className={css.input_wrapper}>
      <span className={css.input_title}>Question {questionIndex+1}</span>
      <Controller
        name={`questions[${questionIndex}].question`}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <input
            {...field}
            type="text"
            placeholder="Enter the question"
            onChange={field.onChange}
          />
        )}
      />

      {questionError
        ? <p className="error">{questionError.message as string}</p>
        : <p>Please provide any question.</p> 
      }
    </div>

    <div className={css.input_answers}>
      {answers.map((_, index) => (
        <AnswerInput
          key={`question${questionIndex}_answer${index}`}
          questionIndex={questionIndex}
          answerIndex={index}
        />
      ))}
    </div>
    </>
  );
};


const FlashcardOpenEndForm = ({onSubmit} : {onSubmit: () => void}) => {

  const { control, formState, getValues } = useFormContext();
  const { fields: questions, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: 'questions',
  });

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [isFinishing, setIsFinishing] = useState(false)

  const [blankWordsError, setBlankWordsError] = useState<boolean | undefined>(undefined)
  const [checkFlag, setCheckFlag] = useState(false);

  const checkBlankWords = () => {
    const answer = getValues(`questions[${selectedQuestionIndex}].answers[0].answer`)
    if(!hasBlankWords(answer)){
      setBlankWordsError(true)
    } else{
      setBlankWordsError(false)
    }

    setCheckFlag(prev => !prev);
  }

  // const handleAddQuestion = () => {
  //   if(Object.keys(formState.errors).length === 0 
  //       && !hasEmptyFields(getValues())
  //   ){
  //     checkBlankWords()

  //   } else {
  //     console.log("complete all fields")
  //     toast.error("Please complete all fields")
  //   }
  // };

  const handleFinish = () => {
    setIsFinishing(true)
    checkBlankWords()
  }

  useEffect(() => {

    if(blankWordsError !== undefined) {
      if(!isFinishing && !blankWordsError){
        appendQuestion({ question: '', answers: [{ answer: '' }], correct_answer: 0 });
        setSelectedQuestionIndex(prev => prev+1)
      }

      if(isFinishing && !blankWordsError){
        onSubmit()
      }
    }
  }, [checkFlag])

  
  useEffect(() => {
    appendQuestion({ question: '', answers: [{ answer: '' }], correct_answer: 0 });
  }, [])


  return (
    <>

    <div className={css.card_header}>
      <h1>Create Open Ended Flashcard</h1>
      <span>Set the questions and answers</span>
    </div>

    { questions[selectedQuestionIndex] &&       
      <QuestionInput
        key={`questionInput_${selectedQuestionIndex}`}
        questionIndex={selectedQuestionIndex}
      />
    }
    
    
    <div className={`${css.card_ctas} ${css._spaced}`}>
      <div>
      </div>

      <button className="btn-primary" onClick={handleFinish}>Finish</button>
    </div>

    </>
  )
}

export default FlashcardOpenEndForm