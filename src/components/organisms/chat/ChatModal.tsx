'use client';

import { HTMLAttributes, useState } from 'react';
import { ChatHeader, ChatInput } from '../../atoms/chat';
import { ChatMessagesList } from '../../molecules/chat';

interface Message {
  readonly id: string;
  readonly text: string;
  readonly isUser: boolean;
  readonly timestamp?: string;
  readonly avatar?: string;
}

interface ChatModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage?: (message: string) => void;
  messages?: ReadonlyArray<Message>;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  aiAvatar?: string;
  userAvatar?: string;
}

export default function ChatModal({
  isOpen,
  onClose,
  onSendMessage,
  messages = [],
  isLoading = false,
  title = 'AI Assistant',
  subtitle = 'Đang hoạt động',
  aiAvatar,
  userAvatar,
  className = '',
  ...props
}: ChatModalProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (message: string) => {
    if (onSendMessage) {
      onSendMessage(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${className}`} {...props}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <ChatHeader
          title={title}
          subtitle={subtitle}
          avatar={aiAvatar}
          onClose={onClose}
        />

        {/* Messages */}
        <ChatMessagesList
          messages={messages}
          isLoading={isLoading}
        />

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <ChatInput
            placeholder="Nhập tin nhắn"
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

