"use server"

import Table from "@components/Table"
import { fetchGamesList } from "@lib/actions/game.actions"
import { TableData } from "@types"
import { redirect } from "next/navigation"

const Flashcards = async () => {

  let games

  try {
    games = await fetchGamesList('flashcard')
  } catch (error) {
    redirect('/')
  }

  if(!games){
    return (
      <section>
        <h1>List of Flashcards</h1>
        <p>No flashcards created</p>
      </section>
    )
  }

  // const tableData: TableData = {
  //   titles: ['Date created', 'Type', 'Method', 'Questions'],
  //   topics: ['HTML flexbox property', 'HTML flexbox property'],
  //   elements: [
  //     ['02/10/2023', 'Multiple Choice', 'Yourself', 5],
  //     ['02/10/2023', 'Multiple Choice', 'Yourself', 5]
  //   ],
  //   ids: ['sd1sdads', 'sadyg1sda'],
  // }

  const tableData: TableData = {
    titles: ['Date created', 'Type', 'Method', 'Questions'],
    topics: games.map(game => game.topic),
    elements: games.map(game => [
      game.created_at, 
      game.game_type == 'mcq' ? 'Multiple Choice' : 'Open Ended', 
      game.game_mode == 'AI' ? 'With AI' : 'Yourself', 
      game.questionsCount
    ]),
    ids: games.map(game => game._id),
    topicAsLink: true,
  }

  return (
    <section>
      <h1>List of Flashcards</h1>

      <Table data={tableData} />

    </section>
  )
}

export default Flashcards