import React, { useState, useMemo, useEffect } from 'react';
import { CategoryFilter } from '../components/video/CategoryFilter';
import { VideoGrid } from '../components/video/VideoGrid';
import { VideoModal } from '../components/video/VideoModal';
import type { Video, Category, CategoryOption } from './../../shared/models';
import './VideoPage.css';

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

  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      
      try {
        setLoading(true);
        
        console.log(' Крок 1: Завантаження config.json');
        console.log('URL:', '/api/subtitles/config');
        
        const configResponse = await fetch('/api/subtitles/config');
        console.log('Статус відповіді config:', configResponse.status, configResponse.statusText);
        
        if (!configResponse.ok) {
          console.error(' Помилка завантаження конфігу:', configResponse.status);
          throw new Error('Помилка завантаження конфігу');
        }
        
        const configData = await configResponse.json();
        console.log(' Config завантажено успішно');
        console.log('Кількість відео в config:', configData.videos?.length || 0);
        console.log('Дані config:', JSON.stringify(configData, null, 2));
        
        console.log(' Крок 2: Завантаження відео з API');
        console.log('URL:', '/api/admin/videos');
        
        const videosResponse = await fetch('/api/admin/videos');
        console.log('Статус відповіді videos:', videosResponse.status, videosResponse.statusText);
        
        if (!videosResponse.ok) {
          console.error(' Помилка завантаження відео:', videosResponse.status);
          throw new Error('Помилка завантаження відео');
        }
        
        const apiVideos: Video[] = await videosResponse.json();
        console.log(' Відео завантажено успішно');
        console.log('Кількість відео з API:', apiVideos.length);
        console.log('ID відео з API:', apiVideos.map(v => v.id));
        
        console.log(' Крок 3: Об\'єднання відео з субтитрами');
        
        const videosWithSubtitles = apiVideos.map(video => {
          const configVideo = configData.videos.find((v: any) => v.id === video.id);
          
          console.group(`Відео ID: ${video.id}`);
          console.log('Назва відео:', video.title);
          console.log('Знайдено в config?', !!configVideo);
          
          if (configVideo) {
            console.log('Кількість субтитрів:', configVideo.subtitles?.length || 0);
            console.log('Мови субтитрів:', configVideo.subtitles?.map((s: any) => s.language).join(', ') || 'немає');
            console.log('Шляхи до субтитрів:', configVideo.subtitles?.map((s: any) => s.src) || []);
          } else {
            console.log(' Відео не знайдено в config.json!');
          }
          
          const result = {
            ...video,
            subtitles: configVideo?.subtitles || []
          };
          
          console.log('Результат об\'єднання:', result);
          console.groupEnd();
          
          return result;
        });
        
        console.log(' Об\'єднання завершено');
        console.log('Фінальна кількість відео:', videosWithSubtitles.length);
        console.log('Відео з субтитрами:', videosWithSubtitles.filter(v => v.subtitles && v.subtitles.length > 0).length);
        console.log('Відео без субтитрів:', videosWithSubtitles.filter(v => !v.subtitles || v.subtitles.length === 0).length);
        
        setVideos(videosWithSubtitles);
        
      } catch (err) {
        console.error(' КРИТИЧНА ПОМИЛКА:', err);
        console.error('Стек помилки:', err instanceof Error ? err.stack : 'немає стеку');
        setError('Не вдалося завантажити відео');
      } finally {
        setLoading(false);
        console.groupEnd();
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      console.group(' Вибрано відео');
      console.log('ID:', selectedVideo.id);
      console.log('Назва:', selectedVideo.title);
      console.log('URL:', selectedVideo.src);
      console.log('Субтитри:', selectedVideo.subtitles);
      console.log('Кількість субтитрів:', selectedVideo.subtitles?.length || 0);
      
      if (selectedVideo.subtitles && selectedVideo.subtitles.length > 0) {
        console.log('Деталі субтитрів:');
        selectedVideo.subtitles.forEach((subtitle, index) => {
          console.log(`  ${index + 1}. ${subtitle.label} (${subtitle.language})`);
          console.log(`     Шлях: ${subtitle.src}`);
        });
      } else {
        console.log(' У цього відео немає субтитрів!');
      }
      
      console.groupEnd();
    }
  }, [selectedVideo]);

  const filteredVideos = useMemo(() => {
    const result = selectedCategory === 'all' 
      ? videos 
      : videos.filter(v => v.category === selectedCategory);
    
    console.log(` Фільтрація: категорія "${selectedCategory}", знайдено ${result.length} відео`);
    
    return result;
  }, [selectedCategory, videos]);

  if (loading) {
    return <div className="loading">Завантаження...</div>;
  }
  
  if (error) {
    console.error('❌ Стан: Помилка -', error);
    return <div className="error-message">{error}</div>;
  }

  console.log(' Стан: Рендеринг сторінки');
  console.log('Всього відео:', videos.length);
  console.log('Відфільтровано відео:', filteredVideos.length);

  return (
    <div className="video-page">
      <h1>Відеобібліотека</h1>

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