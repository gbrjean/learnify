"use client"

import NestedList from "@components/NestedList"
import { useEffect, useRef, useState } from "react";


const Decks = () => {

  const [popup, setPopup] = useState(false)
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

        {/* <span>Empty collections list</span> */}

        <NestedList />
        <NestedList />
        <NestedList />
        <NestedList />
        <NestedList />
        <NestedList />
        

      </div>

    </section>

    <div className={popup ? "nested-list-popup-wrapper --active" : "nested-list-popup-wrapper"}>
    <div className="nested-list-popup" ref={childRef}>
      <span className="nested-list-popup-title">Deck name</span>

      <div>
        <input type="text" />
        <button className="btn-primary" onClick={() => {}}>Create</button>
      </div>
    </div>
    </div>

    </>
  )
}

export default Decks