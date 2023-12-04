"use client"

import '@styles/profile/profile.scss'

import { signOut } from "next-auth/react"

const Profile = () => {
  return (
    <section>
      <div className="cta-header">
        <h1>Profile Statistics</h1>
        <button className="btn-primary" onClick={() => signOut({ callbackUrl: '/login' })}>Sign out</button>
      </div>

      <div className="wrapper">

        <div className="card">
          <span className='card-title'>Practiced quizzes</span>
          <p>View statistics for quizzes</p>

          <div className="stats"> 
          {/* // GRID cu grid-row de la Average TT */}
            <div>
              <span className="stats-title">Average accuracy</span>
              <span className='stats-value'>67.76%</span>
            </div>
            <div>
              <span className="stats-title">Attempts</span>
              <span className='stats-value'>456</span>
            </div>
            <div>
              <span className="stats-title">Average time taken</span>
              <span className='stats-value'>56s</span>
            </div>
            <div>
              <span className="stats-title">Best time taken</span>
              <span className='stats-value'>10s</span>
            </div>
            <div>
              <span className="stats-title">Worst time taken</span>
              <span className='stats-value'>3min 52s</span>
            </div>
          </div>

        </div>

        <div className="card">
          <span className='card-title'>Practiced flashcards</span>
          <p>View statistics for flashcards</p>

          <div className="stats --normal-grid">
            <div>
              <span className="stats-title">Average accuracy</span>
              <span className='stats-value'>67.76%</span>
            </div>
            <div>
              <span className="stats-title">Attempts</span>
              <span className='stats-value'>456</span>
            </div>
            <div>
              <span className="stats-title">Average proficiency</span>
              <span className='stats-value'>Good</span>
            </div>
            <div>
              <span className="stats-title">Average time taken</span>
              <span className='stats-value'>56s</span>
            </div>
            <div>
              <span className="stats-title">Best time taken</span>
              <span className='stats-value'>10s</span>
            </div>
            <div>
              <span className="stats-title">Worst time taken</span>
              <span className='stats-value'>3min 52s</span>
            </div>
          </div>

        </div>

        <div className="card">
          <span className='card-title'>Practiced collections</span>
          <p>View statistics for collections</p>

          <div className="stats">
            <div>
              <span className="stats-title">Average accuracy</span>
              <span className='stats-value'>67.76%</span>
            </div>
            <div>
              <span className="stats-title">Attempts</span>
              <span className='stats-value'>456</span>
            </div>
            <div>
              <span className="stats-title">Average time taken</span>
              <span className='stats-value'>56s</span>
            </div>
            <div>
              <span className="stats-title">Best time taken</span>
              <span className='stats-value'>10s</span>
            </div>
            <div>
              <span className="stats-title">Worst time taken</span>
              <span className='stats-value'>3min 52s</span>
            </div>
          </div>

        </div>

        <div className="card">
          <span className='card-title'>Practiced decks</span>
          <p>View statistics for decks</p>

          <div className="stats">
            <div>
              <span className="stats-title">Average accuracy</span>
              <span className='stats-value'>67.76%</span>
            </div>
            <div>
              <span className="stats-title">Attempts</span>
              <span className='stats-value'>456</span>
            </div>
            <div>
              <span className="stats-title">Average time taken</span>
              <span className='stats-value'>56s</span>
            </div>
            <div>
              <span className="stats-title">Best time taken</span>
              <span className='stats-value'>10s</span>
            </div>
            <div>
              <span className="stats-title">Worst time taken</span>
              <span className='stats-value'>3min 52s</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  )
}

export default Profile