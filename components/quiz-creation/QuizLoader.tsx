"use client"

import { MascotLogo } from "@public/assets/icons/mascotLogo"
import { useEffect, useState } from "react"


const QuizLoader = ({finished}: {finished: boolean}) => {

  const LOADING_TEXTS = [
    "Generating questions...",
    "Unraveling mysteries beyond imagination...",
    "Navigating the realms of infinite inquiry...",
    "Venturing into the uncharted territories of knowledge...",
    "Evolving amidst the symphony of boundless queries..."
  ]

  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState(LOADING_TEXTS[0])

  useEffect(() => {
    const interval = setInterval(() => {
      let index = Math.floor(Math.random() * LOADING_TEXTS.length)
      setLoadingText(LOADING_TEXTS[index])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if(finished) return 100
        if(prev >= 100) return 0
        if(Math.random() < 0.4) return prev + 3
      
        return prev + 1
      })
    }, 100)
    return () => clearInterval(interval)
  }, [finished])
  
  

  return (
    <section className="loading-section">
      <div className="pic">
        <MascotLogo />
      </div>

      <div className="progressbar">
        <div className="progressbar-inner" style={{ '--progress' : `${progress}%` } as React.CSSProperties}></div>
      </div>

      <p>{loadingText}</p>
    </section>
  )
}

export default QuizLoader