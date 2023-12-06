"use server"

import Collections from "@components/Collections"
import { getGroups } from "@lib/actions/group.actions"


const CollectionsPage = async () => {
  
  let groups

  try {
    groups = await getGroups('collection')
  } catch (error:any) {
    console.log(error.message)
  }

  return (
    <Collections groups={groups} />
  )
}

export default CollectionsPage