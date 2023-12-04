"use client"

import '@styles/history/history.scss'

import { useState } from 'react'
import Image from 'next/image'
import Quizzes from "@public/assets/images/Quizzes.png"
import Flashcards from "@public/assets/images/Flashcards.png"
import Table from '@components/Table'

const renderTable = (type: string) => {

  const tableDataQuizzes: TableData = {
    titles: ['Date attempted', 'Type', 'Time taken'],
    topics: ['HTML flexbox property'],
    elements: [
      ['02/10/2023', 'Multiple Choice', '43s']
    ],
    isResult: true,
    checks: [2],
    crosses: [0]
  }

  const tableDataFlashcards: TableData = {
    titles: ['Date attempted', 'Type', 'Time taken'],
    topics: ['HTML flexbox property'],
    elements: [
      ['02/10/2023', 'Multiple Choice', '44s']
    ],
    isResult: true,
    checks: [2],
    crosses: [0]
  }

  const tableDataCollections: TableData = {
    titles: ['Date attempted', 'Type', 'Time taken'],
    topics: ['HTML flexbox property'],
    elements: [
      ['02/10/2023', 'Multiple Choice', '45s']
    ],
    isResult: true,
    checks: [2],
    crosses: [0]
  }

  const tableDataDecks: TableData = {
    titles: ['Date attempted', 'Type', 'Time taken'],
    topics: ['HTML flexbox property'],
    elements: [
      ['02/10/2023', 'Multiple Choice', '46s']
    ],
    isResult: true,
    checks: [2],
    crosses: [0]
  }

  switch(type) {
    case 'quizzes':
      return <Table data={tableDataQuizzes} />
    case 'flashcards':
      return <Table data={tableDataFlashcards} />
    case 'collections':
      return <Table data={tableDataCollections} />
    case 'decks':
      return <Table data={tableDataDecks} />
  }

}

const History = () => {

  const [historyType, setHistoryType] = useState<HistoryTypes>('quizzes')

  return (
    <section>
      <h1>History</h1>

      <div className="wrapper">

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

      {renderTable(historyType)}

      {/* <div className="table">

        <div className="table-head">
          <span>Topic</span>
          <span>Date attempted</span>
          <span>Type</span>
          <span>Time taken</span>
          <span>Result</span>
        </div>

        <div className="table-element">

          <div>
            <span>Topic</span>
            <div className="table-element-topic">
              <span className='table-element-topic-title'>HTML flexbox property</span>
            </div>
          </div>
          <div>
            <span>Date attempted</span>
            <span>02/10/2023</span>
          </div>
          <div>
            <span>Type</span>
            <span>Multiple Choice</span>
          </div>
          <div>
            <span>Time taken</span>
            <span>46s</span>
          </div>
          <div>
            <span>Result</span>
            <div className="table-element-result">
              <div>
                <Image src={Check} alt="" />
                <span>2</span>
              </div>
              <div>
                <span>0</span>
                <Image src={Cross} alt="" />
              </div>
            </div>
          </div>

        </div>



      </div> */}

    </section>
  )
}

export default History