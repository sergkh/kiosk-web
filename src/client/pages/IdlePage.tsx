import { useMemo } from 'react';
import { useNavigate } from 'react-router';



function IdlePage() {
  const navigate = useNavigate();
  
  const videoId = import.meta.env.VITE_IDLE_VIDEO_ID;
  const videoSrc = useMemo(() => {
    const params = new URLSearchParams({
      autoplay: '1',
      controls: '0',
      mute: '1',
      loop: '1',
      playlist: videoId,
      modestbranding: '1',
      rel: '0'
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, [videoId]);

  const handleClick = () => {
    navigate('/')
  };

  return (
    <div
      className="idle-page"
      onClick={handleClick}
      role="button"
      aria-label="Exit idle video"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'black',
        width: '100vw',
        height: '100vh',
        cursor: 'pointer'
      }}
    >
      <iframe
        title="Idle video"
        src={videoSrc}
        allow="autoplay; fullscreen"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

export default IdlePage;