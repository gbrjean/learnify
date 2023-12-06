"use server"

import { connectToDB } from "@lib/mongoose"
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";
import User from "@lib/models/user.model";
import Group from "@lib/models/group.model";
import Game from "@lib/models/game.model";


export async function createGroup(title: string, type: 'collection' | 'deck', genre: 'quizzes' | 'flashcards', path: string) {
  try {
    connectToDB()

    const session = await getCurrentUser()
    if(!session?.user){
      throw new Error('You must be logged in')
    }
    const user = await User.findById(session?.user.id)
    if(!user){
      throw new Error("User not found")
    }

    await Group.create({
      user_id: user._id,
      type,
      title,
      games_genre: genre,
    })

    revalidatePath(path)

  } catch (error: any) {
    console.log(`Error creating group of type ${type} and genre ${genre}`, error)
    throw new Error(`Error creating group of type ${type} and genre ${genre}: ${error.message}`)
  }
}


export async function deleteGroup(id: string, path: string){
  try {
    connectToDB()

    const session = await getCurrentUser()
    if(!session?.user){
      throw new Error('You must be logged in')
    }
    
    const group = await Group.findById(id);
    if (!group) {
      throw new Error('Group not found');
    }

    await Group.deleteOne(group)
    revalidatePath(path)

  } catch (error: any) {
    throw new Error(`Can't delete the group: ${error.message}`)
  }
}


export async function getGroups(type: 'collection' | 'deck', mode?: 'summary'){
  try {
    connectToDB()

    const session = await getCurrentUser()
    if(!session?.user){
      throw new Error('You must be logged in')
    }
    const user = await User.findById(session?.user.id)
    if(!user){
      throw new Error("User not found")
    }

    if(mode == 'summary'){
      // const groups = await Group.find({ user_id: user._id, type: type })
      // .select('_id title games_type created_at')
      // .lean()
      // .exec()

      const groups = await Group.aggregate([
        { 
          $match: { 
            user_id: user._id, 
            type: type 
          } 
        },
        { 
          $project: { 
            _id: 1,
            title: 1,
            games_type: 1,
            created_at: { 
              $dateToString: {
                format: "%d/%m/%Y",
                date: "$created_at",
                timezone: "Europe/Bucharest",
              },
            }
          } 
        }
      ]);
      

      return groups
    }

    // const groups = await Group.find({ user_id: user._id, type: type })
    //   .populate({
    //     path: 'games',
    //     model: 'Game',
    //     select: '_id topic game_type game_genre game_mode created_at',
    //   })
    //   .select('_id title games_type created_at')
    //   .lean()
    //   .exec()

    const groups = await Group.aggregate([
      {
        $match: {
          user_id: user._id,
          type: type
        }
      },
      {
        $lookup: {
          from: 'games',
          localField: 'games',
          foreignField: '_id',
          as: 'games'
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          games_type: 1,
          created_at: { 
            $dateToString: {
              format: "%d/%m/%Y",
              date: "$created_at",
              timezone: "Europe/Bucharest",
            },
          },
          games: {
            $map: {
              input: '$games',
              as: 'game',
              in: {
                _id: '$$game._id',
                topic: '$$game.topic',
                game_type: '$$game.game_type',
                game_genre: '$$game.game_genre',
                game_mode: '$$game.game_mode',
                created_at: { 
                  $dateToString: { 
                    format: '%d/%m/%Y', 
                    date: '$$game.created_at',
                    timezone: "Europe/Bucharest",
                  }
                }
              }
            }
          }
        }
      }
    ]);
    

    return groups

  } catch (error: any) {
    throw new Error(`Error fetching groups: ${error.message}`)
  }
}


export async function addGameToGroup(
  gameId: string, 
  groupId: string, 
  game_type: 'mcq' | 'open-ended', 
  path: string
){
  try {
    connectToDB()

    const session = await getCurrentUser()
    if(!session?.user){
      throw new Error('You must be logged in')
    }

    const game = await Game.findById(gameId)
    if (!game) {
      throw new Error('Group not found');
    }

    const group = await Group.findById(groupId)
    if (!group) {
      throw new Error('Group not found');
    }


    if (!group.games || (Array.isArray(group.games) && group.games.length === 0)) {
      group.games_type = game_type
      group.games.push(game._id)
    } else {
      if(group.games_type == game_type){
        group.games.push(game._id)
      } else {
        throw new Error(`The type of the game must match the type accepted by the group [${group.games_type}]`)
      }
    }

    await group.save()
    revalidatePath(path)

  } catch (error: any) {
    throw new Error(`Error adding game to group: ${error.message}`)
  }
}

export async function deleteGameFromGroup(
  gameId: string, 
  groupId: string, 
  path: string
) {
  try {
    connectToDB()

    const session = await getCurrentUser()
    if(!session?.user){
      throw new Error('You must be logged in')
    }

    const group = await Group.findByIdAndUpdate(
      groupId,
      { $pull: { games: gameId } }
    );

    if (!group) {
      throw new Error('Group not found');
    }

    revalidatePath(path)

  } catch (error: any) {
    throw new Error(`Can't delete the game from group: ${error.message}`)
  }
}

