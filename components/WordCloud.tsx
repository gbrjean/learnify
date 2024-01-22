"use client"

import D3WordCloud from "react-d3-cloud"
import { useRouter } from "next/navigation"
import { PopularTopic } from "@types"
import { useEffect, useMemo, useState } from "react"
import css from '@styles/homepage/homepage.module.scss'



const WordCloud = ({topics} : {topics: PopularTopic[] | null}) => {

  const router = useRouter()

  if(!topics || topics.length === 0){
    return
  }

  const [baseFontSize, setBaseFontSize] = useState(window.innerWidth > 1200 ? 16 : 32);

  const data: {text: string; value: number}[] = useMemo(() => {
    const processedData: any[] = topics.map(el => {
      return {
        text: el.topic,
        value: el.count
      }
    })
    return processedData
  }, [topics]);

  const fontSizeMapper = (word: { value: number }) => {
    return Math.log2(word.value) * 5 + baseFontSize
  }


  useEffect(() => {
    const handleResize = () => {
      setBaseFontSize(window.innerWidth > 1200 ? 16 : 32);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  

  return (
    <div id={css.word_cloud}>
      <D3WordCloud
        data={data}
        height={500}
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={"#5E7CE2"}
        onWordClick={(e, d) => {
          router.push("/create-quiz?topic=" + d.text);
        }}
        
      />
    </div>
  )
}

export default WordCloud