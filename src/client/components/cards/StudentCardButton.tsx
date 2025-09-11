import { NavLink } from "react-router";
import type { StudentInfo } from '../../../shared/models';
import './StudentCardButton.css';

type ButtonProps = {
  info: StudentInfo,
  onClick?: () => void
};

export default function StudentCardButton({ info, onClick }: ButtonProps) {
  return (
    <div className="student-info-card" onClick={onClick}> 
      
      <img src={info.image} alt={info.title} width={100} height={100} />
      
      <h3>{info.title}</h3>
      <p>{info.subtitle}</p>
    </div>
  );
}