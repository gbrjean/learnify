import { getServerSession } from "next-auth";
import { authOptions } from "@app/api/auth/[...nextauth]/route";
import { CustomSession, UserProfileStats } from "@types";
import { connectToDB } from "@lib/mongoose";
import User from "@lib/models/user.model";
import GameHistory from "@lib/models/gamehistory.model";
import { differenceInSeconds } from "date-fns";
import { calculateAverageAccuracy, hasEmptyFields } from "@lib/utils";

export async function getCurrentUser(): Promise<CustomSession | null> {
  const session = await getServerSession(authOptions)

  return session as CustomSession
}

export async function getUserProfile(){
  try {
    const session = await getCurrentUser()
    if(!session?.user){
      throw new Error('You must be logged in')
    }

    connectToDB()

    const user = await User.findById(session?.user.id)
    if(!user){
      throw new Error("User not found")
    }

    const userHistory = await GameHistory.find({user_id : user._id}).lean().exec()

    const practicedQuizzes = userHistory.filter(doc => doc.history_type === 'quizzes')
    const practicedFlashcards = userHistory.filter(doc => doc.history_type === 'flashcards')
    const practicedDecks = userHistory.filter(doc => doc.history_type === 'decks')
    const practicedCollections = userHistory.filter(doc => doc.history_type === 'collections')


    const calculateStats = (group: any[], isFlashcard?: boolean) => {
      if (group.length === 0) {
        return null;
      }

      const attempts = group.length;
      const timeTaken = group.map(game => differenceInSeconds(game.time_ended, game.time_started));
      const averageTimeTaken = timeTaken.reduce((acc, val) => acc + val, 0) / attempts;
      const bestTimeTaken = Math.min(...timeTaken);
      const worstTimeTaken = Math.max(...timeTaken);
      const accuracies = group.map(game => calculateAverageAccuracy(game.answers))
      const averageAccuracy = Math.round(accuracies.reduce((acc, val) => acc + val, 0) / attempts)

      let averageProficiency: string | null = null
      if(isFlashcard){
        const difficulties = group.map(game => game.answers[0].difficulty ? game.answers[0].difficulty : undefined)
        if(!hasEmptyFields(difficulties)){
          let averageMean = difficulties.reduce((acc, val) => acc + val, 0) / attempts

          if(averageMean >= 5 && averageMean < 6){
            averageProficiency = 'Not well'
          }
          if(averageMean >= 6 && averageMean < 8){
            averageProficiency = 'Good'
          }
          if(averageMean >= 8 && averageMean <= 10){
            averageProficiency = 'Excellent'
          }
        }
      }

      return {
        attempts,
        averageTimeTaken,
        bestTimeTaken,
        worstTimeTaken,
        averageAccuracy,
        averageProficiency: averageProficiency ? averageProficiency : undefined,
      };
    };


    const statsPracticedQuizzes: UserProfileStats | null = calculateStats(practicedQuizzes)
    const statsPracticedFlashcards: UserProfileStats | null = calculateStats(practicedFlashcards, true)
    const statsPracticedDecks: UserProfileStats | null = calculateStats(practicedDecks)
    const statsPracticedCollections: UserProfileStats | null = calculateStats(practicedCollections)


    return {
      practicedQuizzes: statsPracticedQuizzes,
      practicedFlashcards: statsPracticedFlashcards,
      practicedDecks: statsPracticedDecks,
      practicedCollections: statsPracticedCollections,
    }


  } catch (error: any) {
    console.log("Error fetching user's games history:", error)
    throw new Error(error.message)
  }
}

