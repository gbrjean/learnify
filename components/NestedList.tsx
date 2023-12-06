"use client"

import { useState } from "react"
import Image from "next/image"
import Clock from "@public/assets/images/clock-white.png"
import { DeleteIcon } from "@public/assets/icons/DeleteIcon"
import QuizListItem from "@components/QuizListItem"

const NestedList = ({
  group: {
    _id,
    title,
    created_at,
    games
  }
}: {group: any}) => {

  const [open, setOpen] = useState(false)

  return (
    <div className="nested-list">

      <div className="nested-list-header">
        <div className="nested-list-content" onClick={() => setOpen(prev => !prev)}>
          <span className="nested-list-content-title">{title}</span>
          <div className="list-item-date">
            <Image src={Clock} alt="" />
            <span>{created_at}</span>
          </div>
        </div>

        <div className="list-item-action cta" onClick={() => {}}>
          <DeleteIcon />
        </div>
      </div>
      
      <div className={open ? "expandable-wrapper --active" : "expandable-wrapper"}>
        <div className="list expandable-wrapper-content">
          
          { games && games.length === 0 ? (
              <span>The list is empty</span>
          ) : (
            games.map( (game: any) => <QuizListItem game={game} groupId={_id} /> )
          )}
          
          
        </div>
      </div>

    </div>
  )
}

export default NestedList