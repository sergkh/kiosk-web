import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from '@fortawesome/free-solid-svg-icons';
import './CloseButton.css';

export default function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.div 
        className="close-button" 
        onClick={onClick} 
        whileHover={{ scale: 1.1 }}
        whileTap={{scale: 0.9 }}
      >
        <FontAwesomeIcon icon={faClose} />
    </motion.div>
  );
}