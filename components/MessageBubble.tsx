
import React from 'react';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const bubbleClasses = isUser
    ? 'bg-lime-200 text-gray-800 self-end rounded-tl-xl rounded-tr-xl rounded-bl-xl'
    : 'bg-white text-gray-800 self-start rounded-tr-xl rounded-tl-xl rounded-br-xl';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-3 shadow-md max-w-xs lg:max-w-md whitespace-pre-wrap ${bubbleClasses}`}>
        {message.text}
      </div>
    </div>
  );
};

export default MessageBubble;
