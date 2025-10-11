'use client';

import { HTMLAttributes, useState } from 'react';
import { ChatButton } from '../atoms/chat';
import { ChatContainer } from '../organisms/chat';

interface ChatProviderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function ChatProvider({
  children,
  className = '',
  ...props
}: ChatProviderProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <div className={`relative ${className}`} {...props}>
      {children}
      
      {/* Chat Button */}
      <ChatButton
        onClick={handleToggleChat}
        isOpen={isChatOpen}
      />
      
      {/* Chat Container */}
      <ChatContainer
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        aiAvatar="https://placehold.co/40x40"
        userAvatar="https://placehold.co/40x40"
      />
    </div>
  );
}
