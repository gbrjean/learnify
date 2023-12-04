"use client"

import { hasEmptyFields } from "@lib/utils";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { useFormContext, Controller, useFieldArray } from "react-hook-form"


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
    <div className="input-wrapper">
      <span className="input-title">Answer {answerIndex+1}</span>
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
      {answerIndex === 0 ? (
        answerError
          ? <p className="error">{answerError.message as string}</p>
          : <p>Please provide the first answer for the above question.</p> 
      ) : (
        answerError && <p className="error">{answerError.message as string}</p>
      )}
    </div>
  );
};


const QuestionInput = forwardRef(({ questionIndex }: QuestionInputProps, ref) => {

  const { control, formState } = useFormContext();
  const { fields: answers, append: appendAnswer } = useFieldArray({
    control,
    name: `questions[${questionIndex}].answers`,
  });

  const questionErrors = formState.errors.questions as Record<string, any>[] | undefined;
  const questionError = questionErrors && questionErrors[questionIndex]?.question;
  
  const handleAddAnswer = () => {
    appendAnswer({ answer: '' }); // Add an empty answer
  };

  useImperativeHandle(ref, () => ({
    handleAddAnswer // Expose handleAddAnswer via ref
  }));


  return (
    <>
    <div className="input-wrapper">
      <span className="input-title">Question {questionIndex+1}</span>
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

    <div className="input-answers">
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
});




const FlashcardMCQForm = ({onSubmit} : {onSubmit: () => void}) => {

  const { control, setValue, formState, getValues, trigger } = useFormContext();
  const { fields: questions, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: 'questions',
  });

  
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [isFinishing, setIsFinishing] = useState(false)


  const handleAddQuestion = () => {
    if(Object.keys(formState.errors).length === 0 
        && !hasEmptyFields(getValues())
    ){
      setChooseAnswers(true)
      
      appendQuestion({ question: '', answers: [{ answer: '' }, { answer: '' }], correct_answer: 0 });
      setSelectedQuestionIndex(prev => prev+1)
    } else {
      console.log("complete all fields")
      //TODO: toast error
    }
  };
  
  const childRef = useRef<{ handleAddAnswer: () => void } | null>(null);
  
  const handleRefAddAnswer = () => {
    if (childRef.current) {
      childRef.current.handleAddAnswer(); // Call handleAddAnswer from the child component
    }
  };
  
  const [chooseAnswers, setChooseAnswers] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(undefined)
  const [lastAnswers, setLastAnswers] = useState<[] | null>(null)
  const [hasCorrectAnsError, setHasCorrectAnsError] = useState(false)
  

  const changeCorrectAnswer = () => {
    if(selectedAnswer !== undefined) {
      if(!isFinishing){
        setValue(`questions[${selectedQuestionIndex-1}].correct_answer`, selectedAnswer+1);
        trigger(`questions[${selectedQuestionIndex-1}]`)
      } else{
        setValue(`questions[${selectedQuestionIndex}].correct_answer`, selectedAnswer+1);
        trigger(`questions[${selectedQuestionIndex}]`)

        onSubmit()
      }

      if(hasCorrectAnsError){
        setHasCorrectAnsError(false)
      }

      setChooseAnswers(false)
      setSelectedAnswer(undefined)
    } else{
      setHasCorrectAnsError(true)
    }
  }

  const handleFinish = () => {
    setIsFinishing(true)
    setChooseAnswers(true)
  }
  
  useEffect(() => {
    if(selectedQuestionIndex === 0 && getValues(`questions[${selectedQuestionIndex}].answers`)){
      setLastAnswers(getValues(`questions[${selectedQuestionIndex}].answers`))
    } else if(getValues(`questions[${selectedQuestionIndex-1}].answers`)) {
      setLastAnswers(getValues(`questions[${selectedQuestionIndex-1}].answers`))
    }
  }, [selectedQuestionIndex, questions])



  useEffect(() => {
    removeQuestion(0)
    appendQuestion({ question: '', answers: [{ answer: '' }, { answer: '' }], correct_answer: 0 });
  }, [])
  


  return (
    <>

    <div className="card-header">
      <h1>Create Multiple Choice Flashcard</h1>
      { !chooseAnswers 
        ? <span>Set the questions and answers</span>
        : <span>Which is the correct answer for the previous question?</span>
      }
    </div>
    
    { !chooseAnswers ? (
      <>

      { questions[selectedQuestionIndex] &&       
        <QuestionInput
          ref={childRef}
          key={`questionInput_${selectedQuestionIndex}`}
          questionIndex={selectedQuestionIndex}
        />
      }
        
      <div className="card-ctas -spaced">
        <div>
          <button 
            className="btn-gray"
            onClick={handleRefAddAnswer}
          >
            New answer
          </button>
          <button 
            className="btn-blue"
            onClick={handleAddQuestion}
          >
            Next question
          </button>
        </div>

        <button className="btn-primary" onClick={handleFinish}>Finish</button>
      </div>
      </>
    ) : (

      <>
      <div className="quiz-options">
        {lastAnswers && lastAnswers.map((object: any, key: number) => (
            <div 
            key={object.id}
            className={selectedAnswer === key ? "quiz-answer card --selected" : "quiz-answer card"}
            onClick={() => setSelectedAnswer(key)}
          >
            <div className="quiz-answer-no">
              <span>{key+1}</span>
            </div>
            <span>{object.answer}</span>
          </div>
        ))}
      </div>

      {hasCorrectAnsError && <p className="error">You must select an answer for the previous question</p>}

      <button 
        className="btn-primary"
        onClick={changeCorrectAnswer}
      >
        Continue
      </button>

      </>

    )}
    </>
  )
}

export default FlashcardMCQForm