import { useFormContext, Controller } from "react-hook-form"

type Props = {
  nextStep: () => void;
}

const FlashcardTypeForm = ({nextStep} : Props) => {

  const { control, getValues, setValue, formState, trigger } = useFormContext();

  return (
    <>

    <div className="card-header">
      <h1>Create Flashcard</h1>
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


    <button className="btn-primary" onClick={() => { trigger("topic"); nextStep() }}>Next</button>

    </>
  )
}

export default FlashcardTypeForm