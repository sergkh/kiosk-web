import { useEffect, useState } from "react";
import type { Info } from "../../../shared/models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen, faSquarePlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from 'react-hot-toast';
import './InfoManagementTable.css';
import { NavLink } from "react-router";

type InfoManagementTableProps = {
  adminUrlPrefix: string;
  apiUrl: string;
};

function InfoManagementTable({adminUrlPrefix, apiUrl}: InfoManagementTableProps) {
  const [entries, setEntries] = useState<Info[]>([]);
  const [loading, setLoading] = useState(true);

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

  const deleteCard = async (card: Info) => {
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
    <div className="cards-table">
      <div className="main-controls"> 
        
        <NavLink to={`${adminUrlPrefix}/create`} className="action-btn">
          <FontAwesomeIcon className="action-btn" icon={faSquarePlus} />
        </NavLink>
      </div>
      
      {loading && <p>Завантаження...</p>}
      <Toaster position="top-center"/>
      <table>
        <thead>
          <tr>
            <th>Назва</th>
            <th>Підзаголовок</th>
            <th>Контент</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {entries.map(card => (
            <tr key={card.id}>
              <td>{card.title}</td>
              <td>{card.subtitle}</td>
              <td>{card.content ? card.content.substring(0, 100) + '...' : 'Немає'}</td>
              <td className='right'>
                  <NavLink to={`${adminUrlPrefix}/edit/${card.id}`} className="action-btn">
                    <FontAwesomeIcon className="action-btn" icon={faFilePen} />
                  </NavLink>
                  &nbsp;
                  <FontAwesomeIcon className="action-btn" icon={faTrash} onClick={() => deleteCard(card)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InfoManagementTable;