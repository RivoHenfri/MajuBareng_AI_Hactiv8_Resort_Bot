# REKA - Resort Experience & Knowledge Assistant

REKA is a chatbot concept for resort and hospitality environments. It helps guests get fast, simple, and reliable access to resort information and service requests without waiting for front desk support.

## Target Users

- In-house resort guests
- Potential guests during pre-booking
- Visitors exploring resort facilities and nearby activities
- Resort staff handling guest and operational requests

## Key Capabilities

### Room and Booking Support

- Help with room and reservation inquiries
- Provide booking guidance
- Capture service request details for staff follow-up

### Resort Information

- Share facility information such as pool, restaurant, spa, transport, and concierge services
- Provide operating-hour and internal service guidance
- Route guest requests to relevant departments

### Local Recommendations

- Suggest nearby attractions and experiences
- Support activity planning
- Provide transport guidance

### Guest Support

- Support frequently asked questions
- Reduce dependency on manual front desk handling
- Provide 24/7 self-service assistance

## Value Proposition

- 24/7 availability
- Faster guest response time
- Reduced staff workload
- More consistent guest experience
- Scalable concept for multiple hospitality properties

## Use Cases

- Pre-arrival inquiries about room, pricing, and availability
- In-stay support for housekeeping, transport, food and beverage, spa, maintenance, and concierge requests
- Staff-created requests on behalf of guests
- Operational issue reporting
- Post-stay feedback and follow-up concept

## High-Level Architecture

- Chat Interface: React web interface with guided menu flow
- AI Engine: Gemini API for structured menu generation, guest detail parsing, request parsing, and ticket summaries
- Knowledge Layer: Resort department and service prompts

## Tech Stack

- React
- TypeScript
- Vite
- Google Gemini API
- Tailwind CSS via CDN

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local `.env` file:

   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL shown by Vite.

## Deployment Notes

- Do not commit `.env` or real API keys.
- The included GitHub Pages workflow builds the static UI without injecting a Gemini API key.
- This prototype uses the Gemini API from the frontend build when a local `.env` is present. For production, move API calls behind a backend endpoint so the API key is not exposed to browser users.

## Project Status

Initial concept and development phase.

## Author

Rivo Henfri
