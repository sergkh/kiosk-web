import { useEffect, useState } from "react";
import type { AbiturientInfo } from "../../shared/models";
import "./StudentInfoPage.css";
import CardButton, { CardSize } from "../components/cards/CardButton";
import { fetchInfo } from "../lib/abitinfo";
import { motion } from "motion/react";
import CloseButton from "../components/cards/CloseButton";

type CardsListProps = {
  cards: AbiturientInfo[],
  active?: AbiturientInfo | null,
  onSelect: (info: AbiturientInfo) => void
};

function InfosList({cards, active, onSelect}: CardsListProps) {
  const size = active == null ? CardSize.Full : CardSize.Minimized;
  return <motion.div 
    className={ "student-info-cards" + (size === CardSize.Minimized ? " minimized" : "") }
    transition={{ duration: 0.6, ease: "easeInOut" }}>
  {
    cards.map((info) => (
      <CardButton 
        key={info.id} 
        title={info.title} 
        subtitle={info.subtitle} 
        image={info.image} 
        size={size}
        active={info.id === active?.id} 
        onClick={() => onSelect(info)} />
    ))
  }
  </motion.div>
}

function ActiveInfo({info, onClose}: {info: AbiturientInfo, onClose: () => void}) {
  return (
    <div className="active-info">      
      <CloseButton onClick={onClose} />
      <section>              
        <div className="content" dangerouslySetInnerHTML={{__html: info.content}} />
      </section>
    </div>
  );
}

function AbiturientInfoPage() {
  const [cards, setCards] = useState<AbiturientInfo[]>([]);
  const [activeInfo, setActiveInfo] = useState<AbiturientInfo | null>(null);

  useEffect(() => {
    fetchInfo().then(setCards).catch(console.error);
  }, []);

  return (
    <div className="abiturient-info-page">
      { (activeInfo == null) ? <h1>Абітурієнтам</h1> : <></> }

      <InfosList cards={cards} onSelect={setActiveInfo} active={activeInfo} />

      {
        activeInfo ? <ActiveInfo info={activeInfo} onClose={() => setActiveInfo(null)} /> : <></>        
      }      
    </div>
  );
}

export default AbiturientInfoPage;