"use client"

import css from'@styles/creation/creation.module.scss'
import FlashcardTypeForm from '@components/flashcard-creation/FlashcardTypeForm'
import FlashcardMCQForm from '@components/flashcard-creation/FlashcardMCQForm'
import FlashcardOpenEndForm from '@components/flashcard-creation/FlashcardOpenEndForm'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FlashcardValidation } from '@lib/validations/flashcard.validation'
import { hasEmptyFields } from '@lib/utils'
import { createGame } from '@lib/actions/game.actions'
import { toast } from 'react-toastify'


const CreateFlashcard = () => {

  const router = useRouter()

  const FORM_STEPS = 3
  const [formStep, setFormStep] = useState(0)

  type FormData = z.infer<typeof FlashcardValidation>
  const resolver = zodResolver(FlashcardValidation)
  
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
    try {
      const gameId = await createGame(data, false, 'flashcard')
      router.push(`/play/${gameId}`);

    } catch (error) {
      console.log(error)
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


  return (
    <section className={`card ${css.card}`}>
      <FormProvider {...methods}>

        { formStep === 0 && <FlashcardTypeForm nextStep={nextStep} /> }
        { formStep === 1 && (
            methods.getValues("type") == "mcq"
              ? <FlashcardMCQForm onSubmit={methods.handleSubmit(onSubmit)}/>
              : <FlashcardOpenEndForm onSubmit={methods.handleSubmit(onSubmit)} />
        )}

      </FormProvider>
    </section>
  )
}

export default CreateFlashcard