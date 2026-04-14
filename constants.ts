// constants.ts

import { Type } from '@google/genai';
import type { Department, Language, MenuOption } from './types';
import { t } from './translations';

export const DEPARTMENTS: readonly Department[] = [
    "Front Office / Concierge / Activities",
    "Food & Beverage",
    "Spa & Wellness",
    "Experiences",
    "Housekeeping (HK)",
    "Maintenance / MEP",
    "Drivers & Transport",
    "Landscape",
    "Security",
    "Supply",
    "Medical Support",
    "Emergency",
    "Management / Feedback",
    "Training & Education",
    "HR & Information",
];

export const USER_TYPE_OPTIONS: readonly MenuOption[] = [
    { label: '🏨 I am a Guest', description: 'For all your in-resort needs and requests.' },
    { label: '👥 I am a Staff Member', description: 'For internal operational tasks and reports.' },
];

export const LANGUAGE_OPTIONS: readonly MenuOption[] = [
    { label: 'English', description: 'Communicate in English.' },
    { label: 'Bahasa Indonesia', description: 'Berkomunikasi dalam Bahasa Indonesia.' },
    { label: '日本語', description: '日本語でコミュニケーションをとる' },
    { label: '中文', description: '用中文交流' },
];

export const getStaffActionOptions = (language: Language): readonly MenuOption[] => [
    { label: t('staff_action_for_guest_label', language), description: t('staff_action_for_guest_desc', language) },
    { label: t('staff_action_operational_label', language), description: t('staff_action_operational_desc', language) },
];


export const MAIN_MENU_PROMPT = `
You are a concierge AI for a luxury resort. Your task is to present the main service departments to a user.
Respond with a JSON object containing an "options" array. Each object in the array should have a "label" (the department name) and a "description" (a brief, one-sentence summary of what the department handles).
Use the exact department names provided below.
Departments:
- Front Office / Concierge / Activities
- Food & Beverage
- Spa & Wellness
- Experiences
- Housekeeping (HK)
- Maintenance / MEP
- Drivers & Transport
- Landscape
- Security
- Supply
- Medical Support
- Emergency
- Management / Feedback
- Training & Education
- HR & Information
`;

export const mainMenuSchema = {
    type: Type.OBJECT,
    properties: {
        options: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    label: { type: Type.STRING },
                    description: { type: Type.STRING },
                },
                required: ['label', 'description'],
            },
        },
    },
    required: ['options'],
};

export const subMenuSchema = {
    type: Type.OBJECT,
    properties: {
        options: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    label: { type: Type.STRING },
                    description: { type: Type.STRING },
                    detailsPrompt: { type: Type.STRING },
                    action: { type: Type.STRING },
                    sla: { type: Type.STRING },
                    whatsappLink: { type: Type.STRING },
                },
                required: ['label', 'description'],
            },
        },
    },
    required: ['options'],
};

export const WELCOME_MESSAGE: MenuOption = {
    label: "Welcome",
    description: "Welcome to the Resort Command Center! I'm here to help you. Please select a department below to get started.",
};

export const getConfirmOptions = (language: Language): readonly MenuOption[] => [
    { label: t('confirm_option_label', language), description: t('confirm_option_desc', language) },
    { label: t('revise_option_label', language), description: t('revise_option_desc', language) },
    { label: t('cancel_option_label', language), description: t('cancel_option_desc', language) },
];
