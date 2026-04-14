import React, { useState, useEffect } from 'react';
import { SendIcon } from './icons/SendIcon';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, placeholder, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  // When the placeholder changes (e.g., when a new task is selected),
  // clear the input field to avoid confusion.
  useEffect(() => {
    setInputValue('');
  }, [placeholder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const isInputDisabled = isLoading || disabled;

  return (
    <div className="p-4 bg-gray-100 border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder || "Type a message..."}
          className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
          disabled={isInputDisabled}
        />
        <button
          type="submit"
          disabled={isInputDisabled || !inputValue.trim()}
          className="bg-emerald-500 text-white rounded-full p-3 hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors"
        >
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
