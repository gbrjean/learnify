"use client"

import Image from "next/image";
import Check from "@public/assets/images/check-answer.png"
import Cross from "@public/assets/images/cross-answer.png"
import Accuracy from "@public/assets/images/accuracy.png"
import { DeleteIcon } from "@public/assets/icons/DeleteIcon";
import { TableData } from "@types";
import Link from "next/link";
import { deleteGame } from "@lib/actions/game.actions";
import { usePathname } from "next/navigation";


const Table = ({
   data: { 
      titles, 
      topics, 
      topicAsLink,
      elements, 
      isResult, 
      isAccuracy, 
      checks, 
      crosses, 
      accuracies,
      ids,
      isSummary,
      isMCQ,
      correct_answers,
      ctaFunctions,
   } 
}: { data: TableData }) => {

  const pathname = usePathname()

  const handleDeleteGame = async (id: string) => {
    try {
      await deleteGame(id, pathname)
    } catch (error: any) {
      console.log(`Error deleting game: ${error.message}`)
    }
  }

  return (
    <div className={isSummary ? (isMCQ ? "table -summary-mcq" :"table -summary") : "table"}>

      <div className="table-head">
        {topics && <span>Topic</span>}
        {isSummary && <span>No.</span>}
        {titles.map(title => <span>{title}</span>)}
        {isResult && <span>Result</span>}
      </div>

      { elements.map((element, key) => (

        <div className="table-element" key={key}>

          { topics &&
            <div>
              <span>Topic</span>
              <div className="table-element-topic">
                { topicAsLink && ids
                    ? <Link href={`/play/${ids[key]}`} className='table-element-topic-title'>{topics[key]}</Link>
                    : <span className='table-element-topic-title'>{topics[key]}</span>
                }
              </div>
            </div>
          }

          { isSummary && 
            <div>
              <span>No.</span>
              <span>{key+1}</span> 
            </div>
          }

          { element.map((item, index) => (
            <div key={index}>
              <span>{titles[index]}</span>
              { isSummary ? (
                  index === 0 ? (
                    <div>
                      {(item as string).split('@').map((text, i) => (
                        <p key={i}>{text.trim()}</p>
                      ))}
                    </div>
                  ) : (
                    correct_answers ? (
                      <span className={correct_answers.includes(key+1) ? '-correct' : '-wrong'}>{item}</span>
                    ) : (
                      <span>{item}</span>
                    )
                  )
              ) : (
                  <span>{item}</span>
              )}
            </div>
          ))}


          { ids && ctaFunctions &&
              ctaFunctions.map((func => {
                if(func == 'deleteGame'){
                  return (
                    <div className="cta" onClick={() => handleDeleteGame(ids[key])} id={ids[key]}>
                      <DeleteIcon />
                    </div>
                  )
                }
              }))
          }


          { isResult &&
            <div>
              <span>Result</span>

              { isAccuracy && accuracies !== undefined ? (      
                  <div className="table-element-accuracy">
                    <Image src={Accuracy} alt="" />
                    <span>{accuracies[key]} %</span>
                  </div>      
              ) : (
                checks !== undefined && crosses !== undefined &&
                  <div className="table-element-result">
                    <div>
                      <Image src={Check} alt="" />
                      <span>{checks[key]}</span>
                    </div>
                    <div>
                      <span>{crosses[key]}</span>
                      <Image src={Cross} alt="" />
                    </div>
                  </div>
              )}

            </div>
          }

        </div>

      ))}




    </div>
  )
}

export default Table