"use client"

import D3WordCloud from "react-d3-cloud"
import { useRouter } from "next/navigation"

const data = [
  {
    text: "Blender",
    value: 3,
  },
  {
    text: "Web dev",
    value: 10,
  },
  {
    text: "Figma",
    value: 4,
  },
  {
    text: "NextJS",
    value: 7,
  }
]

const fontSizeMapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16
}

const WordCloud = () => {

  const router = useRouter()

  return (
    <>
      <D3WordCloud
        data={data}
        height={500}
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={"#5E7CE2"}
        onWordClick={(e, d) => {
          console.log("Text is " + d.text)
          // router.push("/quiz?topic=" + d.text);
        }}
      />
    </>
  )
}

export default WordCloud