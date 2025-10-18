import { Reorder, useMotionValue } from "motion/react";
import { useRaisedShadow } from "../lib/raised-shadow";
import type { InfoCard } from "../../../shared/models";
import './ReordeableInfoCard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen, faLink, faList, faTrash } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router";

interface Props {
  card: InfoCard;
  adminUrlPrefix: string;
  onDelete?: () => void;
}

export const ReordeableInfoCard = ({ card, adminUrlPrefix, onDelete }: Props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  return (
    <Reorder.Item value={card} id={card.id} className="card" style={{ boxShadow, y }}>      
      <div className="card-data">
          {
          card.image && <img src={card.image} alt={card.title} className="card-image" />
          }
        <div> 
          <h3>{card.title}</h3>

          { card.subtitle && <h4>{card.subtitle}</h4> }
          
          { card.subcategory && <div title="Підменю" className="card-subcategory"><FontAwesomeIcon icon={faList} /> {card.subcategory}</div> }

          <div className="card-content">
            { card.resource && <FontAwesomeIcon icon={faLink} /> }
            {card.content ? card.content.substring(0, 100) + '...' : (card.subcategory ? '' : 'Немає вмісту')}
          </div>
        </div>
      </div>

      <div>
        <NavLink to={`${adminUrlPrefix}/edit/${card.id}`} className="action-btn">
            <FontAwesomeIcon className="action-btn" icon={faFilePen} />
        </NavLink>
        &nbsp;
        <FontAwesomeIcon className="action-btn" icon={faTrash} onClick={onDelete} />
      </div>
    </Reorder.Item>
  );
};