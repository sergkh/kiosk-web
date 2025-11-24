import React from 'react';
import type { Category, CategoryOption } from '../../../shared/models';
import CardButton, { CardSize } from '../cards/CardButton';

interface CategoryFilterProps {
  categories: CategoryOption[];
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="category-filter">
      {categories.map(category => (
        <CardButton
          title={category.label}
          key={category.id}
          active={selectedCategory === category.id}
          size={CardSize.Minimized}
          onClick={() => onCategoryChange(category.id)}
        />
      ))}
    </div>
  );
};