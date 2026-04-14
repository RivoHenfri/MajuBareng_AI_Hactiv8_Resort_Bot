import { GoogleGenAI, Type } from "@google/genai";
import { MAIN_MENU_PROMPT, mainMenuSchema, subMenuSchema } from '../constants';
import type { MenuOption, SubMenuOption, Ticket, BookingDetails, PriorityLevel, Language, RequesterType } from "../types";

// FIX: Initialize GoogleGenAI with a named apiKey parameter as per the guidelines.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const aiSummarySchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A concise summary of the key trends, urgent issues, and potential bottlenecks from the provided tickets."
        }
    },
    required: ['summary'],
};

const guestInfoSchema = {
    type: Type.OBJECT,
    properties: {
        guestName: { type: Type.STRING, description: "The full name of the guest." },
        guestRoom: { type: Type.STRING, description: "The room number of the guest." },
    },
    required: ['guestName', 'guestRoom'],
};

const staffInfoSchema = {
    type: Type.OBJECT,
    properties: {
        staffName: { type: Type.STRING, description: "The full name of the staff member." },
        staffDepartment: { type: Type.STRING, description: "The department of the staff member." },
    },
    required: ['staffName', 'staffDepartment'],
};


const bookingDetailsSchema = {
    type: Type.OBJECT,
    properties: {
        isBooking: { type: Type.BOOLEAN, description: 'Set to true only if the text clearly contains booking-related details like a date, time, or number of people.' },
        treatment: { type: Type.STRING, description: 'The specific name of the service or treatment being booked. Extract it from the user text.' },
        date: { type: Type.STRING, description: 'The date of the booking. If a year is not specified, assume the current year. Format as "10 Oct 2024".' },
        time: { type: Type.STRING, description: 'The time of the booking. Convert to a standard format like "02:00 PM".' },
        guests: { type: Type.NUMBER, description: 'The number of people/guests for the booking.' },
        airline: { type: Type.STRING, description: 'The airline name for an airport pickup request (e.g., "Garuda Indonesia", "Singapore Airlines").' },
        flightNumber: { type: Type.STRING, description: 'The flight number for an airport pickup request (e.g., "GA 123", "SQ 956").' },
        phoneNumber: { type: Type.STRING, description: 'The contact phone number provided by the user.' },
        roomNumber: { type: Type.STRING, description: 'The target room number for the service (e.g., for in-room dining or housekeeping requests).' },
        location: { type: Type.STRING, description: 'The specific location of the issue, especially for maintenance requests (e.g., "Lobby Restroom", "Kitchen area", "Poolside bar"). This is different from a guest room number.' },
        priority: {
            type: Type.STRING,
            description: "For Maintenance/MEP issues only. Classify the urgency into 'Emergency', 'High', 'Medium', or 'Low' based on keywords like 'urgent', 'leaking', 'broken', 'asap'.",
            enum: ['Emergency', 'High', 'Medium', 'Low'],
        },
        description: { type: Type.STRING, description: "Any additional details, notes, or specific instructions from the user that are not captured in other fields. For example, 'the leak is under the sink' or 'we prefer a table by the window'." },
    },
    required: ['isBooking'],
};


/**
 * A utility function to make the API call and parse the JSON response.
 * @param prompt The text prompt to send to the model.
 * @param schema The response schema for structured JSON output.
 * @returns The parsed JSON object or null if parsing fails.
 */
async function generateJson(prompt: string, schema: any) {
    // FIX: Use the recommended ai.models.generateContent method.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        }
    });
    // FIX: Access the response text via the .text property.
    const text = response.text.trim();
    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse JSON response:", text);
        return null;
    }
}

const getLanguageName = (lang: Language) => {
    switch (lang) {
        case 'id': return 'Bahasa Indonesia';
        case 'ja': return 'Japanese';
        case 'zh': return 'Chinese';
        case 'en':
        default: return 'English';
    }
};

export const getMainMenu = async (language: Language): Promise<readonly MenuOption[]> => {
    const languageName = getLanguageName(language);
    const prompt = `
    ${MAIN_MENU_PROMPT}

    CRITICAL: Your entire response, including all "label" and "description" fields in the JSON, MUST be in ${languageName}.
    `;
    const result = await generateJson(prompt, mainMenuSchema);
    return result?.options || [];
};

