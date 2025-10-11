import React from 'react';

export interface ViewToggleProps {
  isGridView: boolean;
  onToggle: (isGrid: boolean) => void;
  className?: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  isGridView,
  onToggle,
  className = '',
}) => {
  return (
    <div className={`flex h-9 border border-gray-200 rounded overflow-hidden ${className}`}>
      {/* Grid View Button */}
      <button
        onClick={() => onToggle(true)}
        className={`
          w-8 h-8 m-0.5 flex items-center justify-center
          ${isGridView ? 'bg-zinc-900' : 'bg-white'}
          transition-colors
        `}
      >
        <svg 
          className={`w-4 h-4 ${isGridView ? 'text-white' : 'text-black'}`} 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M3 3h6v6H3V3zm8 0h6v6h-6V3zM3 11h6v6H3v-6zm8 0h6v6h-6v-6z" />
        </svg>
      </button>
      
      {/* List View Button */}
      <button
        onClick={() => onToggle(false)}
        className={`
          w-8 h-8 m-0.5 flex items-center justify-center
          ${!isGridView ? 'bg-zinc-900' : 'bg-white'}
          transition-colors
        `}
      >
        <svg 
          className={`w-4 h-4 ${!isGridView ? 'text-white' : 'text-black'}`} 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
        </svg>
      </button>
    </div>
  );
};