"use client"

import css from '@styles/history/history.module.scss'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Quizzes from "@public/assets/images/Quizzes.png"
import Flashcards from "@public/assets/images/Flashcards.png"
import Table from '@components/Table'
import { HistoryTypes, TableData } from '@types'
import { fetchHistoryList } from '@lib/actions/game.actions'
import { differenceInSeconds } from 'date-fns'
import { formatTimeDelta } from '@lib/utils'
import { toast } from 'react-toastify'

const renderTable = (type: 'single-game' | 'group-game', history: any) => {

  console.log(history)

  // const containsQuiz: boolean = 'is_correct' in history[0].answers[0]

  switch(type) {
    case 'single-game': {
      if('game' in history[0]){
        let tableDataGame: TableData = {
          titles: ['Date attempted', 'Type', 'Time taken'],
          topics: history.map((el: any) => el.game.topic),
          topic_icons: history.map((el: any) => 
            el.game_genre == 'flashcard'
              ? 'flashcard'
              : (el.game.game_type == 'mcq' ? 'multiple' : 'open')
          ),
          elements: history.map((el: any) => [
            el.date_attempted,
            el.game.game_type == 'mcq' ? 'Multiple Choice' : 'Open Ended',
            formatTimeDelta(differenceInSeconds(el.time_ended, el.time_started))
          ]),
          isResult: true,
          checks: history.map((el: any) => {
            if('is_correct' in el.answers[0]){
              let count = 0
              el.answers.forEach((answer: any) => {
                if(answer.is_correct) {
                  count++
                }
              })
              return count
            } else {
              return null
            }
          }),
          crosses: history.map((el: any) => {
            if('is_correct' in el.answers[0]){
              let count = 0
              el.answers.forEach((answer: any) => {
                if(!answer.is_correct) {
                  count++
                }
              })
              return count
            } else {
              return null
            }
          }),
          accuracies: history.map((el: any) => {
            if('percentage_correct' in el.answers[0]){
              let averageAccuracy = 0
      
              const percentages: number[] = el.answers.map((answer: any) => answer.percentage_correct)
              const totalPercentage = percentages.reduce((acc: number, val: number) => acc + val, 0)
      
              averageAccuracy = Math.round(totalPercentage / percentages.length)
              return averageAccuracy
            } else {
              return null
            }
          }),
          ids: history.map((el: any) => el._id),
          topicAsLink: true,
        }
      
        // if(containsQuiz){
        //   tableDataGame = {
        //     ...tableDataGame,
        //     checks: history.map((el: any) => {
        //       let count = 0
        //       el.answers.forEach((answer: any) => {
        //         if(answer.is_correct) {
        //           count++
        //         }
        //       })
        //       return count
        //     }),
        //     crosses: history.map((el: any) => {
        //       let count = 0
        //       el.answers.forEach((answer: any) => {
        //         if(!answer.is_correct) {
        //           count++
        //         }
        //       })
        //       return count
        //     }),
        //   }
      
        // } else {
        //   tableDataGame = {
        //     ...tableDataGame,
        //     isAccuracy: true,
        //     accuracies: history.map((el: any) => {
        //       let averageAccuracy = 0
      
        //       const percentages: number[] = el.answers.map((answer: any) => answer.percentage_correct)
        //       const totalPercentage = percentages.reduce((acc: number, val: number) => acc + val, 0)
      
        //       averageAccuracy = totalPercentage / percentages.length
        //       return averageAccuracy
        //     }),
        //   }
        // }

        return <Table data={tableDataGame} pageRedirectFor='summary' />
      }
    }
    case 'group-game': {
      if('group' in history[0]){
        let tableDataGroup: TableData = {
          titles: ['Date attempted', 'Type', 'Time taken'],
          topics:history.map((el: any) => el.group.title),
          topic_icons: history.map((el: any) => 
            el.game_genre == 'flashcards'
              ? 'flashcard'
              : (el.games[0].game_type == 'mcq' ? 'multiple' : 'open')
          ),
          elements: history.map((el: any) => [
            el.date_attempted,
            el.games[0].game_type == 'mcq' ? 'Multiple Choice' : 'Open Ended',
            formatTimeDelta(differenceInSeconds(el.time_ended, el.time_started))
          ]),
          isResult: true,
          checks: history.map((el: any) => {
            if('is_correct' in el.answers[0]){
              let count = 0
              el.answers.forEach((answer: any) => {
                if(answer.is_correct) {
                  count++
                }
              })
              return count
            } else {
              return null
            }
          }),
          crosses: history.map((el: any) => {
            if('is_correct' in el.answers[0]){
              let count = 0
              el.answers.forEach((answer: any) => {
                if(!answer.is_correct) {
                  count++
                }
              })
              return count
            } else {
              return null
            }
          }),
          accuracies: history.map((el: any) => {
            if('percentage_correct' in el.answers[0]){
              let averageAccuracy = 0
      
              const percentages: number[] = el.answers.map((answer: any) => answer.percentage_correct)
              const totalPercentage = percentages.reduce((acc: number, val: number) => acc + val, 0)
      
              averageAccuracy = Math.round(totalPercentage / percentages.length)
              return averageAccuracy
            } else {
              return null
            }
          }),
          ids: history.map((el: any) => el._id),
          topicAsLink: true,
        }
      
        // if(containsQuiz){
        //   tableDataGroup = {
        //     ...tableDataGroup,
        //     checks: history.map((el: any) => {
        //       let count = 0
        //       el.answers.forEach((answer: any) => {
        //         if(answer.is_correct) {
        //           count++
        //         }
        //       })
        //       return count
        //     }),
        //     crosses: history.map((el: any) => {
        //       let count = 0
        //       el.answers.forEach((answer: any) => {
        //         if(!answer.is_correct) {
        //           count++
        //         }
        //       })
        //       return count
        //     }),
        //   }
      
        // } else {
        //   tableDataGroup = {
        //     ...tableDataGroup,
        //     isAccuracy: true,
        //     accuracies: history.map((el: any) => {
        //       let averageAccuracy = 0
      
        //       const percentages: number[] = el.answers.map((answer: any) => answer.percentage_correct)
        //       const totalPercentage = percentages.reduce((acc: number, val: number) => acc + val, 0)
      
        //       averageAccuracy = totalPercentage / percentages.length
        //       return averageAccuracy
        //     }),
        //   }
        // }

        return <Table data={tableDataGroup} pageRedirectFor='summary' />
      }
    }
  }

}

