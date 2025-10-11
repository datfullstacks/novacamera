'use client';

import { HTMLAttributes } from 'react';
import { ChatMessage } from '../../atoms/chat';

interface Message {
  readonly id: string;
  readonly text: string;
  readonly isUser: boolean;
  readonly timestamp?: string;
  readonly avatar?: string;
}

interface ChatBubbleProps extends HTMLAttributes<HTMLDivElement> {
  message: Message;
}

export default function ChatBubble({
  message,
  className = '',
  ...props
}: ChatBubbleProps) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      <ChatMessage
        message={message.text}
        isUser={message.isUser}
        avatar={message.avatar}
        timestamp={message.timestamp}
      />
    </div>
  );
}

