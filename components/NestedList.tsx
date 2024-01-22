"use client"

import { useState } from "react"
import Image from "next/image"
import Clock from "@public/assets/images/clock-white.png"
import { DeleteIcon } from "@public/assets/icons/DeleteIcon"
import QuizListItem from "@components/QuizListItem"
import { deleteGroup } from "@lib/actions/group.actions"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Play } from "@public/assets/icons/Play"
import { toast } from "react-toastify"

const NestedList = ({
  group: {
    _id,
    title,
    created_at,
    games
  },
  groupType,
}: {group: any; groupType?: 'collection' | 'deck'}) => {

  const pathname = usePathname()

  const [open, setOpen] = useState(false)

  const handleDeleteGroup = async () => {
    try {
      await deleteGroup(_id, pathname)
    } catch (error: any) {
      toast.error("Couldn't delete the group")
    }
  }

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

        <div className="nested-list-actions">
          { groupType && games && games.length !== 0 &&   
            <Link href={`/play/${groupType}/${_id}`} className="cta">
              <Play />
            </Link>
          }
          <div className="cta" onClick={() => handleDeleteGroup()}>
            <DeleteIcon />
          </div>
        </div>
      </div>
      
      <div className={open ? "expandable-wrapper --active" : "expandable-wrapper"}>
        <div className="list expandable-wrapper-content">
          
          { games && games.length === 0 ? (
              <span>The list is empty</span>
          ) : (
            games.map( (game: any) => <QuizListItem data={game} groupId={_id} /> )
          )}
          
          
        </div>
      </div>

    </div>
  )
}

export default NestedList