export const getSubMenu = async (
    department: string, 
    language: Language,
    context: { requesterType: RequesterType; roomNumber?: string | null }
): Promise<readonly SubMenuOption[]> => {
    const languageName = getLanguageName(language);

    let contextInstruction = '';
    if (context.requesterType === 'Guest' && context.roomNumber) {
        contextInstruction = `The user is a guest in Room ${context.roomNumber}. For any 'detailsPrompt', you MUST NOT ask for their room number again. Focus only on the specifics of the service (e.g., "What items do you need?", not "For which room?").`;
    } else if (context.requesterType === 'Staff' && context.roomNumber) {
        contextInstruction = `The request is by a staff member for a guest in Room ${context.roomNumber}. For any 'detailsPrompt', you MUST NOT ask for the room number again. Focus only on the specifics of the service.`;
    }

    const prompt = `
    You are a concierge AI for a luxury resort. A user has selected the "${department}" department.
    Your task is to provide a list of 3-5 common, specific service requests or actions for this department, based on the detailed operational requirements below.
    Respond with a JSON object containing an "options" array. Each object in the array represents a specific request.

    **CRITICAL INSTRUCTIONS:**
    1.  **MUST** have a "label" (the concise request name, e.g., "Request Airport Pickup").
    2.  **MUST** have a "description" (a brief summary of the action).
    3.  **IF** more information is needed from the user, **MUST** include a "detailsPrompt" field with a clear question. This is very important for creating accurate tickets.
    4.  **CONTEXT AWARENESS:** ${contextInstruction}
    5.  **MAY** include an "sla" (Service Level Agreement, e.g., "Resolution within 60 minutes").
    6.  **DO NOT** include "whatsappLink" or "action" fields.

    **DEPARTMENT-SPECIFIC REQUIREMENTS (with emphasis on target location/room):**

    - **Front Office / Concierge / Activities**: Focus on check-in issues, transport requests (airport pickup, buggy), and activity bookings.
        - Example: For "Request Airport Pickup", the "detailsPrompt" MUST be "Please provide your airline, flight number, arrival time, and a contact phone number."
    - **Housekeeping (HK)**: Common requests for towels, amenities, and cleaning.
        - Example: For "Request Towels/Amenities", if the room number is known, the "detailsPrompt" should be "What specific items do you need?". If not, it MUST be "For which room number, and what specific items do you need?".
    - **Maintenance / MEP**: Handle issues like AC not working, leaks, or electrical problems.
        - Example: For "Report Plumbing Leak/Issue", the "detailsPrompt" MUST be "Please provide the specific location of the leak (e.g., Lobby Restroom, Kitchen Sink), a description, and its urgency.".
    - **Food & Beverage**: Focus on in-room dining orders and minibar refills.
        - Example: For "In-Room Dining", if the room number is known, the "detailsPrompt" should be "What would you like to order?". If not, it MUST be "What would you like to order, and for which room number?".
    - **Drivers & Transport**: Requests for airport pickups or booking a buggy.
        - Example: For "Book a Buggy", the "detailsPrompt" MUST ask for the pickup location, destination, and number of people.
        - Example: For "Request Airport Pickup", the "detailsPrompt" MUST be "Please provide your airline, flight number, arrival time, and a contact phone number."
    - **Security**: For lost items, noise complaints, or reporting suspicious activity.
        - Example: For "Report Lost Item", the "detailsPrompt" should ask for the item description and last known location.
    - **Medical Support**: For first aid requests or medical emergencies.
        - Example: For "Request First Aid", the "detailsPrompt" should ask for the location and nature of the injury.
    - **Supply / Inventory**: Requests for supplies needed by staff, not guests.
        - Example: For a staff member requesting supplies, a prompt could be "What items do you need and for which department?".
    - **Landscape**: Reporting issues like fallen trees or garden maintenance needs.
         - Example: "Report Garden Issue" should prompt for the location and a description of the issue.
    - **Emergency**: Critical issues like fire or flood. These should be clear and direct.
        - Example: A button for "Report Fire Emergency" which may not need a details prompt.
    - **Management / Feedback**: For submitting complaints, suggestions, or feedback.
        - Example: "Submit Feedback" should prompt "Please share your feedback or suggestion with us."
    - **HR & Information**: For staff inquiries about salary, leave, etc.
        - Example: "Ask HR Question" could prompt "What is your question for the HR department?".

    Now, generate the JSON for the "${department}" department. The entire response, including all "label", "description", and "detailsPrompt" fields, MUST be in ${languageName}.
    `;
    const result = await generateJson(prompt, subMenuSchema);
    return result?.options || [];
};

export const parseGuestInfo = async (details: string, language: Language): Promise<{ guestName: string; guestRoom: string } | null> => {
    const languageName = getLanguageName(language);
    const prompt = `
    A hotel guest is communicating in ${languageName}. Your task is to analyze their text to extract their full name and room number.
    The room number might be a number (e.g., "101"), a name (e.g., "Villa Anggrek"), or a combination.
    Be flexible with the input format. Here are some examples of user input:
    - "I'm John Doe in room 205" -> { "guestName": "John Doe", "guestRoom": "205" }
    - "Jane Smith, Villa Bunga" -> { "guestName": "Jane Smith", "guestRoom": "Villa Bunga" }
    - "My name is Michael and I'm in the Penthouse" -> { "guestName": "Michael", "guestRoom": "Penthouse" }
    - "siti, 401" -> { "guestName": "Siti", "guestRoom": "401" }

    User Text: "${details}"

    Analyze the user text and respond with a JSON object matching the required schema, containing 'guestName' and 'guestRoom'.
    `;
    const result = await generateJson(prompt, guestInfoSchema);
    return result as { guestName: string; guestRoom: string } | null;
};

