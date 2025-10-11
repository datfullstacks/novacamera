'use client';

import { HTMLAttributes } from 'react';

interface ChatHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  avatar?: string;
  onClose?: () => void;
}

export default function ChatHeader({
  title = 'AI Assistant',
  subtitle = 'Đang hoạt động',
  avatar,
  onClose,
  className = '',
  ...props
}: ChatHeaderProps) {
  return (
    <div className={`flex items-center justify-between p-4 border-b border-gray-200 ${className}`} {...props}>
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 overflow-hidden rounded-full">
          {avatar ? (
            <img
              src={avatar}
              alt="AI Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">AI</span>
            </div>
          )}
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

