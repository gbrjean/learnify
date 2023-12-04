"use client"

import '@styles/homepage/homepage.scss'

import Info from '@components/Info'
import Image from 'next/image'
import Link from "next/link"
import Quizzes from "@public/assets/images/Quizzes.png"
import Flashcards from "@public/assets/images/Flashcards.png"
import QuizMe from "@public/assets/images/QuizMe.png"
import NewFlashcard from "@public/assets/images/NewFlashcard.png"
import History from "@public/assets/images/History.png"
import WordCloud from '@components/WordCloud'
import QuizListItem from '@components/QuizListItem'

const Homepage = () => {

  return (
    <section>
      <h1>Dashboard</h1>

      <div className="wrapper">

        <div className="card card-inline" id='ci-1'>
          <Link href="/quizzes" className="big-cta" onClick={() => {}}>
            <Image src={Quizzes} alt="" />
            <span>View Quizzes</span>
          </Link>
          <Link href="/flashcards" className="big-cta" onClick={() => {}}>
            <Image src={Flashcards} alt="" />
            <span>View Flashcards</span>
          </Link>
        </div>

        <div className="card card-inline" id='ci-2'>
          <Link href="/collections" className="big-cta" onClick={() => {}}>
            <Image src={Quizzes} alt="" />
            <span>View Collections</span>
            <Info text="Collections are...." />
          </Link>
          <Link href="/decks" className="big-cta" onClick={() => {}}>
            <Image src={Flashcards} alt="" />
            <span>View Decks</span>
            <Info text="Decks are...." />
          </Link>
        </div>

        <Link href="/create-quiz" className="card card-hoverable" id='qm'>
          <span className="title">Quiz me!</span>
          <p>Challenge yourself to a quiz with a topic of your choice.</p>
          <Image src={QuizMe} alt="" className='card-img' />
        </Link>

        <Link href="/create-flashcard" className="card card-hoverable" id='nf'>
          <span className="title">New Flashcard</span>
          <p>Create a flashcard for your spaced-repetition learning sessions.</p>
          <Image src={NewFlashcard} alt="" className='card-img' />
        </Link>

        <div className="card" id='ht'>
          <span className="title">Hot Topics</span>
          <p>Click on a topic to start a quiz on it using AI.</p>
          <WordCloud />
        </div>

        <Link href="/history" className="card card-hoverable" id='hi'>
          <span className="title">History</span>
          <p>View past attempts.</p>
          <Image src={History} alt="" className='card-img' />
        </Link>

        <div className="card" id='ra'>
          <span className="title">Recent Activity</span>
          <p>You have played a total of 84 quizzes.</p>

          <div className="list">
            <QuizListItem />
            <QuizListItem />
            <QuizListItem />
          </div>

        </div>

      </div>

    </section>
  )
}

export default Homepage