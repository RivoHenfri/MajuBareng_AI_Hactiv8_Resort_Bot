import React, { useState } from 'react';
import { Language } from '../types';
import { t } from '../translations';

interface TicketConfirmationCardProps {
  ticketId: string;
  onStartOver: () => void;
  language: Language;
}

const TicketConfirmationCard: React.FC<TicketConfirmationCardProps> = ({ ticketId, onStartOver, language }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ticketId);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-4">
      <div className="flex justify-center">
        <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <h3 className="text-xl font-bold text-emerald-800">{t('ticket_confirmed_header', language)}</h3>
      <p className="text-sm text-slate-600">{t('ticket_id_label', language)}</p>
      <div className="p-3 bg-white border border-slate-300 rounded-lg">
        <p className="text-2xl font-mono font-bold text-emerald-700 tracking-wider">{ticketId}</p>
      </div>
      <p className="text-sm text-slate-600 !mt-2">
        {t('ticket_follow_up_message', language)}
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <button
          onClick={handleCopy}
          className={`w-full sm:w-auto px-4 py-2 font-semibold rounded-lg transition-colors text-sm ${
            isCopied
              ? 'bg-green-500 text-white'
              : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
          }`}
        >
          {isCopied ? t('copied_button', language) : t('copy_id_button', language)}
        </button>
        <button
          onClick={onStartOver}
          className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors text-sm"
        >
          {t('start_new_conversation_button', language)}
        </button>
      </div>
    </div>
  );
};

export default TicketConfirmationCard;
