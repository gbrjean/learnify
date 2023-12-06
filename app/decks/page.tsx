"use server"

import Decks from "@components/Decks"
import { getGroups } from "@lib/actions/group.actions"


const DecksPage = async () => {

  let groups

  try {
    groups = await getGroups('deck')
  } catch (error:any) {
    console.log(error.message)
  }

  return (
    <Decks groups={groups} />
  )
}

export default DecksPage