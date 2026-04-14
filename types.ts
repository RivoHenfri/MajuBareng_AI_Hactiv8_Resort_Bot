// types.ts
import type React from 'react';

export type Language = 'en' | 'id' | 'ja' | 'zh';

export type Department =
  | "Front Office / Concierge / Activities"
  | "Food & Beverage"
  | "Spa & Wellness"
  | "Experiences"
  | "Housekeeping (HK)"
  | "Maintenance / MEP"
  | "Drivers & Transport"
  | "Landscape"
  | "Security"
  | "Supply"
  | "Medical Support"
  | "Emergency"
  | "Management / Feedback"
  | "Training & Education"
  | "HR & Information";

export interface MenuOption {
  label: string;
  description: string;
}

export interface SubMenuOption extends MenuOption {
  detailsPrompt?: string;
  action?: string;
  sla?: string;
  whatsappLink?: string;
}

export type MessageSender = 'user' | 'bot';

export interface Message {
  id: string;
  text: string | React.ReactNode;
  sender: MessageSender;
  options?: readonly MenuOption[] | readonly SubMenuOption[];
}

export type TicketStatus = 'Open' | 'In Progress' | 'Closed';
export type PriorityLevel = 'Emergency' | 'High' | 'Medium' | 'Low';
export type RequesterType = 'Guest' | 'Staff';

export interface Ticket {
    id: string;
    department: Department | string;
    request: string;
    status: TicketStatus;
    timestamp: number;
    requesterType: RequesterType;
    requesterName?: string;
    requesterLocation?: string; // Room for Guest, Department for Staff
    staffId?: string;
    priority?: PriorityLevel;
    // New fields to track requests made on behalf of guests
    guestName?: string;
    guestRoom?: string;
}

export interface BookingDetails {
    isBooking: boolean;
    treatment?: string;
    date?: string;
    time?: string;
    guests?: number;
    airline?: string;
    flightNumber?: string;
    phoneNumber?: string;
    roomNumber?: string;
    priority?: PriorityLevel;
    location?: string;
    description?: string;
}
