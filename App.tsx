import React, { useState, useEffect } from 'react';
import CommandCenterHeader from './components/CommandCenterHeader';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { getMainMenu, getSubMenu, generateTicketId, parseBookingDetails, parseGuestInfo, parseStaffInfo } from './services/geminiService';
import type { Message, MenuOption, SubMenuOption, Ticket, BookingDetails, RequesterType, Language } from './types';
import { USER_TYPE_OPTIONS, LANGUAGE_OPTIONS, getConfirmOptions, getStaffActionOptions } from './constants';
import BookingConfirmationCard from './components/BookingConfirmationCard';
import { t } from './translations';
import TicketConfirmationCard from './components/TicketConfirmationCard';

type ViewState = 
  | 'awaiting_user_type' 
  | 'gathering_guest_info' 
  | 'gathering_staff_info' 
  | 'awaiting_language_selection' 
  | 'awaiting_staff_action_type' // New state for staff
  | 'gathering_guest_info_for_staff' // New state for staff
  | 'main_menu' 
  | 'sub_menu' 
  | 'gathering_details' 
  | 'awaiting_confirmation'
  | 'conversation_ended'; // New state for the final screen

interface RequesterInfo {
    type: RequesterType;
    name: string;
    location: string; // Room for Guest, Department for Staff
    id?: string; // Staff ID
}

