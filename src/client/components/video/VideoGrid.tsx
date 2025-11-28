import React from 'react';
import VideoCard from './VideoCard';
import type { Video } from '../../../shared/models';

interface VideoGridProps {
  videos: Video[];
  onVideoClick: (video: Video) => void;
}
export function VideoGrid({ videos, onVideoClick }: VideoGridProps) {
  return <div className="info-cards">
    {videos.map(v => (
      <VideoCard key={v.id} video={v} onClick={onVideoClick} />
    ))}
  </div>
}
