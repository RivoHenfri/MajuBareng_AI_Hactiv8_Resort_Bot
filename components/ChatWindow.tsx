
import React, { useEffect, useRef } from 'react';
import type { Message, MenuOption } from '../types';
import MessageBubble from './MessageBubble';
import MenuOptions from './MenuOptions';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onOptionClick: (option: MenuOption) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onOptionClick }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const lastMessage = messages[messages.length - 1];
  const lastMessageOptions = lastMessage?.sender === 'bot' ? lastMessage.options : undefined;

  const backgroundStyle = {
    // A subtle, repeatable SVG background pattern mimicking WhatsApp
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto" style={backgroundStyle}>
      <div className="space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 max-w-xs lg:max-w-md shadow">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
      {lastMessageOptions && !isLoading && (
        <MenuOptions options={lastMessageOptions} onOptionClick={onOptionClick} />
      )}
    </div>
  );
};

export default ChatWindow;
