import React from 'react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

const CommandCenterHeader: React.FC = () => {
  return (
    <div className="p-4 bg-emerald-600 text-white flex items-center justify-between shadow-md">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
          <WhatsAppIcon />
        </div>
        <div>
          <h1 className="text-lg font-bold">Resort Chat Bot</h1>
          <p className="text-sm text-emerald-100">Resort Virtual Assistant</p>
        </div>
      </div>
      <a
        href="./dashboard.html"
        target="_blank"
        className="px-4 py-2 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors text-sm shadow"
      >
        View Dashboard
      </a>
    </div>
  );
};

export default CommandCenterHeader;
