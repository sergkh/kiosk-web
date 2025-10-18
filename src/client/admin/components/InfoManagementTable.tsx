import { useEffect, useState } from "react";
import type { InfoCard } from "../../../shared/models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen, faSquarePlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from 'react-hot-toast';
import './InfoManagementTable.css';
import { NavLink } from "react-router";
import { Reorder } from "motion/react";
import { ReordeableInfoCard } from "./ReordeableInfoCard";

type InfoManagementTableProps = {
  adminUrlPrefix: string;
  apiUrl: string;
};

function InfoManagementTable({adminUrlPrefix, apiUrl}: InfoManagementTableProps) {
  const [entries, setEntries] = useState<InfoCard[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [items, setItems] = useState([0, 1, 2, 3]);

  useEffect(() => {
    fetch(apiUrl).then(res => res.json())
    .then((data) => {
      setEntries(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const deleteCard = async (card: InfoCard) => {
    if (!confirm(`Ви впевнені, що хочете видалити картку ${card.title}?`)) {
        return;
    }

    try {
        const deleteResp = await fetch(`${apiUrl}/${card.id}`, {method: 'DELETE' });

        if (!deleteResp.ok) {
          const errorData = await deleteResp.json();
          throw new Error(errorData.error || `Помилка видалення: ${deleteResp.status}`);
        }

        setEntries(prevCards => prevCards.filter(c => c.id !== card.id)); 
    } catch (error: any) {
      console.error("Помилка видалення", error);
      toast.error(`Помилка видалення: ${error.message}`)
    }
  };


  return (
    <div className="cards-list">
      <div className="main-controls"> 
        
        <NavLink to={`${adminUrlPrefix}/create`} className="action-btn">
          <FontAwesomeIcon className="action-btn" icon={faSquarePlus} />
        </NavLink>
      </div>
      
      {loading && <p>Завантаження...</p>}
      <Toaster position="top-center"/>

      <Reorder.Group axis="y" values={entries} onReorder={setEntries}>
        {entries.map((card) => (
          <ReordeableInfoCard key={card.id} card={card} adminUrlPrefix={adminUrlPrefix} onDelete={() => deleteCard(card) }/>
        ))}
      </Reorder.Group>
    </div>
  );
}

export default InfoManagementTable;