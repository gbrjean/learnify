"use server"

import { connectToDB } from "@lib/mongoose"
// import Question from "@lib/models/question.model"
import { QuizWithAiValidation, QuizManualValidation } from "@lib/validations/quiz.validation";
import { ZodError } from "zod";
import { getCurrentUser } from "./user.actions";
// import { createQuestions } from "./questions.actions";
// import { mcqQuestion, openEndedQuestion } from "@types";
import User from "@lib/models/user.model";
import Game from "@lib/models/game.model";
import GameHistory from "@lib/models/gamehistory.model";
import { z } from 'zod'
import stringSimilarity from "string-similarity"
import { UserAnswer } from "@types";
import Group from "@lib/models/group.model";
import { revalidatePath } from "next/cache";




export async function createGame(formData: z.infer<typeof QuizWithAiValidation> | z.infer<typeof QuizManualValidation>, isQuizAI: boolean, genre: 'quiz' | 'flashcard') {
  try {
    connectToDB()

    const session = await getCurrentUser()
    if(!session?.user){
      throw new Error('You must be logged in')
    }

    console.log("Server data  ", formData, isQuizAI);


    const user = await User.findById(session?.user.id)
    if(!user){
      throw new Error("User not found")
    }


    // if(isQuizAI){

    //   let questions = await createQuestions(formData as z.infer<typeof QuizWithAiValidation>)
    //   const parsedData = QuizWithAiValidation.parse(formData)


    //   const newGame = new Game({
    //     userId: user,
    //     gameType: parsedData.type,
    //     topic: parsedData.topic,
    // game_genre: genre,
    // game_mode: 'manual',
    //   })

    //   const game = await newGame.save()


    //   if(parsedData.type == "open-ended"){
    //     let data = questions.map((question: openEndedQuestion) => {
    //       return {
    //         question: question.question,
    //         answer: question.answer,
    //         questionType: parsedData.type,
    //         gameId: game._id,
    //       }
    //     })

    //     Question.insertMany(data)
    //       .then(() => {
    //         return game._id
    //       })
    //       .catch((error) => {
    //         throw new Error("Error creating questions:", error.message);
    //     });

    //   } else if(parsedData.type == "mcq"){
        
    //     let data = questions.map((question: mcqQuestion) => {
    //       let options = [question.option1, question.option2, question.option3]
    //       options = options.sort(() => Math.random() - 0.5)
    //       return {
    //         question: question.question,
    //         answer: question.answer,
    //         options: JSON.stringify(options),
    //         questionType: parsedData.type,
    //         gameId: game._id,
    //       }
    //     })

    //     Question.insertMany(data)
    //       .then(() => {
    //         return game._id
    //       })
    //       .catch((error) => {
    //         throw new Error("Error creating questions:", error.message);
    //     });

    //   }
    // }


    if(!isQuizAI){

      const parsedData = QuizManualValidation.parse(formData)

      console.log("parsed data:", parsedData)

      let gameData = {
        user_id: user._id,
        game_type: parsedData.type,
        topic: parsedData.topic,
        game_genre: genre,
        game_mode: 'manual',
      }

      console.log("game: ", gameData)
      
      try {
        let gameDoc = new Game(gameData);
        console.log("the doc is: ", gameDoc)

        //? QUESTIONS CREATION FOR THE GANE
        if(parsedData.type == "open-ended"){

          let data = parsedData.questions.map(question => {
            return {
              question: question.question,
              answer: question.answers[0].answer,
            }
          })

          console.log("questions data:", data)

          data.map(question => {
            gameDoc.questions.push(question);
          })


        } else if(parsedData.type == "mcq"){
          
          let data = parsedData.questions.map(question => {
            let options = question.answers.map(answer => answer.answer)
            options = options.sort(() => Math.random() - 0.5)

            return {
              question: question.question,
              answer: question.answers[question.correct_answer - 1].answer,
              options: options,
            }
          })

          console.log("questions data:", data)

          data.map(question => {
            gameDoc.questions.push(question);
          })

        }


        let game = await gameDoc.save();

        user.games.push(game._id)
        await user.save()

        return game._id

      } catch (error: any) {
        console.log('Error saving game:', error);
        throw new Error(`Error saving game: ${error.message}`)
      }
    

    }


  } catch (error) {
    if(error instanceof ZodError){
      throw new Error(`Error: ${error.issues}`)
    }
  }
}


export async function deleteGame(gameId: string, path: string){
  try {
    const session = await getCurrentUser()
    if(!session?.user){
      throw new Error('You must be logged in')
    }

    await Game.findOneAndDelete({ user_id: session.user.id, _id: gameId })

    revalidatePath(path)

  } catch (error: any) {
    console.log('Error deleting the game: ', error)
    throw new Error(`Error deleting the game: ${error.message}`)
  }
}


