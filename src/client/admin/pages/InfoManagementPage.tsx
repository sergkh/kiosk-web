import { use, useEffect, useState } from "react";
import type { InfoCard } from "../../../shared/models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { Toaster } from 'react-hot-toast';
import { NavLink, useLoaderData, useParams } from "react-router";
import { Reorder } from "motion/react";
import { ReordeableInfoCard } from "../components/ReordeableInfoCard";
import performWithUndo, { delayedAction } from "../lib/undo";
import './InfoManagementPage.css';

function InfoManagementTable() {  
  const { category } = useParams<{ category: string }>();
  const loadedEntries = useLoaderData() as InfoCard[];
  
  const [entries, setEntries] = useState<InfoCard[]>(loadedEntries || []);

  const adminUrlPrefix = `/admin/categories/${category}`;
  const apiUrl = `/api/info/${category}`;
  
  useEffect(() => {
    setEntries(loadedEntries || []);
  }, [loadedEntries, category]);

  const title = category === 'students' ? 'Картки студентів' :
                category === 'abiturients' ? 'Картки абітурієнтів' :
                category === 'news' ? 'Новини' :
                category === 'faculties' ? 'Факультети' : 'Інформаційні картки';

  const deleteCard = (card: InfoCard) => {
    const index = entries.indexOf(card);
    setEntries(prevCards => prevCards.filter(c => c.id !== card.id)); 

    const deletionAction = async () => {
      const deleteResp = await fetch(`${apiUrl}/${card.id}`, {method: 'DELETE' });

      if (!deleteResp.ok) {
        const errorData = await deleteResp.json();
        throw new Error(errorData.error || `Помилка видалення: ${deleteResp.status}`);
      }
    }

    const undoAction = () => {
      setEntries((prev) => {
          const newItems = [...prev];        
          newItems.splice(index, 0, card); // Restore to original position
          return newItems;
        })
    }

    performWithUndo("Картку видалено", deletionAction,{ onUndo: undoAction });
  };

  const togglePublishing = (card: InfoCard) => {
    const updateAction = async () => {
      const updateResp = await fetch(`${apiUrl}/${card.id}/published`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !card.published })
      });

      if (!updateResp.ok) {
        const errorData = await updateResp.json();
        throw new Error(errorData.error || `Помилка оновлення статусу: ${updateResp.status}`);
      }

      return await updateResp.json();
    };

    const updateCard = (publish: boolean) => {
      setEntries((prev) => {
        return prev.map((c) => c.id === card.id ? { ...c, published: publish } : c);
      });
    }

    performWithUndo(`Картку ${!card.published ? 'опубліковано' : 'приховано'}`, updateAction, { onUndo: () => updateCard(card.published) });
    
    updateCard(!card.published);
  };

  const reorderCards = (entries: InfoCard[]) => {
    setEntries(entries);
    delayedAction('reorder-cards', async () => {
      const ids = entries.map(e => e.id);
      const resp = await fetch(`${apiUrl}/reorder`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: ids })
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error || `Помилка оновлення порядку карток: ${resp.status}`);
      }
    });
  }

  return (
    <div>
      <h2>{title}</h2>          
      <div className="cards-list">
        <div className="main-controls"> 
          
          <NavLink to={`${adminUrlPrefix}/create`} className="action-btn">
            <FontAwesomeIcon className="action-btn" icon={faSquarePlus} />
          </NavLink>
        </div>

        <Toaster position="top-center"/>

        <Reorder.Group axis="y" values={entries} onReorder={reorderCards}>
          {entries.map((card) => (
            <ReordeableInfoCard 
              key={card.id} 
              card={card} 
              adminUrlPrefix={adminUrlPrefix} 
              onDelete={() => deleteCard(card)} 
              onPublishingChanged={() => togglePublishing(card)}
            />
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}

export default InfoManagementTable;