const History = () => {

  const [historyType, setHistoryType] = useState<HistoryTypes>('quizzes')

  const [history, setHistory] = useState<any[] | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  const fetchHistory = async () => {
    try {
      if(!loading) {
        setLoading(true)
      }
      const res = await fetchHistoryList(historyType)
      if(Array.isArray(res)){
        res.length > 0 ? setHistory(res) : setHistory(undefined)
      } else {
        setHistory(undefined)
        toast.info(res)
      }  
      setLoading(false)
    } catch (error: any) {
      console.log(error.message)
      toast.error("Couldn't fetch the history")
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [historyType])
  

  return (
    <section>
      <h1>History</h1>

      <div className={css.wrapper}>

        <div className="big-cta" onClick={() => setHistoryType('quizzes')}>
          <Image src={Quizzes} alt="" />
          <span>History of <br /> Quizzes</span>
        </div>

        <div className="big-cta" onClick={() => setHistoryType('flashcards')}>
          <Image src={Flashcards} alt="" />
          <span>History of <br /> Flashcards</span>
        </div>

        <div className="big-cta" onClick={() => setHistoryType('collections')}>
          <Image src={Quizzes} alt="" />
          <span>History of <br /> Collections</span>
        </div>

        <div className="big-cta" onClick={() => setHistoryType('decks')}>
          <Image src={Flashcards} alt="" />
          <span>History of <br /> Decks</span>
        </div>

      </div>

      { loading
          ? <div className="loader"></div>
          : history 
              ? renderTable(
                  historyType == 'quizzes' || historyType == 'flashcards' 
                    ? 'single-game' 
                    : 'group-game', 
                  history
                )
              : <span style={{marginTop: '4rem'}}>Empty list</span>
      }

    </section>
  )
}

export default History