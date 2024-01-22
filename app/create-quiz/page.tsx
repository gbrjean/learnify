"use client"

import QuizFormAI from '@components/quiz-creation/QuizFormAI'
import QuizMCQForm from '@components/quiz-creation/QuizMCQForm'
import QuizTypeForm from '@components/quiz-creation/QuizTypeForm'
import css from '@styles/creation/creation.module.scss'
import { useEffect, useState } from 'react'
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { QuizWithAiValidation, QuizManualValidation } from '@lib/validations/quiz.validation'
import QuizOpenEndForm from '@components/quiz-creation/QuizOpenEndForm'
import { hasEmptyFields } from '@lib/utils'
import QuizLoader from '@components/quiz-creation/QuizLoader'
import { createGame } from '@lib/actions/game.actions'
import { useRouter } from "next/navigation"
import { toast } from 'react-toastify'
import { useSearchParams } from 'next/navigation'

type FormSchema = 
 | typeof QuizWithAiValidation
 | typeof QuizManualValidation


const CreateQuiz = () => {

  const searchParams = useSearchParams()
  const topicParam = searchParams.get('topic')

  const FORM_STEPS = 3

  const router = useRouter()

  const [showLoader, setShowLoader] = useState(false)
  const [finished, setFinished] = useState(false)

  const [formStep, setFormStep] = useState(0)
  const [isQuizAI, setIsQuizAI] = useState<boolean | undefined>(undefined)


  const [formSchema, setFormSchema] = useState<FormSchema>(
    isQuizAI 
      ? QuizWithAiValidation 
      : QuizManualValidation
  )

  useEffect(() => {
    setFormSchema(isQuizAI ? QuizWithAiValidation : QuizManualValidation);
  }, [isQuizAI]);


  type FormData = z.infer<typeof formSchema>
  const resolver = zodResolver(formSchema)
  
  const methods = useForm<FormData>({
    resolver,
    mode: 'all',
    defaultValues: {
      type: 'mcq'
    },
  });

  const nextStep = () => {
    if(formStep+1 <= FORM_STEPS 
      && Object.keys(methods.formState.errors).length === 0
      && !hasEmptyFields(methods.getValues())
    ){
      setFormStep(prev => prev+1)
    }
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setShowLoader(true)
    try {
      if(isQuizAI !== undefined){
        const gameId = await createGame(data, isQuizAI, 'quiz')
        setFinished(true);

        setTimeout(() => {
         router.push(`/play/${gameId}`);
        }, 2000);
      }

    } catch (error) {
      console.log(error)
      setShowLoader(false)
      toast.error("Game creation failed")
    }

  }

    //? DEBUGGING
    useEffect(() => {
      // console.log(methods.formState.errors)
      console.log(JSON.stringify(methods.watch(), null, 2));
      // if(Object.keys(methods.formState.errors).length !== 0){
      //   console.log("errors")
      // } else {
      //   console.log("no errs")
      // }
    }, [methods.watch()])


    useEffect(() => {
      if(topicParam){
        setIsQuizAI(true)
        nextStep()
      }
    }, [])
    


  
  if(showLoader){
    return <QuizLoader finished={finished} />
  }

  return (
    <section className={`card ${css.card}`}>
      <FormProvider {...methods}>

        { formStep === 0 &&
          <>

          <div className={css.card_header}>
            <h1>Quiz Creation</h1>
            <span>Choose how to create the quiz</span>
          </div>

          <div className={css.card_ctas}>
            <button 
              className="btn-primary"
              onClick={() => {
                setIsQuizAI(true)
                nextStep()
              }}
            >
              Create with AI
            </button>
            <button 
              className="btn-blue"
              onClick={() => {
                setIsQuizAI(false)
                nextStep()
              }}
            >
              Create yourself
            </button>
          </div>
          
          </>
        }

        { formStep === 1 && isQuizAI && <QuizFormAI onSubmit={methods.handleSubmit(onSubmit)} topicParam={topicParam} />}
        { formStep === 1 && !isQuizAI && <QuizTypeForm nextStep={nextStep} />}
        { formStep === 2 && (
            methods.getValues("type") == "mcq"
              ? <QuizMCQForm onSubmit={methods.handleSubmit(onSubmit)}/>
              : <QuizOpenEndForm onSubmit={methods.handleSubmit(onSubmit)}/>
        )}


      </FormProvider>
    </section>
  )
}

export default CreateQuiz