import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import config from "../lib/config";


function IdleWatcher({redirectTo}: {redirectTo: string}) {
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoId = config.idleVideoId;

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (config.idleTimeout > 0 && videoId) {
      timerRef.current = setTimeout(() => navigate(redirectTo), config.idleTimeout);
    }
  };

  useEffect(() => {
    // User activity events
    const events = ["touchstart", "mousemove", "click", "scroll"];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // start only if idleTimeout and videoId are set
    if (config.idleTimeout > 0 && videoId) {
      resetTimer();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [navigate]);

  return null;
}

export default IdleWatcher;