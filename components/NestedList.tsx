"use client"

import { useState } from "react"
import Image from "next/image"
import Clock from "@public/assets/images/clock-white.png"
import { DeleteIcon } from "@public/assets/icons/DeleteIcon"
import QuizListItem from "@components/QuizListItem"

const NestedList = () => {

  const [open, setOpen] = useState(false)

  return (
    <div className="nested-list">

      <div className="nested-list-header">
        <div className="nested-list-content" onClick={() => setOpen(prev => !prev)}>
          <span className="nested-list-content-title">Web design</span>
          <div className="list-item-date">
            <Image src={Clock} alt="" />
            <span>02/10/2023</span>
          </div>
        </div>

        <div className="list-item-action cta" onClick={() => {}}>
          <DeleteIcon />
        </div>
      </div>
      
      <div className={open ? "expandable-wrapper --active" : "expandable-wrapper"}>
        <div className="list expandable-wrapper-content">
          <QuizListItem />
          <QuizListItem />
          <QuizListItem />
          <QuizListItem />
          <QuizListItem />

          <QuizListItem />
          <QuizListItem />
          <QuizListItem />
        </div>
      </div>

    </div>
  )
}

export default NestedList