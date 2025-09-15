import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCrack } from "@fortawesome/free-solid-svg-icons";
import './ErrorOverlay.css';

// Error centered on the page
export function ErrorOverlay({error}: { error: string | null }) {
  return error == null ? <></> : (
    <div className="error"><span><FontAwesomeIcon icon={faHeartCrack} /> {error}</span></div>
  );
}