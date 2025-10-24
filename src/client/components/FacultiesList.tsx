import CardButton, { CardSize } from "../components/cards/CardButton";
import type { Faculty } from "../../shared/models";

type FacultiesListProps = {
  faculties: Faculty[],
  active?: Faculty | null,
  onSelect: (faculty: Faculty) => void
};

function FacultiesList({ faculties, active, onSelect }: FacultiesListProps) {
  const size = active == null ? CardSize.Full : CardSize.Minimized;
  return (
    <div className={"faculties" + (size === CardSize.Minimized ? " minimized" : "")}>
      {faculties.map((faculty) => (
        <CardButton
          key={faculty.id}
          title={faculty.name}
          active={faculty.id === active?.id}
          size={size}
          image={faculty.image}
          onClick={() => onSelect(faculty)}
        />
      ))}
    </div>
  );
}

export default FacultiesList;