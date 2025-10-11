import React from 'react';

export interface RatingProps {
  rating: number;
  reviews?: number;
  showReviews?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  reviews,
  showReviews = true,
  className = '',
}) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={`text-xs ${
        index < rating ? 'text-amber-500' : 'text-gray-300'
      }`}
    >
      ★
    </span>
  ));

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex">
        {stars}
      </div>
      {showReviews && reviews && (
        <span className="text-xs font-normal text-gray-500">
          ({reviews} đánh giá)
        </span>
      )}
    </div>
  );
};