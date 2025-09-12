import { useEffect, useState } from "react";
import type { StudentInfo } from "../../shared/models";
import "./StudentInfoPage.css";
import CardButton from "../components/cards/CardButton";
import { fetchInfo } from "../lib/studinfo";

enum InfoSize {
  Full = "small",
  Minimized = "minimized"
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

function InfosList({cards, size, onSelect}: {cards: StudentInfo[], size: InfoSize, onSelect: (info: StudentInfo) => void}) {
  return <div className="student-info-cards">
  {
    cards.map((info) => (
      <CardButton key={info.id} title={info.title} subtitle={info.subtitle} image={info.image} onClick={() => onSelect(info)} />
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
      <InfosList cards={cards} onSelect={setActiveInfo} size={activeInfo == null ? InfoSize.Full : InfoSize.Minimized}/>

      {
        activeInfo ? <ActiveInfo info={activeInfo} onClose={() => setActiveInfo(null)} /> : <></>        
      }      
    </div>
  );
}

export default StudentInfoPage;