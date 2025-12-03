import React from 'react';
import type { Video } from '../../../shared/models';
import CardButton, { CardSize } from '../cards/CardButton';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  return <CardButton 
    title={video.title} 
    subtitle={video.description} 
    image={video.image} 
    onClick={() => onClick(video)} 
    size={CardSize.Full} 
    empty={true} 
  />;
};
