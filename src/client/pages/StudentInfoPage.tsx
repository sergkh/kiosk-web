import { useEffect, useState } from "react";
import type { StudentInfo } from "../../shared/models";
import StudentCardButton from "../components/cards/StudentCardButton";
import "./StudentInfoPage.css";

async function fetchInfo(): Promise<StudentInfo[]> {
  return fetch('/student-info').then(r => r.json())
}

function ActiveInfo({info, onClose}: {info: StudentInfo, onClose: () => void}) {
  return (
    <div className="active-info">
      <button className="close-button" onClick={onClose}>Закрити</button>
      <h2>{info.title}</h2>
      <img src={info.image} alt={info.title} />
      <p>{info.subtitle}</p>
      <div className="content" dangerouslySetInnerHTML={{__html: info.content}} />
    </div>
  );
}

function InfosList({cards, onSelect}: {cards: StudentInfo[], onSelect: (info: StudentInfo) => void}) {
  return <div className="student-info-cards">
  {
    cards.map((info) => (
      <StudentCardButton key={info.id} info={info} onClick={() => onSelect(info)} />
    ))
  }
  </div>
}

function StudentInfoPage() {
  const [cards, setCards] = useState<StudentInfo[]>([]);
  const [activeInfo, setActiveInfo] = useState<StudentInfo | null>(null);

  useEffect(() => {
    fetchInfo().then(setCards).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Абітурієнтам</h1>
      {
        activeInfo ? 
        <ActiveInfo info={activeInfo} onClose={() => setActiveInfo(null)} /> : 
        <InfosList cards={cards} onSelect={setActiveInfo}/>    
      }      
    </div>
  );
}

export default StudentInfoPage;