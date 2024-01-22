"use server"

import Table from "@components/Table"
import { fetchGamesList } from "@lib/actions/game.actions"
import { getGroups } from "@lib/actions/group.actions"
import { TableData } from "@types"
import { redirect } from "next/navigation"

const Flashcards = async () => {

  let games
  let groups

  try {
    games = await fetchGamesList('flashcard')
  } catch (error) {
    redirect('/')
  }

  if(!games) return null;

  if(games.length === 0){
    return (
      <section>
        <h1>List of Flashcards</h1>
        <p>No flashcards created</p>
      </section>
    )
  }

  try {
    groups = await getGroups('deck', 'summary')
  } catch (error) {}


  const tableData: TableData = {
    titles: ['Date created', 'Type', 'Method', 'Questions'],
    topics: games.map(game => game.topic),
    topic_icons: games.map(game => 
      game.game_genre == 'flashcard'
        ? 'flashcard'
        : (game.game_type == 'mcq' ? 'multiple' : 'open')
    ),
    elements: games.map(game => [
      game.created_at, 
      game.game_type == 'mcq' ? 'Multiple Choice' : 'Open Ended', 
      game.game_mode == 'AI' ? 'With AI' : 'Yourself', 
      game.questionsCount
    ]),
    ids: games.map(game => game._id),
    topicAsLink: true,
    ctaFunctions: ['deleteGame', 'addGame']
  }

  return (
    <section>
      <h1>List of Flashcards</h1>

      <Table data={tableData} groups={groups} groupsFor={'decks'} pageRedirectFor="play" />

    </section>
  )
}

export default Flashcards