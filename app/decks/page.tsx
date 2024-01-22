"use server"

import Decks from "@components/Decks"
import { getGroups } from "@lib/actions/group.actions"
import { redirect } from "next/navigation"


const DecksPage = async () => {

  let groups

  try {
    groups = await getGroups('deck')
  } catch (error:any) {
    console.log(error.message)
    redirect('/')
  }

  if(!groups) return null;

  return (
    <Decks groups={groups} />
  )
}

export default DecksPage