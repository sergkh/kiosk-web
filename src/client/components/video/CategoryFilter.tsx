import React from 'react';
import CardButton, { CardSize } from '../cards/CardButton';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="info-cards minimized">
      {categories.map(category => (
        <CardButton
          title={category}
          key={category}
          active={selectedCategory === category}
          size={CardSize.Minimized}
          onClick={() => onCategoryChange(category)}
        />
      ))}
    </div>
  );
};