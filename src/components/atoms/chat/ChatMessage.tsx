'use client';

import { HTMLAttributes } from 'react';

interface ChatMessageProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
  isUser?: boolean;
  avatar?: string;
  timestamp?: string;
}

export default function ChatMessage({
  message,
  isUser = false,
  avatar,
  timestamp,
  className = '',
  ...props
}: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${className}`} {...props}>
      <div className={`flex items-start gap-2.5 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded-full">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full object-cover mix-blend-luminosity shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xs">
                {isUser ? 'U' : 'AI'}
              </span>
            </div>
          )}
        </div>

        {/* Message Bubble */}
        <div className="px-3 py-2 bg-stone-50 rounded-lg border-l-[3px] border-blue-500">
          <p className="text-black text-sm font-normal leading-snug">
            {message}
          </p>
          {timestamp && (
            <p className="text-gray-500 text-xs mt-1">
              {timestamp}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
