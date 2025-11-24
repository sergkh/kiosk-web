import React, { useState, useMemo, useEffect } from 'react';
import { CategoryFilter } from '../components/video/CategoryFilter';
import { VideoGrid } from '../components/video/VideoGrid';
import { VideoModal } from '../components/video/VideoModal';
import type { Video, Category, CategoryOption } from './../../shared/models';
import './VideoPage.css';
import { useTranslation } from 'react-i18next';

const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'Всі відео' },
  { id: 'about', label: 'Про університет' },
  { id: 'admissions', label: 'Абітурієнту' },
  { id: 'student_life', label: 'Студентське життя' },
  { id: 'science', label: 'Наука та інновації' },
  { id: 'culture', label: 'Культура та мистецтво' }, // Сюди можна віднести вишивку
  { id: 'international', label: 'Міжнародна співпраця' },
  { id: 'events', label: 'Події та заходи' }
];

export const VideoPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      
      try {
        setLoading(true);        
        const configResponse = await fetch('/api/subtitles/config');        
        if (!configResponse.ok) {
          throw new Error('Помилка завантаження конфігу');
        }
        
        const configData = await configResponse.json();
        
        const videosResponse = await fetch('/api/admin/videos');
        
        if (!videosResponse.ok) {
          throw new Error('Помилка завантаження відео');
        }
        
        const apiVideos: Video[] = await videosResponse.json();
        
        const videosWithSubtitles = apiVideos.map(video => {
          const configVideo = configData.videos.find((v: any) => v.id === video.id);
          const result = {
            ...video,
            subtitles: configVideo?.subtitles || []
          };
                    
          return result;
        });
        
        setVideos(videosWithSubtitles);
        
      } catch (err) {
        setError('Не вдалося завантажити відео');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const filteredVideos = useMemo(() => {
    const result = selectedCategory === 'all' 
      ? videos 
      : videos.filter(v => v.category === selectedCategory);
        
    return result;
  }, [selectedCategory, videos]);

  if (loading) {
    return <div className="loading">Завантаження...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="video-page">
      <h1>{t('title.video')}</h1>

      <CategoryFilter
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <VideoGrid videos={filteredVideos} onVideoClick={setSelectedVideo} />

      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </div>
  );
};

export default VideoPage