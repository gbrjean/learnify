"use client"

import css from '@styles/summary/summary.module.scss'

import Image from "next/image"
import Check from "@public/assets/images/check-answer.png"
import Cross from "@public/assets/images/cross-answer.png"
import Clock from "@public/assets/images/clock.png"
import Accuracy from "@public/assets/images/accuracy.png"
import { TrophyIcon } from "@public/assets/icons/TrophyIcon"
import Table from '@components/Table'
import { TableData } from '@types'
import { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"
import { formatTimeDelta } from '@lib/utils'

type Props = {
  tableData: TableData;
  timeTaken: number;
  bestTime: number;
  avgAccuracy?: number;
}


const Summary = ({
  tableData,
  timeTaken,
  bestTime,
  avgAccuracy
}: Props) => {

  const router = useRouter()
  
  const [stats, setStats] = useState({ //? ONLY FOR MCQ
    correct_answers: 0,
    wrong_answers: 0,
  })

  const [averageAccuracy, setAverageAccuracy] = useState<number>(0) //? MCQ + OE

  useEffect(() => {
    if(avgAccuracy) {
      setAverageAccuracy(avgAccuracy)  
    }
    
    if(tableData.isMCQ && tableData.correct_answers){
      setStats({
        correct_answers: tableData.correct_answers?.length,
        wrong_answers: tableData.elements.length - tableData.correct_answers?.length
      })
    }
  }, [avgAccuracy, tableData.isMCQ, tableData.correct_answers, tableData.elements])

  

  return (
    <section>

      <div className={`cta-header ${css.cta_header}`}>
        <h1>Summary</h1>
        <div className="cta-header-ctas">
          <button className="btn-blue" onClick={() => router.push('/')}>Back to Dashboard</button>
        </div>
      </div>

      <div className={css.wrapper}>

        <div className={`card ${css.card}`} id={css.results}>
          <h2>Results</h2>

          <div className={css.card_content}>

            { tableData.isMCQ &&
              <div className={css.result}>
                <div>
                  <Image src={Check} width={32} height={32} alt="" />
                  <span>{stats.correct_answers}</span>
                </div>
                <div>
                  <span>{stats.wrong_answers}</span>
                  <Image src={Cross} width={32} height={32} alt="" />
                </div>
              </div>
            }

            <TrophyIcon />

          </div>

        </div>

        <div className={css.card_group}>

          <div className={`card ${css.card}`}>
            <h2>Average Accuracy</h2>
            <span>{`${averageAccuracy}%`}</span>
            <Image src={Accuracy} width={36} height={36} alt="" />
          </div>

          <div className={`card ${css.card}`}>
            <h2>Time Taken</h2>
            <span>{formatTimeDelta(timeTaken)}</span>
            <Image src={Clock} alt="" />
          </div>

          <div className={`card ${css.card}`}>
            <h2>Best Time</h2>
            <span>{formatTimeDelta(bestTime)}</span>
            <Image src={Clock} alt="" />
          </div>

        </div>

        <Table data={tableData} />

      </div>

    </section>
  )
}

export default Summary