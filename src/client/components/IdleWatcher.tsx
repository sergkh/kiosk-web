import { use, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

let idleTimeout = import.meta.env.VITE_IDLE_TIMEOUT || 10*60*1000; // Default to 10 minutes if not set


function IdleWatcher({redirectTo}: {redirectTo: string}) {
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoId = import.meta.env.VITE_IDLE_VIDEO_ID;

  const resetTimer = () => {    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => navigate(redirectTo), idleTimeout);
  };

  useEffect(() => {
    // User activity events
    const events = ["touchstart", "mousemove", "click", "scroll"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // start only if idleTimeout and videoId are set
    if (idleTimeout > 0 && videoId) {
      resetTimer();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [idleTimeout, navigate]);

  return null;
}

export default IdleWatcher;