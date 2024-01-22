"use server"

import Collections from "@components/Collections"
import { getGroups } from "@lib/actions/group.actions"
import { redirect } from "next/navigation"


const CollectionsPage = async () => {
  
  let groups

  try {
    groups = await getGroups('collection')
  } catch (error:any) {
    console.log(error.message)
    redirect('/')
  }

  if(!groups) return null;

  return (
    <Collections groups={groups} />
  )
}

export default CollectionsPage