'use client';

import { HTMLAttributes, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';

interface Message {
  readonly id: string;
  readonly text: string;
  readonly isUser: boolean;
  readonly timestamp?: string;
  readonly avatar?: string;
}

interface ChatMessagesListProps extends HTMLAttributes<HTMLDivElement> {
  readonly messages: ReadonlyArray<Message>;
  readonly isLoading?: boolean;
}

export default function ChatMessagesList({
  messages,
  isLoading = false,
  className = '',
  ...props
}: ChatMessagesListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${className}`} {...props}>
      {messages.map((message) => (
        <ChatBubble
          key={message.id}
          message={message}
        />
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex items-start gap-2.5">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xs">AI</span>
            </div>
            <div className="px-3 py-2 bg-stone-50 rounded-lg border-l-[3px] border-blue-500">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