export async function checkAnswer(gameId: string, qIndex: number, userInput: string, difficulty?: number){
  try {
    connectToDB()

    const game = await Game.findById(gameId)

    if(!game){
      throw new Error(`No game find with id ${gameId}`)
    }

    if(game.game_genre == 'flashcard' && difficulty !== undefined){
      if(!game.average_difficulty){
        game.average_difficulty = difficulty
        game.played_times = 1
      } else {
        game.played_times++
        game.average_difficulty = (game.average_difficulty + difficulty) / game.played_times
      }

      await game.save()
    }


    if(game.game_type == 'mcq'){
      let isCorrect = userInput.toLowerCase().trim() == game.questions[qIndex].answer.toLowerCase().trim()
      return isCorrect
    }

    if(game.game_type == 'open-ended'){
      let percentageSimilar = stringSimilarity.compareTwoStrings(
        game.questions[qIndex].answer.toLowerCase().trim(),
        userInput.toLowerCase().trim()
      );
      percentageSimilar = Math.round(percentageSimilar * 100);

      return percentageSimilar
    }


  } catch (error: any) {
    console.log('Error checking answer', error)
    throw new Error(`Error checking answer: ${error.message}`)
  }
}


export async function endGame(gameId: string, answers: UserAnswer[], timeStarted: Date){
  try {
    connectToDB()

    const game = await Game.findById(gameId)

    if(!game){
      throw new Error(`No game find with id ${gameId}`)
    }

    let endedGame = await GameHistory.create({
      game_id: game._id,
      time_started: timeStarted,
      answers
    })

    return endedGame._id
    
  } catch (error: any) {
    console.log('Error creating game history', error)
    throw new Error(`Error creating game history: ${error.message}`)
  }
}


export async function getGame(gameId: string){
  try {
    const session = await getCurrentUser()
    if(!session?.user){
      throw new Error('You must be logged in')
    }
    
    connectToDB()

    const game = await Game.findById(gameId).lean().exec()

    if(!game){
      throw new Error(`No game find with id ${gameId}`)
    }

    return game

  } catch (error: any) {
    throw new Error(`Unexpected error: ${error.message}`)
  }
}


export async function getGameOfGroup(groupId: string, type: 'collection' | 'deck'){
  try {
    const session = await getCurrentUser()
    if(!session?.user){
      throw new Error('You must be logged in')
    }

    connectToDB()

    const game = await Group.findOne({ _id: groupId, type: type })
      .populate({
        path: 'games',
        select: '_id questions game_type game_genre'
      })
      .select('games')
      .lean()
      .exec()

    if (!game) {
      throw new Error('Game of group not found');
    }

    return game

  } catch (error: any) {
    console.log('Error fetching game', error)
    throw new Error(`Error fetching game: ${error.message}`)
  }
}


export async function fetchGamesList(type: 'quiz' | 'flashcard'){
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


    const games = await Game.aggregate([
      { 
        $match: { 
          user_id: user._id, 
          game_genre: type 
        } 
      },
      { 
        $sort: { created_at: -1 } 
      },
      { 
        $project: { 
          _id: 1,
          created_at: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: "$created_at",
              timezone: "Europe/Bucharest",
            },
          },
          topic: 1,
          game_type: 1,
          game_mode: 1,
          questionsCount: { $size: '$questions' }
        } 
      }
    ]);

    if(!games){
      throw new Error(`No games to fetch`)
    }
    
    return games

  } catch (error: any) {
    console.log('Error fetching games list', error)
    throw new Error(`Error fetching games list: ${error.message}`)
  }
}


export async function fetchHistoryList(type: 'quizzez' | 'flashcards' | 'decks' | 'collections'){
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

    // const historyQuery = await GameHistory.find({ user_id: user._id, history_type: type })
    //   .sort({ time_ended: -1 })
    //   .populate({
    //     path: 'game_id',
    //     model: 'Game',
    //     select: 'topic game_type average_difficulty'
    //   })
    //   .select('_id time_started time_ended answers')
    //   .lean()
    //   .exec()

    // const history = historyQuery.map((item) => ({
    //   _id: item._id,
    //   time_started: item.time_started,
    //   time_ended: item.time_ended,
    //   answers: item.answers.map((answer) => ({
    //     is_correct: answer.is_correct,
    //     percentage_correct: answer.percentage_correct,
    //     difficulty: answer.difficulty
    //   }))
    // }));

    const history = await GameHistory.aggregate([
      { 
        $match: { 
          user_id: user._id,
          history_type: type 
        } 
      },
      { 
        $sort: { time_ended: -1 } 
      },
      { 
        $lookup: { 
          from: 'games', 
          localField: 'game_id', 
          foreignField: '_id', 
          as: 'game'
        } 
      },
      { 
        $unwind: '$game' 
      },
      {
        $project: {
          _id: 1,
          time_started: {
            $dateToString: {
              format: "%d.%m.%Y",
              date: "$time_started",
              timezone: "Europe/Bucharest",
            },
          },
          time_ended: {
            $dateToString: {
              format: "%d.%m.%Y",
              date: "$time_ended",
              timezone: "Europe/Bucharest",
            },
          },
          'game.topic': 1,
          'game.game_type': 1,
          'game.average_difficulty': 1,
          answers: {
            $map: {
              input: '$answers',
              as: 'answer',
              in: {
                is_correct: '$$answer.is_correct',
                percentage_correct: '$$answer.percentage_correct',
                difficulty: '$$answer.difficulty'
              }
            }
          }
        }
      }
    ]);

    if (!history) {
      throw new Error('History not found');
    }

    return history

  } catch (error: any) {
    console.log('Error fetching history', error)
    throw new Error(`Error fetching history: ${error.message}`)
  }
}