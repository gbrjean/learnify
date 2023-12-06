"use client"

import Image from "next/image";
import Check from "@public/assets/images/check-answer.png"
import Cross from "@public/assets/images/cross-answer.png"
import Accuracy from "@public/assets/images/accuracy.png"
import Clock from "@public/assets/images/clock-white.png"
import { DeleteIcon } from "@public/assets/icons/DeleteIcon";
import { TableData } from "@types";
import Link from "next/link";
import { deleteGame } from "@lib/actions/game.actions";
import { usePathname } from "next/navigation";
import { AddIcon } from "@public/assets/icons/AddIcon";
import { addGameToGroup } from "@lib/actions/group.actions";
import { useEffect, useRef, useState } from "react";
import { ConfirmIcon } from "@public/assets/icons/ConfirmIcon";

type SelectedGame = {
  id: string;
  type: 'mcq' | 'open-ended';
}


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
   },
   groups,
   groupsFor
}: { data: TableData; groups?: any, groupsFor: 'collections' | 'decks' }) => {

  const pathname = usePathname()


  const [selectedGame, setSelectedGame] = useState<SelectedGame | undefined>(undefined) 
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | undefined>(undefined)
  const [showGroups, setShowGroups] = useState(false)



  const handleDeleteGame = async (id: string) => {
    try {
      await deleteGame(id, pathname)
    } catch (error: any) {
      console.log(`Error deleting game: ${error.message}`)
    }
  }


  const handleAddToGroup = async (groupId: string) => {
    try {
      if(selectedGame){
        await addGameToGroup(selectedGame.id, groupId, selectedGame.type, pathname)
        //TODO: toast de succes
      }
    } catch (error: any) {
      //TODO: toast
      console.log(error.message)
    } finally {
      setShowGroups(false)
    }
  }

  const handleAddClick = (gameId: string, gameType: string) => {
    if(gameType == 'Multiple Choice' || gameType == 'Open Ended'){

      setSelectedGame({
        id: gameId,
        type: gameType == 'Multiple Choice' ? 'mcq' : 'open-ended'
      })
      setShowGroups(true)
    }
  }


  useEffect(() => {
    if(selectedGroupIndex !== undefined){
      setSelectedGroupIndex(undefined)
    }
  }, [selectedGame])
  


  const popupRef = useRef<HTMLDivElement | null>(null);

  const handleDocumentClick = (event: MouseEvent) => {
    const addCtaElements = document.querySelectorAll('.cta-add');
    if (popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !Array.from(addCtaElements).some(element =>
          element.contains(event.target as Node)
        )
    ) {
      setShowGroups(false)
    }
  };

  useEffect(() => {
    if (showGroups) {
      document.addEventListener('click', handleDocumentClick);
    } else {
      document.removeEventListener('click', handleDocumentClick);
    }

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [showGroups]);



  return (
    <div className={isSummary ? (isMCQ ? "table -summary-mcq" :"table -summary") : "table"}>

      { showGroups &&
        <div className="table-popup nested-list nested-list-wrapper" ref={popupRef}>
          <div className="nested-list-collections">
            { groups && groups.length === 0 ? (
                <span>Empty {groupsFor} list</span>
            ) : (
              groups.map((group: any, groupIndex: number) => (
                <div className="nested-list">

                  <div className="nested-list-header">
                    <div className="nested-list-content" onClick={() => setSelectedGroupIndex(groupIndex)}>
                      <span className="nested-list-content-title">{group.title}</span>
                      <div className="list-item-date">
                        <Image src={Clock} alt="" />
                        <span>{group.created_at}</span>
                      </div>
                      { selectedGroupIndex === groupIndex &&
                        <div className="confirm-cta" onClick={() => handleAddToGroup(group._id)}>
                          <ConfirmIcon />
                        </div>
                      }
                    </div>
                  </div>
                  
                </div>
              ))
            )}
          </div>
        </div>
      }


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
            <div className="table-element-ctas">
              { ctaFunctions.map((func => {
                  if(func == 'deleteGame'){
                    return (
                      <div className="cta" onClick={() => handleDeleteGame(ids[key])} >
                        <DeleteIcon />
                      </div>
                    )
                  }
                  if(func == 'addGame'){
                    //? element[1] -> game.game_type
                    return (
                      <div className="cta cta-add" onClick={() => handleAddClick(ids[key], element[1] as string)} >
                        <AddIcon />
                      </div>
                    )
                  }
                }))
              }
            </div>
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