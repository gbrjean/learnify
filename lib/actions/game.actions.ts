"use server"

import { connectToDB } from "@lib/mongoose"
import { QuizWithAiValidation, QuizManualValidation } from "@lib/validations/quiz.validation";
import { ZodError } from "zod";
import { getCurrentUser } from "./user.actions";
import User from "@lib/models/user.model";
import Game from "@lib/models/game.model";
import GameHistory from "@lib/models/gamehistory.model";
import { z } from 'zod'
import stringSimilarity from "string-similarity"
import { HistoryTypes, SummaryGameHistory, UserAnswer, mcqQuestion, openEndedQuestion } from "@types";
import Group from "@lib/models/group.model";
import { revalidatePath } from "next/cache";
import PopularTopics from "@lib/models/populartopics.model";
import { differenceInSeconds } from "date-fns";
import { calculateAverageAccuracy, sanitizeAnswer } from "@lib/utils";
import { strict_output } from "@lib/gpt";




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


    if(isQuizAI){

      let questions: openEndedQuestion[] | mcqQuestion[] = await createQuestions(formData as z.infer<typeof QuizWithAiValidation>)

      const parsedData = QuizWithAiValidation.parse(formData)

      console.log("questions:", questions)
      console.log("parsed data:", parsedData)

      const gameData = new Game({
        user_id: user,
        game_type: parsedData.type,
        topic: parsedData.topic,
        game_genre: genre,
        game_mode: 'AI',
      })

      console.log("game: ", gameData)

      try {
        let gameDoc = new Game(gameData);
        console.log("the doc is: ", gameDoc)
        
        if(parsedData.type == "open-ended"){
          let data = (questions as openEndedQuestion[]).map(question => {
            return {
              question: question.question,
              answer: question.answer,
            }
          })

          console.log("questions data:", data)

          data.map(question => {
            gameDoc.questions.push(question);
          })

          

        } else if(parsedData.type == "mcq"){
          
          let data = (questions as mcqQuestion[]).map(question  => {
            let options = [question.option1, question.option2, question.option3, question.answer]
            options = options.sort(() => Math.random() - 0.5)
            return {
              question: question.question,
              answer: question.answer,
              options: options,
            }
          })

          console.log("questions data:", data)

          data.map(question => {
            gameDoc.questions.push(question);
          })

        }
        
        
        let game = await gameDoc.save();

        await PopularTopics.findOneAndUpdate(
          { topic: parsedData.topic },
          {
            $setOnInsert: { topic: parsedData.topic },
            $inc: { count: 1 }, // Increment the count field
          },
          {
            upsert: true, // Create a new document if it doesn't exist
            setDefaultsOnInsert: true, // Ensure default values are set during upsert
          }
        );

        user.games.push(game._id)
        await user.save()

        return game._id

      } catch (error: any) {
        console.log('Error saving game:', error);
        throw new Error(`Error saving game: ${error.message}`)
      }



    }


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

    const game = await Game.findOneAndDelete({ user_id: session.user.id, _id: gameId })
    
    if(!game){
      throw new Error("Game not found")
    }

    await User.updateOne({ _id: session.user.id }, { $pull: { games: gameId } })

    revalidatePath(path)

  } catch (error: any) {
    console.log('Error deleting the game: ', error)
    throw new Error(`Error deleting the game: ${error.message}`)
  }
}

