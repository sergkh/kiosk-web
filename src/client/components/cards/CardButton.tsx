import './CardButton.css';

type ButtonProps = {
  title: string,
  subtitle?: string | null,
  image?: string | null,
  onClick?: () => void
};

export default function CardButton({ title, subtitle, image, onClick }: ButtonProps) {
  return (
    <div className="info-card" onClick={onClick}>      
      { image ? <img src={image} alt={title} /> : <></> }      
      <h3>{title}</h3>      
      { subtitle ? <p>{subtitle}</p> : <></> }
    </div>
  );
}