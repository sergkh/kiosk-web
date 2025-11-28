import React, { useState, useMemo, useEffect } from 'react';
import { CategoryFilter } from '../components/video/CategoryFilter';
import { VideoGrid } from '../components/video/VideoGrid';
import { VideoModal } from '../components/video/VideoModal';
import type { Video } from './../../shared/models';
import './VideoPage.css';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router';


export const VideoPage: React.FC = () => {
  const { t } = useTranslation();
  const videos = useLoaderData<Video[]>();

  const allCategories = ['Всі', ...Array.from(new Set(videos.map(v => v.category)))];
  const [selectedCategory, setSelectedCategory] = useState<string>('Всі');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const filteredVideos = useMemo(() => {
    return selectedCategory === 'Всі' ? videos : videos.filter(v => v.category === selectedCategory);
  }, [selectedCategory, videos]);

  return (
    <div className="video-page">
      <h1>{t('title.video')}</h1>

      <CategoryFilter categories={allCategories} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      <VideoGrid videos={filteredVideos} onVideoClick={setSelectedVideo} />

      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  );
};

export default VideoPage