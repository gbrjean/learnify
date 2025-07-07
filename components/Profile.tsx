"use client"

import { formatTimeDelta } from '@lib/utils'
import css from '@styles/profile/profile.module.scss'
import { UserProfile } from '@types'

import { signOut } from "next-auth/react"

const Profile = ({data} : {data: UserProfile}) => {
  return (
    <section>
      <div className="cta-header">
        <h1>Profile Statistics</h1>
        <button className="btn-primary" onClick={() => signOut({ callbackUrl: '/login' })}>Sign out</button>
      </div>

      <div className={css.wrapper}>

        <div className={`card ${css.card}`}>
          <span className={css.card_title}>Practiced quizzes</span>
          <p>View statistics for quizzes</p>

          <div className={css.stats}> 
            <div>
              <span className={css.stats_title}>Average accuracy</span>
              <span className={css.stats_value}>{data.practicedQuizzes ? data.practicedQuizzes.averageAccuracy : 0}%</span>
            </div>
            <div>
              <span className={css.stats_title}>Attempts</span>
              <span className={css.stats_value}>{data.practicedQuizzes ? data.practicedQuizzes.attempts : 0}</span>
            </div>
            <div>
              <span className={css.stats_title}>Average time taken</span>
              <span className={css.stats_value}>{data.practicedQuizzes ? formatTimeDelta(data.practicedQuizzes.averageTimeTaken) : 0}</span>
            </div>
            <div>
              <span className={css.stats_title}>Best time taken</span>
              <span className={css.stats_value}>{data.practicedQuizzes ? formatTimeDelta(data.practicedQuizzes.bestTimeTaken) : 0}</span>
            </div>
            <div>
              <span className={css.stats_title}>Worst time taken</span>
              <span className={css.stats_value}>{data.practicedQuizzes ? formatTimeDelta(data.practicedQuizzes.worstTimeTaken) : 0}</span>
            </div>
          </div>

        </div>

        <div className={`card ${css.card}`}>
          <span className={css.card_title}>Practiced flashcards</span>
          <p>View statistics for flashcards</p>

          <div className={`${css.stats} ${css.__normal_grid}`}>
            <div>
              <span className={css.stats_title}>Average accuracy</span>
              <span className={css.stats_value}>{data.practicedFlashcards ? data.practicedFlashcards.averageAccuracy : 0}%</span>
            </div>
            <div>
              <span className={css.stats_title}>Attempts</span>
              <span className={css.stats_value}>{data.practicedFlashcards ? data.practicedFlashcards.attempts : 0}</span>
            </div>
            <div>
              <span className={css.stats_title}>Average proficiency</span>
              <span className={css.stats_value}>{data.practicedFlashcards?.averageProficiency ? data.practicedFlashcards.averageProficiency : 'No data'}</span>
            </div>
            <div>
              <span className={css.stats_title}>Average time taken</span>
              <span className={css.stats_value}>{data.practicedFlashcards ? formatTimeDelta(data.practicedFlashcards.averageTimeTaken) : 0}</span>
            </div>
            <div>
              <span className={css.stats_title}>Best time taken</span>
              <span className={css.stats_value}>{data.practicedFlashcards ? formatTimeDelta(data.practicedFlashcards.bestTimeTaken) : 0}</span>
            </div>
            <div>
              <span className={css.stats_title}>Worst time taken</span>
              <span className={css.stats_value}>{data.practicedFlashcards ? formatTimeDelta(data.practicedFlashcards.worstTimeTaken) : 0}</span>
            </div>
          </div>

        </div>

        <div className={`card ${css.card}`}>
          <span className={css.card_title}>Practiced collections</span>
          <p>View statistics for collections</p>

          <div className={css.stats}>
            <div>
              <span className={css.stats_title}>Average accuracy</span>
              <span className={css.stats_value}>{data.practicedCollections ? data.practicedCollections.averageAccuracy : 0}%</span>
            </div>
            <div>
              <span className={css.stats_title}>Attempts</span>
              <span className={css.stats_value}>{data.practicedCollections ? data.practicedCollections.attempts : 0}</span>
            </div>
            <div>
              <span className={css.stats_title}>Average time taken</span>
              <span className={css.stats_value}>{data.practicedCollections ? formatTimeDelta(data.practicedCollections.averageTimeTaken) : 0}</span>
            </div>
            <div>
              <span className={css.stats_title}>Best time taken</span>
              <span className={css.stats_value}>{data.practicedCollections ? formatTimeDelta(data.practicedCollections.bestTimeTaken) : 0}</span>
            </div>
            <div>
              <span className={css.stats_title}>Worst time taken</span>
              <span className={css.stats_value}>{data.practicedCollections ? formatTimeDelta(data.practicedCollections.worstTimeTaken) : 0}</span>
            </div>
          </div>

        </div>

        <div className={`card ${css.card}`}>
          <span className={css.card_title}>Practiced decks</span>
          <p>View statistics for decks</p>

          <div className={css.stats}>
            <div>
              <span className={css.stats_title}>Average accuracy</span>
              <span className={css.stats_value}>{data.practicedDecks ? data.practicedDecks.averageAccuracy : 0}%</span>
            </div>
            <div>
              <span className={css.stats_title}>Attempts</span>
              <span className={css.stats_value}>{data.practicedDecks ? data.practicedDecks.attempts : 0}</span>
            </div>
            <div>
              <span className={css.stats_title}>Average time taken</span>
              <span className={css.stats_value}>{data.practicedDecks ? formatTimeDelta(data.practicedDecks.averageTimeTaken) : 0}</span>
            </div>
            <div>
              <span className={css.stats_title}>Best time taken</span>
              <span className={css.stats_value}>{data.practicedDecks ? formatTimeDelta(data.practicedDecks.bestTimeTaken) : 0}</span>
            </div>
            <div>
              <span className={css.stats_title}>Worst time taken</span>
              <span className={css.stats_value}>{data.practicedDecks ? formatTimeDelta(data.practicedDecks.worstTimeTaken) : 0}</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  )
}

export default Profile