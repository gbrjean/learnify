"use client"

import { extractWords } from "@lib/utils";
import keyword_extractor from "keyword-extractor";
import { useEffect, useMemo, useState } from "react";

type Props = {
  answer: string;
  setBlankAnswer: React.Dispatch<React.SetStateAction<string>>;
  mode: 'AI' | 'manual';
}

const BlankAnswerInput = ({answer, setBlankAnswer, mode} : Props) => {

  const BLANKS = '_____'

  const [answerWithBlanks, setAnswerWithBlanks] = useState("")

  const keywords = useMemo(() => {
    if(mode == 'AI'){
      const words = keyword_extractor.extract(answer, {
        language: "english",
        remove_digits: true,
        return_changed_case: false,
        remove_duplicates: false,
      })
      const shuffled = words.sort(() => Math.random() - 0.5)
      return shuffled.slice(0,2)

    } else {
      const words = extractWords(answer)
      return words
    }
  }, [answer])

  const replaceKeywordsWithBlanks = () => {
    const answerWithBlanks = keywords.reduce((acc, word) => {
      if(mode == 'AI'){
        return acc.replace(word, BLANKS)
      } else {
        return acc.replace(`<${word}>`, BLANKS)
      }
    }, answer)
    setBlankAnswer(answerWithBlanks)
    setAnswerWithBlanks(answerWithBlanks)
  }

  useEffect(() => {
    replaceKeywordsWithBlanks()
  }, [keywords, answer])
  

  return (
    <p className="quiz-answer-blanks">
      {answerWithBlanks.split(BLANKS).map((part, index) => {
        return (
          <>
            {part}
            {index === answerWithBlanks.split(BLANKS).length - 1 
              ? null 
              : <input type="text" id="blank-input" />
            }
          </>
        )
      })}
    </p>
  )
}

export default BlankAnswerInput