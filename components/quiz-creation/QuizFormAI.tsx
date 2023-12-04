import { useFormContext, Controller } from "react-hook-form"

const QuizFormAI = ({onSubmit} : {onSubmit: () => void}) => {

  const { control, getValues, setValue, formState, trigger } = useFormContext();

  return (
    <>

    <div className="card-header">
      <h1>Create Quiz with AI</h1>
      <span>Choose a topic</span>
    </div>

    <div className="input-wrapper">
      <span className="input-title">Topic</span>
      <Controller
        name="topic"
        control={control}
        render={({ field }) => (
          <input 
            type="text" 
            placeholder="Enter a topic" 
            onChange={field.onChange}
          />
        )}
      />
      {formState.errors.topic 
        ? <p className="error">{formState.errors.topic.message as string}</p>
        : <p>Please provide any topic you would like to be quizzed on here.</p> 
      }
    </div>

    
    <div className="input-wrapper">
      <span className="input-title">Number of Questions</span>
      <Controller
        name="questions_no"
        control={control}
        render={({ field }) => (
          <input 
            type="number" 
            min={1}
            max={10}
            placeholder="Enter number" 
            onChange={(e) => {
              setValue("questions_no", e.target.value == '' ? 0 : parseInt(e.target.value) )  
              trigger("questions_no")
            }}
          />
        )}
      />
      {formState.errors.questions_no 
        ? <p className="error">{formState.errors.questions_no.message as string}</p>
        : <p>Please provide the number of questions.</p> 
      }
    </div>

    
    <div className="card-ctas">
      <button 
        className={getValues("type") == 'mcq' ? "btn-active" : "btn-gray-full"}
        onClick={() => setValue("type", "mcq")}
      >
        Multiple Choice
      </button>
      <button 
        className={getValues("type") == 'open-ended' ? "btn-active --active" : "btn-blue"}
        onClick={() => setValue("type", "open-ended")}
      >
        Open Ended
      </button>
    </div>

    <button className="btn-primary" onClick={onSubmit}>Submit</button>

    </>
  )
}

export default QuizFormAI