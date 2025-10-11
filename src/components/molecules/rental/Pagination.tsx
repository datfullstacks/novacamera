import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const renderPageButton = (page: number, isActive = false) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      className={`
        w-10 h-9 rounded border border-gray-200 flex items-center justify-center
        text-sm font-normal transition-colors
        ${isActive 
          ? 'bg-zinc-900 text-white border-blue-500' 
          : 'bg-white text-black hover:bg-gray-50'
        }
      `}
    >
      {page}
    </button>
  );

  const renderNavButton = (direction: 'prev' | 'next', disabled = false) => (
    <button
      onClick={() => onPageChange(direction === 'prev' ? currentPage - 1 : currentPage + 1)}
      disabled={disabled}
      className={`
        w-12 h-9 rounded border border-gray-200 flex items-center justify-center
        transition-colors
        ${disabled 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-white text-black hover:bg-gray-50'
        }
      `}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        {direction === 'prev' ? (
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        ) : (
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        )}
      </svg>
    </button>
  );

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    return startPage + i <= endPage ? startPage + i : null;
  }).filter(Boolean) as number[];

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {renderNavButton('prev', currentPage === 1)}
      
      {pages.map(page => renderPageButton(page, page === currentPage))}
      
      {renderNavButton('next', currentPage === totalPages)}
    </div>
  );
};