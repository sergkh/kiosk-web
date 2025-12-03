import React, { useRef, useEffect, useState } from 'react';
import type { Video } from '../../../shared/models';
import { useTranslation } from 'react-i18next';
import config from '../../lib/config';

interface VideoModalProps {
  video: Video;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const { t, i18n } = useTranslation();  
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [subtitleSrc, setSubtitleSrc] = useState<string | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Load subtitle for current language
  useEffect(() => {
    const loadSubtitle = async () => {      
      if (!video.id || !isVideoFile) {
        setSubtitleSrc(null);
        return;
      }

      try {
        const subtitleUrl = `${config.baseUrl}api/videos/${video.id}/subtitles/${i18n.language}`;
        const response = await fetch(subtitleUrl);
        if (response.ok) {
          setSubtitleSrc(subtitleUrl);
        } else {
          setSubtitleSrc(null);
        }
      } catch (error) {
        console.error('Error loading subtitle:', error);
        setSubtitleSrc(null);
      }
    };

    loadSubtitle();
  }, [video, i18n.language]);

  useEffect(() => {
    if (videoRef.current && subtitleSrc) {
      const timer = setTimeout(() => {
        const tracks = videoRef.current?.textTracks;
        if (tracks && tracks.length > 0) {
          for (let i = 0; i < tracks.length; i++) {
            tracks[i].mode = 'showing';
          }
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [video, subtitleSrc]);

  const toggleFullscreen = async () => {
    if (!modalRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await modalRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Помилка повноекранного режиму:', err);
    }
  };

  const handleClose = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    onClose();
  };

  const isVideoFile = /\.(mp4|webm|ogg)$/i.test(video.src);
  
  // Build subtitles array with current language subtitle if available
  const subtitles = subtitleSrc ? [{
    language: i18n.language === 'uk' ? 'uk' : 'en',
    label: i18n.language === 'uk' ? 'Українська' : 'English',
    src: subtitleSrc
  }] : [];

  return (
    <div 
      ref={modalRef}
      className={`video-modal ${isFullscreen ? 'video-modal--fullscreen' : ''}`}
      onClick={handleClose}
    >
      <div className="video-modal__content" onClick={(e) => e.stopPropagation()}>
        <div className="video-wrapper">
          {isVideoFile ? (
            <video
              ref={videoRef}
              src={video.src}
              controls
              crossOrigin="anonymous"
              controlsList="nodownload nopictureinpicture"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            >
              {subtitles.map((subtitle) => (
                <track
                  key={subtitle.language}
                  kind="subtitles"
                  src={subtitle.src}
                  srcLang={subtitle.language}
                  label={subtitle.label}
                />
              ))}
            </video>
          ) : (
            <iframe
              src={`${video.src}`}
              allow="autoplay; encrypted-media"
              allowFullScreen={false}
            />
          )}

          <div className={`block-logo ${isFullscreen ? 'block-logo--fullscreen' : ''}`}></div>
          <div className={`block-title ${isFullscreen ? 'block-title--fullscreen' : ''}`}></div>
          <div className={`block-actions ${isFullscreen ? 'block-actions--fullscreen' : ''}`}></div>
        </div>

        <div className='video-modal-title'> *Для виходу клікніть за рамками відео</div>
      </div>
    </div>
  );
};