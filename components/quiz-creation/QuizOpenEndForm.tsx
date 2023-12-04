"use client"

import { hasBlankWords, hasEmptyFields } from "@lib/utils";
import { useEffect, useState } from "react";
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
      <span className="input-title">Answer</span>
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
};


const QuizOpenEndForm = ({onSubmit} : {onSubmit: () => void}) => {

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

  const handleAddQuestion = () => {
    if(Object.keys(formState.errors).length === 0 
        && !hasEmptyFields(getValues())
    ){
      checkBlankWords()

    } else {
      console.log("complete all fields")
      //TODO: toast error
    }
  };

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
    // removeQuestion(0)
    appendQuestion({ question: '', answers: [{ answer: '' }], correct_answer: 0 });
  }, [])



  return (
    <>

    <div className="card-header">
      <h1>Create Open Ended Quiz</h1>
      <span>Set the questions and answers</span>
    </div>

    { questions[selectedQuestionIndex] &&       
      <QuestionInput
  
        key={`questionInput_${selectedQuestionIndex}`}
        questionIndex={selectedQuestionIndex}
      />
    }
    
    {/* <div className="input-wrapper">
      <span className="input-title">Question 1</span>
      <Controller
        name="questionINDEX"
        control={control}
        render={({ field }) => (
          <input 
            type="text" 
            placeholder="Enter the question" 
            onChange={field.onChange}
          />
        )}
      />
      <p>Please provide any question.</p>
    </div> */}

    {/* <div className="input-wrapper">
      <span className="input-title">Answer 1</span>
      <Controller
        name="answerINDEX"
        control={control}
        render={({ field }) => (
          <input 
            type="text" 
            placeholder="Enter the answer" 
            onChange={field.onChange}
          />
        )}
      />
      <p dangerouslySetInnerHTML={{__html:
        `Please provide the answer. <br />
          To mask words, write them between a < and a > <br />
          Eg: This is a < masked answer> <br />
          Will display: This is a ______ _____ <br />
        `
      }} />
    </div> */}

    {blankWordsError && <p className="error">The answer must contain hidden words. See the instructions below</p>}
    
    <div className="card-ctas -spaced">
      <div>
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
  )
}

export default QuizOpenEndForm