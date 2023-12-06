"use client"

import NestedList from "@components/NestedList"
import { createGroup } from "@lib/actions/group.actions"
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation"


const Decks = ({groups} : {groups: any}) => {

  const pathname = usePathname()

  const [popup, setPopup] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAddDeck = async () => {
    try {
      if(inputRef.current && inputRef.current.value.trim() !== ''){
        await createGroup(inputRef.current.value, 'deck', 'flashcards', pathname)
      } else {
        //TODO: toast
      }
    } catch (error: any) {
      console.log(error.message)
    } finally {
      setPopup(false)
      if(inputRef.current && inputRef.current.value){
        inputRef.current.value = ''
      }
    }
  }


  const childRef = useRef<HTMLDivElement | null>(null);

  const handleDocumentClick = (event: MouseEvent) => {
    if (childRef.current && !childRef.current.contains(event.target as Node)) {
      setPopup(false);
    }
  };

  useEffect(() => {
    if (popup) {
      document.addEventListener('click', handleDocumentClick);
    } else {
      document.removeEventListener('click', handleDocumentClick);
    }

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [popup]);


  return (
    <>

    <section className="nested-list-wrapper">

      <div className="nested-list-wrapper-header">
        <h1>Decks</h1>
        <button className="btn-primary" onClick={() => setPopup(prev => !prev)}>New deck</button>
      </div>

      <div className="nested-list-collections">

        { groups && groups.length === 0 
            ? <span>Empty decks list</span>
            : groups.map((group: any) => <NestedList group={group} /> )

        }

      </div>

    </section>

    <div className={popup ? "nested-list-popup-wrapper --active" : "nested-list-popup-wrapper"}>
    <div className="nested-list-popup" ref={childRef}>
      <span className="nested-list-popup-title">Deck name</span>

      <div>
        <input type="text" ref={inputRef} />
        <button className="btn-primary" onClick={() => handleAddDeck()}>Create</button>
      </div>
    </div>
    </div>

    </>
  )
}

export default Decks