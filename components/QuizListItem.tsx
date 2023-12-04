"use client"

import Image from 'next/image'
import Link from "next/link"
import Multiple from "@public/assets/images/MultipleQuiz.png"
import Open from "@public/assets/images/OpenQuiz.png"
import Flashcard from "@public/assets/images/Flashcard.png"
import Clock from "@public/assets/images/clock-white.png"
import { DeleteIcon } from '@public/assets/icons/DeleteIcon'

const QuizListItem = () => {
  return (
    <div className="list-item">
      <Image src={Open} alt="" />

      <div className="list-item-content">
        <Link href={`/load/quiz/QUIZ_id`} className="list-item-title">
          Web dev
        </Link>
        <div className="list-item-date">
          <Image src={Clock} alt="" />
          <span>02/10/2023</span>
        </div>
        <div className="list-item-type">
          Multiple Choice | Yourself
        </div>
      </div>

      <div className="list-item-action cta" onClick={() => {}}>
        <DeleteIcon />
      </div>

    </div>
  )
}

export default QuizListItem