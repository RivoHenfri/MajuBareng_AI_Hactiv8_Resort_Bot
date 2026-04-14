import React from 'react';
import type { BookingDetails, PriorityLevel, Language } from '../types';
import { t } from '../translations';

interface BookingConfirmationCardProps {
  taskLabel: string;
  details: BookingDetails;
  language: Language;
}

const getPriorityClass = (priority?: PriorityLevel) => {
    switch (priority) {
        case 'Emergency': return 'text-red-600';
        case 'High': return 'text-orange-600';
        case 'Medium': return 'text-yellow-600';
        default: return 'text-slate-800';
    }
}

const CardRow: React.FC<{ label: string; value: string | number | undefined, valueClass?: string }> = ({ label, value, valueClass }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between items-center py-2 border-t border-slate-200 first:border-t-0">
            <span className="text-sm text-slate-500">{label}</span>
            <span className={`font-semibold text-sm text-right ${valueClass || 'text-slate-800'}`}>{value}</span>
        </div>
    );
};

const BookingConfirmationCard: React.FC<BookingConfirmationCardProps> = ({ taskLabel, details, language }) => {
  return (
    <div className="space-y-2">
      <p>{t('card_confirm_intro', language)}</p>
      <p className="font-bold text-base">{taskLabel}</p>
      
      <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
        <CardRow label={t('card_service_item', language)} value={details.treatment} />
        {details.description && (
            <div className="py-2 border-t border-slate-200">
                <span className="text-sm text-slate-500">{t('card_description', language)}</span>
                <p className="font-semibold text-sm text-slate-800 mt-1 whitespace-pre-wrap">{details.description}</p>
            </div>
        )}
        <CardRow label={t('card_location', language)} value={details.location} />
        <CardRow label={t('card_for_room', language)} value={details.roomNumber} />
        <CardRow label={t('card_priority', language)} value={details.priority} valueClass={getPriorityClass(details.priority)} />
        <CardRow label={t('card_airline', language)} value={details.airline} />
        <CardRow label={t('card_flight_number', language)} value={details.flightNumber} />
        <CardRow label={t('card_date', language)} value={details.date} />
        <CardRow label={t('card_time', language)} value={details.time} />
        <CardRow label={t('card_guests', language)} value={details.guests} />
        <CardRow label={t('card_contact_number', language)} value={details.phoneNumber} />
      </div>
      
      <p className="mt-2 pt-1">{t('card_is_this_correct', language)}</p>
    </div>
  );
};

export default BookingConfirmationCard;