export const parseStaffInfo = async (details: string, language: Language): Promise<{ staffName: string; staffDepartment: string; } | null> => {
    const languageName = getLanguageName(language);
    const prompt = `
    A hotel staff member is communicating in ${languageName}. Your task is to extract their full name and their department from the provided text.
    The format can be varied. Be flexible. Here are some examples of user input:
    - "My name is John Doe from Housekeeping" -> { "staffName": "John Doe", "staffDepartment": "Housekeeping" }
    - "Jane Smith, Front Office" -> { "staffName": "Jane Smith", "staffDepartment": "Front Office" }
    - "security, my name is Michael" -> { "staffName": "Michael", "staffDepartment": "Security" }
    - "rivo, it" -> { "staffName": "Rivo", "staffDepartment": "IT" }

    User Text: "${details}"

    Analyze the user text and respond with a JSON object matching the required schema, containing 'staffName' and 'staffDepartment'.
    `;
    const result = await generateJson(prompt, staffInfoSchema);
    return result as { staffName: string; staffDepartment: string; } | null;
};


export const parseBookingDetails = async (
    details: string, 
    taskContext: string, 
    language: Language,
    context: { roomNumber?: string | null }
): Promise<BookingDetails | null> => {
    const languageName = getLanguageName(language);

    let contextInstruction = '';
    if (context.roomNumber) {
        contextInstruction = `This request is associated with Room ${context.roomNumber}. If the user does not explicitly mention a different room number in their details, you MUST set the 'roomNumber' field in your JSON response to '${context.roomNumber}'.`;
    }

    const prompt = `
    You are an AI assistant for a luxury resort. A user is communicating in ${languageName}.
    The user is trying to perform the action: "${taskContext}".
    Analyze the user's provided details below and extract structured information.

    User Details: "${details}"

    **Instructions:**
    1.  **CONTEXT AWARENESS:** ${contextInstruction}
    2.  **CRITICAL - Description Field**: You **MUST** capture any extra details, specific requests, or clarifying notes from the user's text into the 'description' field. This is for important context that doesn't fit into other structured fields. For example, if the user says "I'd like an early check-in for 9am", the description should be "Guest requests check-in at 9am". If a user reports a leak and says 'it's under the kitchen sink', the description MUST be 'The leak is under the kitchen sink'.
    3.  **Service/Treatment**: The 'treatment' field should be a concise summary of the core service itself (e.g., 'Early Check-in', 'AC Repair'). Do not put detailed notes here; they belong in the 'description' field.
    4.  Determine if this is a booking or service request. This is true if it contains specific details like a date, time, number of people, a specific item/service name, or a room number.
    5.  Extract all other relevant fields if present: date, time, guests, airline, flightNumber, phoneNumber, roomNumber.
    6.  **LOCATION:** For Maintenance/MEP, Security, or Landscape issues, you **MUST** extract the specific location of the problem (e.g., 'restroom', 'kitchen', 'pool area'). This is a mandatory field for these departments.
    7.  **PRIORITY:** If the \`taskContext\` is related to "Maintenance", "MEP", or "Emergency", you **MUST** analyze the user's text for keywords indicating urgency. Classify the priority into one of four levels: 'Emergency' (e.g., fire, major leak, safety issue), 'High' (e.g., 'urgent', 'asap', 'broken', affecting guest comfort significantly), 'Medium' (e.g., minor issue, 'not cold'), or 'Low' (e.g., cosmetic issue). If no urgency is mentioned, default to 'Medium'.
    8.  Standardize the output. For example, "10 oct" should become something like "10 Oct 2024", and "2" for time could mean "02:00 PM". Be intelligent about the context.
    9.  If it is not a booking request (e.g., just a general question or feedback), set "isBooking" to false and leave other fields null.
    10. For an airport pickup, the 'treatment' field should be 'Airport Pickup'.

    Respond with a JSON object matching the required schema.
    `;
    const result = await generateJson(prompt, bookingDetailsSchema);
    return result as BookingDetails | null;
};

export const generateTicketId = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `RST-${result}`;
};

export const getAiSummary = async (tickets: Ticket[], language: Language = 'en'): Promise<string> => {
    if (tickets.length === 0) {
        return "No active tickets to analyze.";
    }
    const languageName = getLanguageName(language);

    const prompt = `
    You are an operations analyst AI for a luxury resort.
    Analyze the following list of active support tickets (in JSON format) and provide a concise, actionable summary for the operations manager.
    Your summary should highlight:
    1.  **Key Trends**: Are there recurring issues in specific departments or locations (e.g., multiple AC issues in Block C)?
    2.  **Urgent Issues**: Identify any high-priority tickets (e.g., medical, security, tickets with 'Emergency' or 'High' priority) that need immediate attention.
    3.  **Requester-Specific Patterns**: Note if a single guest or staff member has multiple open tickets.
    4.  **Potential Bottlenecks**: Point out departments that seem overloaded.

    Keep the summary to 3-4 bullet points or a short paragraph. The summary MUST be written in ${languageName}.

    Here are the tickets:
    ${JSON.stringify(tickets)}
    `;

    const result = await generateJson(prompt, aiSummarySchema);
    return result?.summary || "Could not generate a summary at this time.";
};
