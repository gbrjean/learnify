"use client"

import Image from 'next/image'
import Link from "next/link"
import Multiple from "@public/assets/images/MultipleQuiz.png"
import Open from "@public/assets/images/OpenQuiz.png"
import Flashcard from "@public/assets/images/Flashcard.png"
import Clock from "@public/assets/images/clock-white.png"
import { DeleteIcon } from '@public/assets/icons/DeleteIcon'
import { deleteGameFromGroup } from '@lib/actions/group.actions'
import { usePathname } from "next/navigation";
import { toast } from 'react-toastify'
import { deleteGameHistory } from '@lib/actions/game.actions'


const QuizListItem = ({
  data: {
    _id,
    play_id,
    history_type,
    topic,
    game_type,
    game_genre,
    game_mode,
    created_at,
  },
  groupId,
}: {data: any, groupId?: string}) => {

  const pathname = usePathname()

  const handleDeleteFromGroup = async () => {
    try {
      if(groupId){
        await deleteGameFromGroup(_id, groupId, pathname)
      }
    } catch (error: any) {
      console.log(`Error deleting game: ${error.message}`)
      toast.error("Couldn't delete the game from the group")
    }
  }

  const handleDeleteFromGameHistory = async () => {
    try {
      await deleteGameHistory(_id, pathname)
    } catch (error: any) {
      console.log(`Error deleting activity: ${error.message}`)
      toast.error("Couldn't delete the activity")
    }
  }
  

  return (
    <div className="list-item">
      <Image src={
        (game_genre == 'flashcard' || game_genre == 'flashcards') 
          ? Flashcard 
          : (game_type == 'mcq' ? Multiple : Open)
      } alt="" />

      <div className="list-item-content">
        <Link 
          href={
            history_type 
              ? (
                  history_type == 'collections' 
                    ? `/play/collection/${play_id}` 
                    : `/play/deck/${play_id}` 
                ) 
              : (
                play_id
                  ? `/play/${play_id}`
                  : `/play/${_id}`
              )
          } 
          className="list-item-title"
        >
          {topic}
        </Link>
        <div className="list-item-date">
          <Image src={Clock} alt="" />
          <span>{created_at}</span>
        </div>
        <div className="list-item-type">
          { game_type == 'mcq' ? 'Multiple Choice | ' : 'Open Ended | ' } 
          { game_mode == 'AI' ? 'With AI' : 'Yourself' }
        </div>
      </div>

      <div className="list-item-action cta" onClick={() => { groupId ? handleDeleteFromGroup() : handleDeleteFromGameHistory() } }>
        <DeleteIcon />
      </div>

    </div>
  )
}

export default QuizListItem