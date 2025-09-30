import { useState } from 'react';
import './CardButton.css';
import { motion } from "motion/react";

export enum CardSize {
  Full = "full",
  Minimized = "minimized",
  Micro = "micro"
}

type ButtonProps = {
  title: string,
  subtitle?: string | null,
  image?: string | null,
  active?: boolean,
  size?: CardSize | null,
  onClick?: () => void
};

export default function CardButton({ title, subtitle, image, active, onClick, size }: ButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={"info-card" + (active ? " active" : "") + (size ? ` ${size}` : "")}
      onClick={ () => {        
        if (onClick) onClick()
      }}>      
        { image ? <img src={image} alt={title} /> : <></> }   
        <div className="card-text">
          <h3>{title}</h3>      
          { (size != CardSize.Minimized && subtitle) ? <p className="subtitle">{subtitle}</p> : <></> }
        </div>
    </motion.div>
  );
}