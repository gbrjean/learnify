"use client"

import css from '@styles/homepage/homepage.module.scss'

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
import { PopularTopic } from '@types'

type Props = {
  topics: PopularTopic[] | null;
  history: any[] | null;
}

const Homepage = ({topics, history}: Props) => {

  return (
    <section>
      <h1>Dashboard</h1>

      <div className={css.wrapper}>

        <div className={`card ${css.card} ${css.card_inline}`} id={css.ci_1}>
          <Link href="/quizzes" className="big-cta" onClick={() => {}}>
            <Image src={Quizzes} alt="" />
            <span>View Quizzes</span>
          </Link>
          <Link href="/flashcards" className="big-cta" onClick={() => {}}>
            <Image src={Flashcards} alt="" />
            <span>View Flashcards</span>
          </Link>
        </div>

        <div className={`card ${css.card} ${css.card_inline}`} id={css.ci_2}>
          <Link href="/collections" className="big-cta" onClick={() => {}}>
            <Image src={Quizzes} alt="" />
            <span>View Collections</span>
            <Info text="Collections are groups of quizzes of identical type. You can combine multiple quizzes into a single game to play." />
          </Link>
          <Link href="/decks" className="big-cta" onClick={() => {}}>
            <Image src={Flashcards} alt="" />
            <span>View Decks</span>
            <Info text="Decks are groups of flashcards of identical type. You can combine multiple flashcards into a single game to play." />
          </Link>
        </div>

        <Link href="/create-quiz" className={`card ${css.card} card-hoverable`} id={css.qm}>
          <span className={css.title}>Quiz me!</span>
          <p>Challenge yourself to a quiz with a topic of your choice.</p>
          <Image src={QuizMe} alt="" className={css.card_img} />
        </Link>

        <Link href="/create-flashcard" className={`card ${css.card} card-hoverable`} id={css.nf}>
          <span className={css.title}>New Flashcard</span>
          <p>Create a flashcard for your spaced-repetition learning sessions.</p>
          <Image src={NewFlashcard} alt="" className={css.card_img} />
        </Link>

        <div className={`card ${css.card}`} id={css.ht}>
          <span className={css.title}>Hot Topics</span>
          <p>Click on a topic to start a quiz on it using AI.</p>
          <WordCloud topics={topics ? topics : null} />
        </div>

        <Link href="/history" className={`card ${css.card} card-hoverable`} id={css.hi}>
          <span className={css.title}>History</span>
          <p>View past attempts.</p>
          <Image src={History} alt="" className={css.card_img} />
        </Link>

        <div className={`card ${css.card}`} id={css.ra}>
          <span className={css.title}>Recent Activity</span>
          <p>You have played a total of {history ? (history.length === 0 ? '0' : history.length) : 0} quizzes.</p>
          
          { history && history.length === 0 ? (
            <span>No games played to show the list</span>
          ) : (
            <div className={`list ${css.list}`}>
              { history && history.map((el, index) => (
                  <QuizListItem data={el} key={index} />
                ))
              }
            </div>
          )}

        </div>

      </div>

    </section>
  )
}

export default Homepage