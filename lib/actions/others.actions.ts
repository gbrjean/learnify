"use server"

import { connectToDB } from "@lib/mongoose"
import { getCurrentUser } from "@lib/actions/user.actions";
import PopularTopics from "@lib/models/populartopics.model";
import Group from "@lib/models/group.model";
import { fetchHistoryList } from "@lib/actions/game.actions";

export async function fetchPopularTopics(){
  try {
    const session = await getCurrentUser()
    if(!session?.user){
      throw new Error('You must be logged in')
    }

    connectToDB()

    const topics = await PopularTopics.find({}).exec()

    if(topics.length === 0){
      return null
    }

    return topics
    
  } catch (error) {
    console.log('Error fetching popular topics', error)
    throw new Error('Error fetching popular topics')
  }
}

export async function fetchHomepage(){
  try {
    const topics = await fetchPopularTopics()
    const history = await fetchHistoryList(undefined, undefined, true) //? ALL mode True

    return { topics: topics, history: history }
  } catch (error) {
    console.log('Error fetching popular topics', error)
    throw new Error('Error fetching homepage')
  }
}