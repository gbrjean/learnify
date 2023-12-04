"use client"

import { InfoIcon } from "@public/assets/icons/InfoIcon"
import { useState } from "react"


const Info = ({text} : {text: string}) => {

  const [open, setOpen] = useState(false)

  return (
    <div className="info" 
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <InfoIcon />
      { open &&
          <div className="info-popup">
            {text}
          </div>
      }
    </div>
  )
}

export default Info