export async function deleteGameHistory(historyId: string, path: string){
  try {
    const session = await getCurrentUser()
    if(!session?.user){
      throw new Error('You must be logged in')
    }

    const entry = await GameHistory.findByIdAndDelete(historyId)
    
    if(!entry){
      throw new Error("Game history not found")
    }

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
        sanitizeAnswer( game.questions[qIndex].answer.toLowerCase().trim() ),
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


export async function endGame(objectId: string, answers: UserAnswer[], timeStarted: Date, historyType: 'quizzes' | 'flashcards' | 'decks' | 'collections'){
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


    let endedGame

    if(historyType == 'quizzes' || historyType == 'flashcards'){
      const game = await Game.findById(objectId)
  
      if(!game){
        throw new Error(`No game find with id ${objectId}`)
      }
  
      endedGame = await GameHistory.create({
        user_id: user._id,
        game_id: game._id,
        time_started: timeStarted,
        answers,
        history_type: historyType,
      })
    }

    if(historyType == 'collections' || historyType == 'decks'){
      const group = await Group.findById(objectId)
  
      if(!group){
        throw new Error(`No group find with id ${objectId}`)
      }
  
      endedGame = await GameHistory.create({
        user_id: user._id,
        group_id: group._id,
        time_started: timeStarted,
        answers,
        history_type: historyType,
      })
    }


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

    const group = await Group.findOne({ _id: groupId, type: type })
      .populate({
        path: 'games',
        select: '_id questions game_mode'
      })
      .select('title games_type games_genre games')
      .lean()
      .exec()


    if (!group) {
      throw new Error('Game of group not found');
    }

    console.log(group)

    return group

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
          game_genre: 1,
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


export async function fetchHistoryList(type?: HistoryTypes, mode?: 'short', all?: boolean){
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

    let history: any[] = []

    if(all){

      const historyInitial = await GameHistory.find({user_id: user._id})
        .sort({ time_ended: -1 })
        .select('_id history_type')

      if (!historyInitial) {
        throw new Error(`History not found with type ${type}`);
      }

      for(const historyDoc of historyInitial){

        if(historyDoc.history_type == 'quizzes' || historyDoc.history_type == 'flashcards') {
            
          const historyData = await GameHistory.aggregate([
            { 
              $match: { 
                user_id: user._id,
                _id: historyDoc._id,
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
                play_id: '$game._id',
                created_at: {
                  $dateToString: {
                    format: "%d.%m.%Y",
                    date: "$time_ended",
                    timezone: "Europe/Bucharest",
                  },
                },
                topic: '$game.topic',
                game_type: '$game.game_type',
                game_genre: '$game.game_genre',
                game_mode: '$game.game_mode',
              }
            }
          ]);

          history.push(historyData[0])

        }
        
        if(historyDoc.history_type == 'collections' || historyDoc.history_type == 'decks') {
          
          const historyData = await GameHistory.aggregate([
            { 
              $match: { 
                user_id: user._id,
                history_type: type,
                _id: historyDoc._id,
              } 
            },
            { 
              $sort: { time_ended: -1 } 
            },
            {
              $lookup: {
                from: 'groups',
                localField: 'group_id',
                foreignField: '_id',
                as: 'group',
              },
            },
            { 
              $unwind: '$group' 
            },
            {
              $lookup: {
                from: 'games',
                localField: 'group.games',
                foreignField: '_id',
                as: 'games',
              },
            },
            {
              $project: {
                _id: 1,
                play_id: '$group._id',
                created_at: {
                  $dateToString: {
                    format: "%d.%m.%Y",
                    date: "$time_ended",
                    timezone: "Europe/Bucharest",
                  },
                },
                history_type: 1,
                topic: '$group.title',
                game_type: '$group.games_type',
                game_genre: '$group.games_genre',
                game_mode: {
                  $let: {
                    vars: {
                      first: { $arrayElemAt: ['$games', 0] }
                    },
                    in: '$$first.game_mode'
                  }
                },
              }
            }
          ]);

          history.push(historyData[0])

        }

      }


      if (history.length === 0) {
        return 'History not found';
      }

      return history
    }

    

    if(!type){
      throw new Error(`No type specified`)
    }

    const historyInitial = await GameHistory.find({user_id: user._id, history_type: type})
    .select('history_type')
    console.log(historyInitial)
    
    if (!historyInitial || historyInitial.length === 0) {
      return `History not found with type ${type}`
    }

    const history_type = historyInitial[0].history_type
    console.log(history_type)

    if(history_type == 'quizzes' || history_type == 'flashcards'){

      if(mode == 'short'){

        history = await GameHistory.aggregate([
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
              date_attempted: {
                $dateToString: {
                  format: "%d.%m.%Y",
                  date: "$time_ended",
                  timezone: "Europe/Bucharest",
                },
              },
              'game.topic': 1,
              'game.game_type': 1,
              game_genre: '$game.game_genre',
              game_mode: '$game.game_mode',
            }
          }
        ]);

      } else {

        history = await GameHistory.aggregate([
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
              time_started: 1,
              time_ended: 1,
              date_attempted: {
                $dateToString: {
                  format: "%d.%m.%Y",
                  date: "$time_ended",
                  timezone: "Europe/Bucharest",
                },
              },
              'game._id': 1,
              'game.topic': 1,
              'game.game_type': 1,
              game_genre: '$game.game_genre',
              answers: {
                $map: {
                  input: '$answers',
                  as: 'answer',
                  in: {
                    is_correct: '$$answer.is_correct',
                    percentage_correct: '$$answer.percentage_correct',
                  }
                }
              }
            }
          }
        ]);

        console.log(history)

      }

    }

    if(history_type == 'collections' || history_type == 'decks'){

      if(mode == 'short'){

        history = await GameHistory.aggregate([
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
              from: 'groups',
              localField: 'group_id',
              foreignField: '_id',
              as: 'group',
            },
          },
          { 
            $unwind: '$group' 
          },
          {
            $lookup: {
              from: 'games',
              localField: 'group.games',
              foreignField: '_id',
              as: 'games',
            },
          },
          {
            $project: {
              _id: 1,
              date_attempted: {
                $dateToString: {
                  format: "%d.%m.%Y",
                  date: "$time_ended",
                  timezone: "Europe/Bucharest",
                },
              },
              'group.title': 1,
              game_type: '$group.games_type',
              game_mode: {
                $let: {
                  vars: {
                    first: { $arrayElemAt: ['$games', 0] }
                  },
                  in: '$$first.game_mode'
                }
              },
            }
          }
        ]);

      } else {

        history = await GameHistory.aggregate([
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
              from: 'groups',
              localField: 'group_id',
              foreignField: '_id',
              as: 'group',
            },
          },
          { 
            $unwind: '$group' 
          },
          {
            $lookup: {
              from: 'games',
              localField: 'group.games',
              foreignField: '_id',
              as: 'games',
            },
          },
          {
            $project: {
              _id: 1,
              time_started: 1,
              time_ended: 1,
              date_attempted: {
                $dateToString: {
                  format: "%d.%m.%Y",
                  date: "$time_ended",
                  timezone: "Europe/Bucharest",
                },
              },
              'group._id': 1,
              'group.title': 1,
              game_genre: '$group.games_genre',
              game_mode: {
                $let: {
                  vars: {
                    first: { $arrayElemAt: ['$games', 0] }
                  },
                  in: '$$first.game_mode'
                }
              },
              games: {
                $map: {
                  input: '$games',
                  as: 'game',
                  in: {
                    game_type: '$$game.game_type',
                  },
                },
              },
              answers: {
                $map: {
                  input: '$answers',
                  as: 'answer',
                  in: {
                    is_correct: '$$answer.is_correct',
                    percentage_correct: '$$answer.percentage_correct',
                  }
                }
              }
            }
          }
        ]);

      }

    }



    if (history.length === 0) {
      return 'History not found';
    }

    return history

  } catch (error: any) {
    console.log('Error fetching history', error)
    throw new Error(`Error fetching history: ${error.message}`)
  }
}

