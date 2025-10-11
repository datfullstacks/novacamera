'use client';

import { HTMLAttributes, useState, KeyboardEvent } from 'react';

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  onSendMessage?: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  placeholder = 'Nhập tin nhắn',
  onSendMessage,
  disabled = false,
  className = '',
  ...props
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`w-full bg-white rounded-[20px] border border-black flex items-center overflow-hidden ${className}`} {...props}>
      <div className="flex-1 px-5 py-2.5">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full text-black text-sm font-normal leading-snug outline-none placeholder-stone-300 disabled:opacity-50"
        />
      </div>
      
      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg 
          className="w-5 h-4 text-black" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1} 
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
          />
        </svg>
      </button>
    </div>
  );
}

