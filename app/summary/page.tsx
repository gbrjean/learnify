"use client"

import '@styles/summary/summary.scss'

import Image from "next/image"
import Check from "@public/assets/images/check-answer.png"
import Cross from "@public/assets/images/cross-answer.png"
import Clock from "@public/assets/images/clock.png"
import Accuracy from "@public/assets/images/accuracy.png"
import { TrophyIcon } from "@public/assets/icons/TrophyIcon"
import Table from '@components/Table'

const Summary = () => {

  //? MCQ
  const tableData = {
    isSummary: true,
    isMCQ: true,
    titles: ['Question & Correct answer', 'Your answer'],
    elements: [
      ['This is the question, what is the answer? @ This is the answer for the question', 'This is the correct answer for the question'],
      ['This is the question, what is the answer? @ This is the answer for the question', 'This is the correct answer for the question']
    ],
    correct_answers: [1]
  }

  //? Open-ended ( isMCQ false )
  // const tableData = {
  //   isSummary: true,
  //   isMCQ: false,
  //   titles: ['Question & Correct answer', 'Your answer', 'Accuracy'],
  //   elements: [
  //     ['This is the question, what is the answer? @ This is the answer for the question', 'This is the correct answer for the question', '85%'],
  //     ['This is the question, what is the answer? @ This is the answer for the question', 'This is the correct answer for the question', '85%']
  //   ]
  // }

  return (
    <section>

      <div className="cta-header">
        <h1>Summary</h1>
        <div className="cta-header-ctas">
          <button className="btn-primary">Add to Collection</button>
          <button className="btn-blue">Back to Dashboard</button>
        </div>
      </div>

      <div className="wrapper">

        <div className="card" id='results'>
          <h2>Results</h2>

          <div className="card-content">

            <div className="result">
              <div>
                <Image src={Check} width={32} height={32} alt="" />
                <span>2</span>
              </div>
              <div>
                <span>0</span>
                <Image src={Cross} width={32} height={32} alt="" />
              </div>
            </div>

            <TrophyIcon />

            <span>{'> 25% accuracy'}</span>
          </div>

        </div>

        <div className="card-group">

          <div className="card">
            <h2>Average Accuracy</h2>
            <span>66.67%</span>
            <Image src={Accuracy} width={36} height={36} alt="" />
          </div>

          <div className="card">
            <h2>Time Taken</h2>
            <span>1m 40s</span>
            <Image src={Clock} alt="" />
          </div>

          <div className="card">
            <h2>Best Time</h2>
            <span>40s</span>
            <Image src={Clock} alt="" />
          </div>

        </div>

        <Table data={tableData} />

      </div>

    </section>
  )
}

export default Summary