export async function fetchSummary(summaryId: string) {
  try {
    const session = await getCurrentUser()
    if(!session?.user){
      throw new Error('You must be logged in')
    }

    connectToDB()

    const summaryInitial = await GameHistory.findById(summaryId)
      .select('history_type _id')
      .exec()

    if (!summaryInitial) {
      throw new Error(`Summary not found for summary Id ${summaryId}`);
    }

    const history_type = summaryInitial.history_type

    let data
    let summary: SummaryGameHistory | null = null
    let history
    let best_time

    if(history_type == 'quizzes' || history_type == 'flashcards'){
      //TODO: aggregation cu game_id

      const summaryData: SummaryGameHistory[] = await GameHistory.aggregate([
        {
          $match: { _id: summaryInitial._id, history_type: history_type },
        },
        {
          $lookup: {
            from: 'games',
            localField: 'game_id',
            foreignField: '_id',
            as: 'game',
          },
        },
        {
          $unwind: '$game',
        },
        {
          $project: {
            _id: 1,
            game_id: 1,
            summary_type: '$game.game_type',
            time_started: 1,
            time_ended: 1,
            questions: {
              $map: {
                input: '$game.questions',
                as: 'question',
                in: {
                  question: '$$question.question',
                  correct_answer: '$$question.answer',
                },
              },
            },
            answers: '$answers',
          },
        },
      ]);

      if(summaryData.length > 0) { summary = summaryData[0] }
      
    }

    if(history_type == 'collections' || history_type == 'decks'){

      const summaryData: SummaryGameHistory[] = await GameHistory.aggregate([
        {
          $match: { _id: summaryInitial._id, history_type: history_type },
        },
        {
          $lookup: {
            from: 'groups',
            localField: 'group_id',
            foreignField: '_id',
            as: 'group',
          },
        },
        {
          $unwind: '$group',
        },
        {
          $lookup: {
            from: 'games',
            localField: 'group.games',
            foreignField: '_id',
            as: 'games',
          },
        },
        {
          $project: {
            _id: 1,
            group_id: 1,
            summary_type: '$group.games_type',
            time_started: 1,
            time_ended: 1,
            questions: {
              $map: {
                input: '$games.questions',
                as: 'question',
                in: {
                  question: '$$question.question',
                  correct_answer: '$$question.answer',
                },
              },
            },
            answers: '$answers',
          },
        },
      ]);

      if(summaryData.length > 0) { summary = summaryData[0] }

    }

    if(summary && 'game_id' in summary){
      history = await GameHistory.find({ game_id: summary.game_id })
        .select('time_started time_ended')
        .exec()
    }

    if(summary && 'group_id' in summary){
      history = await GameHistory.find({ group_id: summary.group_id })
        .select('time_started time_ended')
        .exec()
    }

    if(history){
      const bestTimesList = history.map(el => differenceInSeconds(el.time_ended, el.time_started))
      best_time = Math.min(...bestTimesList)
    }

    if(summary && 'time_started' in summary && 'time_ended' in summary && Number.isFinite(best_time)){
      data = {
        table_data: summary,
        time_taken: differenceInSeconds(summary.time_ended, summary.time_started),
        best_time: best_time,
        average_accuracy: calculateAverageAccuracy(summary.answers)
      }
    } 


    if(data){
      console.log(data)
      return data
    } else {
      console.log("error")
      console.log(data)
      throw new Error('No data to retrieve')
    }

  } catch (error: any) {
    console.log('Error fetching summary', error)
    throw new Error(`Error fetching summary: ${error.message}`)
  }
}


export async function createQuestions(formData: z.infer<typeof QuizWithAiValidation>) {
  try {
    // const session = await getCurrentUser()
    // if(!session?.user){
    //   throw Error('You must be logged in')
    // }
    console.log("INIT SERVER ACTION")
    const { questions_no, topic, type } = QuizWithAiValidation.parse(formData)
    let questions: any

    if(type == "open-ended"){

      questions = await strict_output(
        "You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array",
        new Array(questions_no).fill(
          `You are to generate a random hard open-ended questions about ${topic}`
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
        }
      );


    } else if(type == "mcq"){
   
      try {
        console.log("cl1")
        questions = await strict_output(
          "You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words, store all answers and questions and options in a JSON array",
          new Array(questions_no).fill(
            `You are to generate a random hard mcq question about ${topic}`
          ),
          {
            question: "question",
            answer: "answer with max length of 15 words",
            option1: "option1 with max length of 15 words",
            option2: "option2 with max length of 15 words",
            option3: "option3 with max length of 15 words",
          }
        );
        console.log("cl2")
      } catch (error) {
        console.log("cl3")
        return error
      }



    }

    return questions
  } catch (error) {
    if(error instanceof ZodError){
      throw Error(`Error: ${error.issues}`)
    }
  }
}

