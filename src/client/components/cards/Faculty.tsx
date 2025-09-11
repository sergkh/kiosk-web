import type { Faculty } from '../../../shared/models';
import './Faculty.css'

type ButtonProps = {
  faculty: Faculty,
  onClick?: () => void
};

export default function FacultyCardButton({ faculty, onClick }: ButtonProps) {
  return (
    <div className="faculty-card" onClick={onClick}> 
    
      <img src={faculty.image} alt={faculty.name} />
    
      <h3>{faculty.name}</h3>
    </div>    
  );
}