interface OnBehalfOfGuestInfo {
    name: string;
    room: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewState, setViewState] = useState<ViewState>('awaiting_user_type');
  const [language, setLanguage] = useState<Language>('en');
  const [requesterInfo, setRequesterInfo] = useState<RequesterInfo | null>(null);
  const [onBehalfOfGuestInfo, setOnBehalfOfGuestInfo] = useState<OnBehalfOfGuestInfo | null>(null);
  const [activeTask, setActiveTask] = useState<SubMenuOption | null>(null);
  const [confirmationData, setConfirmationData] = useState<{ task: SubMenuOption; details: string; department: string; parsedDetails?: BookingDetails; } | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);


  const addMessage = (content: string | React.ReactNode, sender: 'user' | 'bot', options?: readonly MenuOption[]) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      text: content,
      sender,
      options,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const startOver = () => {
      setMessages([]);
      setRequesterInfo(null);
      setOnBehalfOfGuestInfo(null);
      setActiveTask(null);
      setConfirmationData(null);
      setSelectedDepartment(null);
      setViewState('awaiting_user_type');
      addMessage(t('welcome', language), 'bot', USER_TYPE_OPTIONS);
  }

  const loadMainMenu = async (greeting?: string | React.ReactNode, lang: Language = language) => {
    setIsLoading(true);
    try {
      const menuOptions = await getMainMenu(lang);
      const fullMenu: MenuOption[] = [
        ...menuOptions,
        { label: t('start_over_label', lang), description: t('start_over_desc', lang) }
      ];
      addMessage(greeting || t('main_menu_prompt', lang), 'bot', fullMenu);
      setViewState('main_menu');
      setActiveTask(null);
      setConfirmationData(null);
      setSelectedDepartment(null);
    } catch (error) {
      console.error("Failed to load main menu:", error);
      addMessage(t('api_error', lang), 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    addMessage(t('welcome', language), 'bot', USER_TYPE_OPTIONS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptionClick = async (option: MenuOption) => {
    addMessage(option.label, 'user');
    setIsLoading(true);
    
    if (option.label === t('start_over_label', language)) {
        startOver();
        setIsLoading(false);
        return;
    }

    if (option.label === t('back_to_main_menu_label', language)) {
        setOnBehalfOfGuestInfo(null); // Clear guest info when returning to main menu
        await loadMainMenu();
        return;
    }

    if (viewState === 'awaiting_user_type') {
        if (option.label === USER_TYPE_OPTIONS[0].label) { // Guest
            setViewState('gathering_guest_info');
            addMessage(t('guest_prompt', language), 'bot');
        } else { // Staff
            setViewState('gathering_staff_info');
            addMessage(t('staff_prompt', language), 'bot');
        }
    } else if (viewState === 'awaiting_language_selection') {
        const selectedLang = (['Bahasa Indonesia', '日本語', '中文'].includes(option.label)
          ? { 'Bahasa Indonesia': 'id', '日本語': 'ja', '中文': 'zh' }[option.label]
          : 'en') as Language;
        
        setLanguage(selectedLang);

        if(requesterInfo?.type === 'Guest') {
            const welcomeMessage = t('guest_welcome', selectedLang, requesterInfo.name);
            await loadMainMenu(welcomeMessage, selectedLang);
        } else if (requesterInfo?.type === 'Staff') {
            const welcomeMessage = t('staff_welcome', selectedLang, requesterInfo.name);
            addMessage(welcomeMessage, 'bot', getStaffActionOptions(selectedLang));
            setViewState('awaiting_staff_action_type');
        } else {
            await loadMainMenu(t('generic_welcome', selectedLang), selectedLang);
        }
    } else if (viewState === 'awaiting_staff_action_type') {
        if (option.label === t('staff_action_for_guest_label', language)) {
            setViewState('gathering_guest_info_for_staff');
            addMessage(t('staff_guest_info_prompt', language), 'bot');
        } else { // Operational Issue
            setOnBehalfOfGuestInfo(null); // Ensure no guest is associated
            await loadMainMenu("Please select the relevant department for the operational issue.");
        }
    } else if (viewState === 'awaiting_confirmation') {
      if (option.label === t('confirm_option_label', language) && confirmationData && requesterInfo) {
        let requestDetails = confirmationData.details;
        const pd = confirmationData.parsedDetails;
        
        if (pd) {
            const parts = [];
            if (pd.treatment) parts.push(`Service: ${pd.treatment}`);
            if (pd.description) parts.push(`Description: ${pd.description}`);
            if (pd.location) parts.push(`Location: ${pd.location}`);
            if (pd.roomNumber) parts.push(`For Room: ${pd.roomNumber}`);
            if (pd.priority) parts.push(`Priority: ${pd.priority}`);
            if (pd.airline) parts.push(`Airline: ${pd.airline}`);
            if (pd.flightNumber) parts.push(`Flight No: ${pd.flightNumber}`);
            if (pd.date) parts.push(`Date: ${pd.date}`);
            if (pd.time) parts.push(`Time: ${pd.time}`);
            if (pd.guests) parts.push(`Guests: ${pd.guests}`);
            if (pd.phoneNumber) parts.push(`Contact: ${pd.phoneNumber}`);
            
            if (parts.length > 0) requestDetails = parts.join('; ');
        }

        const newTicket: Ticket = {
          id: generateTicketId(),
          department: confirmationData.department,
          request: `${confirmationData.task.label}: ${requestDetails}`,
          status: 'Open',
          timestamp: Date.now(),
          requesterType: requesterInfo.type,
          requesterName: requesterInfo.name,
          requesterLocation: requesterInfo.location,
          staffId: requesterInfo.id,
          priority: pd?.priority,
          guestName: onBehalfOfGuestInfo?.name,
          guestRoom: onBehalfOfGuestInfo?.room,
        };

        try {
          const existingTickets: Ticket[] = JSON.parse(localStorage.getItem('tickets') || '[]');
          localStorage.setItem('tickets', JSON.stringify([...existingTickets, newTicket]));
          window.dispatchEvent(new Event('storage'));
        } catch (error) {
          console.error("Failed to save ticket to localStorage:", error);
        }
        
        const finalConfirmation = <TicketConfirmationCard 
            ticketId={newTicket.id}
            onStartOver={startOver}
            language={language}
        />;
        addMessage(finalConfirmation, 'bot');
        setViewState('conversation_ended');
        setConfirmationData(null);
        setActiveTask(null);

      } else if (option.label === t('revise_option_label', language) && confirmationData) {
        addMessage(t('revise_prompt', language), 'bot');
        setViewState('gathering_details');
        setActiveTask(confirmationData.task);
        setConfirmationData(null);
      } else {
        addMessage(t('cancel_prompt', language), 'bot');
        await loadMainMenu(); // Go back to main menu instead of starting over completely
      }

    } else if (viewState === 'sub_menu' && selectedDepartment) {
      const subOption = option as SubMenuOption;
      if (subOption.whatsappLink) {
          addMessage(t('redirect_wa', language, subOption.label), 'bot');
          window.open(subOption.whatsappLink, '_blank');
          await new Promise(resolve => setTimeout(resolve, 1500));
          await loadMainMenu();
      } else if (subOption.detailsPrompt) {
        setActiveTask(subOption);
        addMessage(subOption.detailsPrompt, 'bot');
        setViewState('gathering_details');
      } else {
        setConfirmationData({ task: subOption, details: "General Request", department: selectedDepartment });
        const confirmPrompt = t('confirm_general_request', language, subOption.label);
        addMessage(confirmPrompt, 'bot', getConfirmOptions(language));
        setViewState('awaiting_confirmation');
      }

    } else { // 'main_menu'
      const dept = option.label;
      setSelectedDepartment(dept);
      try {
        // Create context for the API call to avoid asking for known info (e.g., room number)
        const roomNumber = onBehalfOfGuestInfo?.room || (requesterInfo?.type === 'Guest' ? requesterInfo.location : null);
        const context = { requesterType: requesterInfo!.type, roomNumber };

        const subMenuOptions = await getSubMenu(dept, language, context);
        if (subMenuOptions && subMenuOptions.length > 0) {
          const fullSubMenu: MenuOption[] = [
            ...subMenuOptions,
            { label: t('back_to_main_menu_label', language), description: t('back_to_main_menu_desc', language) }
          ];
          const prompt = onBehalfOfGuestInfo 
            ? `Making request for ${onBehalfOfGuestInfo.name} (Room ${onBehalfOfGuestInfo.room}). You've selected **${dept}**. How can I assist?`
            : `You've selected **${dept}**. What can I help you with?`;

          addMessage(prompt, 'bot', fullSubMenu);
          setViewState('sub_menu');
        } else {
          addMessage(t('no_submenu_error', language, dept), 'bot');
          await loadMainMenu();
        }
      } catch (error) {
        console.error("Failed to load sub menu:", error);
        addMessage(t('submenu_error', language), 'bot');
      }
    }
    setIsLoading(false);
  };

  const handleSendMessage = async (messageText: string) => {
    addMessage(messageText, 'user');
    setIsLoading(true);

    try {
        if (viewState === 'gathering_guest_info') {
            const info = await parseGuestInfo(messageText, language);
            if (info && info.guestName && info.guestRoom) {
                setRequesterInfo({ type: 'Guest', name: info.guestName, location: info.guestRoom });
                setViewState('awaiting_language_selection');
                addMessage(t('language_prompt', language), 'bot', LANGUAGE_OPTIONS);
            } else {
                addMessage(t('parse_guest_error', language), 'bot');
            }
        } else if (viewState === 'gathering_staff_info') {
            const info = await parseStaffInfo(messageText, language);
            if (info && info.staffName && info.staffDepartment) {
                 setRequesterInfo({ type: 'Staff', name: info.staffName, location: info.staffDepartment });
                 setViewState('awaiting_language_selection');
                 addMessage(t('language_prompt', language), 'bot', LANGUAGE_OPTIONS);
            } else {
                addMessage(t('parse_staff_error', language), 'bot');
            }
        } else if (viewState === 'gathering_guest_info_for_staff') {
            const info = await parseGuestInfo(messageText, language);
            if (info && info.guestName && info.guestRoom) {
                setOnBehalfOfGuestInfo({ name: info.guestName, room: info.guestRoom });
                await loadMainMenu(`Great. I will log this request for guest **${info.guestName}** in room **${info.guestRoom}**. Please select a department.`);
            } else {
                addMessage(t('parse_guest_error', language), 'bot');
            }
        } else if (viewState === 'gathering_details' && activeTask && selectedDepartment) {
          const details = messageText;

          // Create context for the API call to automatically add known info (e.g., room number)
          const roomNumber = onBehalfOfGuestInfo?.room || (requesterInfo?.type === 'Guest' ? requesterInfo.location : null);
          const context = { roomNumber };

          const parsedDetails = await parseBookingDetails(details, activeTask.label, language, context);
          setConfirmationData({ task: activeTask, details, department: selectedDepartment, parsedDetails: parsedDetails ?? undefined });

          if (parsedDetails) {
              const confirmationMessage = <BookingConfirmationCard taskLabel={activeTask.label} details={parsedDetails} language={language} />;
              addMessage(confirmationMessage, 'bot', getConfirmOptions(language));
          } else {
              const confirmationPrompt = t('confirm_detailed_request', language, activeTask.label, details);
              addMessage(confirmationPrompt, 'bot', getConfirmOptions(language));
          }
          setActiveTask(null);
          setViewState('awaiting_confirmation');
        } else {
          addMessage(t('unknown_command', language), 'bot');
        }
    } catch (error) {
        console.error("An error occurred during message handling:", error);
        addMessage(t('api_error', language), 'bot');
    } finally {
         setIsLoading(false);
    }
  };
  
  const getPlaceholder = () => {
    if (viewState === 'gathering_guest_info') return t('guest_placeholder', language);
    if (viewState === 'gathering_staff_info') return t('staff_placeholder', language);
    if (viewState === 'gathering_guest_info_for_staff') return t('staff_guest_placeholder', language);
    if (viewState === 'conversation_ended') return t('conversation_ended_placeholder', language);
    if (activeTask?.detailsPrompt) return activeTask.detailsPrompt;
    return t('menu_selection_placeholder', language);
  };
  
  const isInputEnabled = ['gathering_guest_info', 'gathering_staff_info', 'gathering_guest_info_for_staff', 'gathering_details'].includes(viewState);

  return (
    <div className="flex flex-col h-screen bg-gray-200 font-sans">
      <CommandCenterHeader />
      <ChatWindow messages={messages} isLoading={isLoading} onOptionClick={handleOptionClick} />
      <MessageInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading}
        placeholder={getPlaceholder()}
        disabled={isLoading || !isInputEnabled}
      />
    </div>
  );
};

export default App;