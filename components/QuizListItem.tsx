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


const QuizListItem = ({
  game: {
    _id,
    topic,
    game_type,
    game_genre,
    game_mode,
    created_at,
  },
  groupId,
}: {game: any, groupId: string}) => {

  const pathname = usePathname()

  const handleDeleteFromGroup = async () => {
    try {
      await deleteGameFromGroup(_id, groupId, pathname)
    } catch (error: any) {
      console.log(`Error deleting game: ${error.message}`)
    }
  }
  

  return (
    <div className="list-item">
      <Image src={game_genre == 'flashcard' ? Flashcard : (game_type == 'mcq' ? Multiple : Open)} alt="" />

      <div className="list-item-content">
        <Link href={`/play/quiz/${_id}`} className="list-item-title">
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

      <div className="list-item-action cta" onClick={() => handleDeleteFromGroup()}>
        <DeleteIcon />
      </div>

    </div>
  )
}

export default QuizListItem