"use server"

import Summary from "@components/Summary";
import { fetchSummary } from "@lib/actions/game.actions";
import { getCurrentUser } from "@lib/actions/user.actions";
import { sanitizeAnswer } from "@lib/utils";
import { SummaryType, TableData } from "@types";
import { redirect } from "next/navigation"


type GroupQuestions = {
  question: string;
  correct_answer: string;
}[];

const SummaryPage = async ({ params }: { params: { id: string } }) => {

  if(!params.id) return null;

  const session = await getCurrentUser()
  if(!session?.user) return null;

  let summary: SummaryType | null = null

  try {
    summary = await fetchSummary(params.id) as SummaryType | null
    console.log(summary)
  } catch (error: any) {
    console.log(error.message)
    redirect('/')
  }

  if(!summary) return null;

  let tableData: TableData | null = null

  if('group_id' in summary.table_data){
    summary.table_data.questions = summary.table_data.questions.reduce((acc, item) => {
      if (Array.isArray(item.question) && Array.isArray(item.correct_answer)){
        item.question.forEach((question, index) => {
          acc.push({
            question,
            correct_answer: item.correct_answer[index],
          });
        });
      }
      return acc;
    }, [] as GroupQuestions);
  }


  if(summary.table_data.summary_type == 'mcq'){
    //? MCQ
    let correctAnswers: number[] = []

    if(summary.table_data.answers[0].is_correct !== undefined) {
      summary.table_data.answers.forEach((answer, ansIndex) => {
        if(answer.is_correct){
          correctAnswers.push(ansIndex+1)
        }
      })
      console.log(correctAnswers)
    }

    tableData = {
      isSummary: true,
      isMCQ: true,
      titles: ['Question & Correct answer', 'Your answer'],
      elements: summary.table_data.questions.map((question, index) => [
        `${question.question} @ ${question.correct_answer}`,
        summary!.table_data.answers[index].answer
      ]),
      correct_answers: correctAnswers,
    }

  }

  if(summary.table_data.summary_type == 'open-ended'){
    //? Open-ended ( isMCQ false )
    tableData = {
      isSummary: true,
      isMCQ: false,
      titles: ['Question & Correct answer', 'Your answer', 'Accuracy'],
      elements: summary.table_data.questions.map((question, index) => [
        `${question.question} @ ${sanitizeAnswer(question.correct_answer as string)}`,
        summary!.table_data.answers[index].answer,
        `${summary!.table_data.answers[index].percentage_correct!}%`
      ]),
    }
  }

  if(!tableData){
    redirect('/')
  }

  return (
    <Summary
      tableData={tableData}
      timeTaken={summary.time_taken}
      bestTime={summary.best_time}
      avgAccuracy={summary.average_accuracy !== undefined ? summary.average_accuracy : undefined}
    />
  )
}

export default SummaryPage