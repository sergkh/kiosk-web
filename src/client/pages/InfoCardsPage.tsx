import { useEffect, useState } from "react";
import type { InfoCard } from "../../shared/models";
import "./InfoCardsPage.css";
import CardButton, { CardSize } from "../components/cards/CardButton";
import { motion } from "motion/react";
import CloseButton from "../components/cards/CloseButton";
import { useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { loadCategory } from "../lib/loaders";

type CardsListProps = {
  cards: InfoCard[],
  active?: InfoCard | null,
  onSelect: (info: InfoCard) => void
};

type CardWithSubItems = InfoCard & {  
  subItems?: InfoCard[]
};

export type InfoCardsPageProps = {
  title: string
};

// load subcategories for cards if present or do nothing
function loadSubItems(card: CardWithSubItems | null, update: (i: CardWithSubItems) => void): void {  
  if (card && card.subcategory && !card.subItems) {
    loadCategory(card.subcategory).then((data) => {
      card.subItems = data;
      update({...card}); // trigger re-render
    });
  }
}

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

// Active info component can have sub categories whaich are displayed as buttons 
// or content that is displayed when a card is selected
function ActiveInfo({info, onClose}: {info: CardWithSubItems, onClose: () => void}) {
  const [activeInfo, setActiveInfo] = useState<CardWithSubItems | null>(info);

  // reset active info when info changes, otherwise when swithcing tabs some remaining opened
  useEffect(() => setActiveInfo(info), [info]);

  return (<>
    { 
      info.subcategory ? 
        <InfosList cards={info.subItems ?? []} onSelect={setActiveInfo} active={activeInfo == info ? null : activeInfo} /> : null
    }

    {
      activeInfo && activeInfo.content && <div className="active-info">
        <CloseButton onClick={onClose} />
        <section>              
          <div className="content" dangerouslySetInnerHTML={{__html: activeInfo.content }} />
        </section>
      </div>
    }
  </>);
}


function InfoCardsPage({title}: InfoCardsPageProps) {
  const cards = useLoaderData() as CardWithSubItems[];
  const {t} = useTranslation();
  const [activeInfo, setActiveInfo] = useState<CardWithSubItems | null>(null);

  useEffect(() => loadSubItems(activeInfo, setActiveInfo), [activeInfo]);

  return (
    <div className="info-page">
      {activeInfo == null ? <h1>{t(title)}</h1> : null}

      <InfosList cards={cards} onSelect={setActiveInfo} active={activeInfo} />

      {activeInfo ? <ActiveInfo info={activeInfo} onClose={() => setActiveInfo(null)} /> : null}
    </div>
  );
}

export default InfoCardsPage;