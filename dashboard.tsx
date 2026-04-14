import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import type { Ticket, TicketStatus, PriorityLevel } from './types';
import { getAiSummary } from './services/geminiService';

const DashboardApp: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [filterDept, setFilterDept] = useState<string>('All');
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [filterPriority, setFilterPriority] = useState<string>('All');
    
    // AI Summary State
    const [summary, setSummary] = useState<string>('');
    const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);

    const loadTickets = useCallback(() => {
        const storedTickets = JSON.parse(localStorage.getItem('tickets') || '[]') as Ticket[];
        setTickets(storedTickets.sort((a, b) => b.timestamp - a.timestamp));
    }, []);

    useEffect(() => {
        loadTickets();
        // Also listen for storage changes from other tabs (e.g., the chat window)
        window.addEventListener('storage', loadTickets);
        return () => {
            window.removeEventListener('storage', loadTickets);
        };
    }, [loadTickets]);

    const handleGenerateSummary = async () => {
        setIsSummaryLoading(true);
        setSummary('');
        try {
            // Analyze all tickets that are not closed
            const activeTickets = tickets.filter(t => t.status !== 'Closed');
            const result = await getAiSummary(activeTickets);
            setSummary(result);
        } catch (error) {
            console.error("Failed to generate summary:", error);
            setSummary("An error occurred while generating the summary.");
        } finally {
            setIsSummaryLoading(false);
        }
    };
    
    const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
        const updatedTickets = tickets.map(ticket => 
            ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        );
        setTickets(updatedTickets);
        localStorage.setItem('tickets', JSON.stringify(updatedTickets));
    };

    const filteredTickets = tickets.filter(ticket => {
        const deptMatch = filterDept === 'All' || ticket.department === filterDept;
        const statusMatch = filterStatus === 'All' || ticket.status === filterStatus;
        const priorityMatch = filterPriority === 'All' || ticket.priority === filterPriority;
        return deptMatch && statusMatch && priorityMatch;
    });
    
    const uniqueDepartments = ['All', ...Array.from(new Set(tickets.map(t => t.department)))];

    const statusCounts = tickets.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
    }, {} as Record<TicketStatus, number>);

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case 'Open': return 'bg-amber-100 text-amber-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Closed': return 'bg-green-100 text-green-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const getPriorityColor = (priority?: PriorityLevel) => {
        switch (priority) {
            case 'Emergency': return 'bg-red-200 text-red-800';
            case 'High': return 'bg-orange-200 text-orange-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-slate-200 text-slate-800';
            default: return 'bg-transparent text-transparent';
        }
    };
    
    return (
        <div className="p-4 sm:p-8 font-sans">
            <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Operations Dashboard</h1>
                <p className="text-slate-500">Live visibility of all operational requests.</p>
            </header>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-lg text-center">
                    <h4 className="text-slate-500 font-semibold">Total Tickets</h4>
                    <p className="text-3xl font-bold text-slate-800">{tickets.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg text-center">
                    <h4 className="text-amber-500 font-semibold">Open</h4>
                    <p className="text-3xl font-bold text-slate-800">{statusCounts['Open'] || 0}</p>
                </div>
                 <div className="bg-white p-4 rounded-xl shadow-lg text-center">
                    <h4 className="text-blue-500 font-semibold">In Progress</h4>
                    <p className="text-3xl font-bold text-slate-800">{statusCounts['In Progress'] || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg text-center">
                    <h4 className="text-green-500 font-semibold">Closed</h4>
                    <p className="text-3xl font-bold text-slate-800">{statusCounts['Closed'] || 0}</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tickets Section (Main) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold text-slate-700 mb-4">Ticket Tracker</h2>
                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-4">
                        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="p-2 border rounded-md bg-slate-50">
                            {uniqueDepartments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                        </select>
                         <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border rounded-md bg-slate-50">
                            <option value="All">All Statuses</option>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Closed">Closed</option>
                        </select>
                         <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="p-2 border rounded-md bg-slate-50">
                            <option value="All">All Priorities</option>
                            <option value="Emergency">Emergency</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    {/* Tickets Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="p-3 font-semibold">Ticket ID</th>
                                    <th className="p-3 font-semibold">Date</th>
                                    <th className="p-3 font-semibold">Requester</th>
                                    <th className="p-3 font-semibold">Department</th>
                                    <th className="p-3 font-semibold">Request</th>
                                    <th className="p-3 font-semibold">Priority</th>
                                    <th className="p-3 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTickets.map(ticket => (
                                    <tr key={ticket.id} className="border-b hover:bg-slate-50">
                                        <td className="p-3 font-mono text-sm text-emerald-600">{ticket.id}</td>
                                        <td className="p-3 text-sm text-slate-500 whitespace-nowrap">{new Date(ticket.timestamp).toLocaleString()}</td>
                                        <td className="p-3">
                                            {ticket.requesterName && (
                                                <div>
                                                    <span className="font-semibold text-slate-800">{ticket.requesterName}</span>
                                                    <br />
                                                    <span className="text-xs text-slate-500">
                                                        {ticket.requesterType === 'Guest' ? `Room: ${ticket.requesterLocation}` : `Dept: ${ticket.requesterLocation}`}
                                                    </span>
                                                </div>
                                            )}
                                            {ticket.guestName && (
                                                <div className="mt-2 pt-2 border-t border-slate-200">
                                                    <span className="text-xs text-slate-500 font-bold block">For Guest:</span>
                                                    <span className="font-semibold text-slate-700 text-sm">{ticket.guestName}</span>
                                                    <br/>
                                                    <span className="text-xs text-slate-500">Room: {ticket.guestRoom}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3">{ticket.department}</td>
                                        <td className="p-3 max-w-sm whitespace-pre-wrap break-words">{ticket.request}</td>
                                        <td className="p-3">
                                            {ticket.priority && (
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <select 
                                                value={ticket.status}
                                                onChange={(e) => handleStatusChange(ticket.id, e.target.value as TicketStatus)}
                                                className={`px-2 py-1 text-xs font-semibold rounded-full border-0 focus:ring-0 appearance-none ${getStatusColor(ticket.status)}`}
                                                aria-label={`Change status for ticket ${ticket.id}`}
                                            >
                                                <option value="Open">Open</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         {filteredTickets.length === 0 && <p className="text-center p-8 text-slate-500">No tickets match the current filters.</p>}
                    </div>
                </div>

                {/* AI & Broadcast Tools Section (Sidebar) */}
                <div className="space-y-8">
                    {/* AI Summary */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold text-slate-700 mb-3">AI Summary</h3>
                        <p className="text-sm text-slate-500 mb-4">Get an AI-powered summary of all active tickets to identify trends and priorities.</p>
                        <button 
                            onClick={handleGenerateSummary}
                            disabled={isSummaryLoading}
                            className="w-full bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-emerald-400 disabled:cursor-not-allowed"
                        >
                            {isSummaryLoading ? 'Generating...' : 'Generate Summary'}
                        </button>
                        {summary && (
                            <div className="mt-4 p-3 bg-slate-50 rounded-md text-sm text-slate-700 whitespace-pre-wrap">
                                {isSummaryLoading 
                                    ? <div className="animate-pulse h-16 bg-slate-200 rounded-md"></div>
                                    : summary
                                }
                            </div>
                        )}
                    </div>
                    {/* Broadcast Scheduler */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold text-slate-700 mb-3">Broadcast Scheduler</h3>
                        <textarea placeholder="Type your broadcast message here..." className="w-full p-2 border rounded-md mb-3 h-24 bg-slate-50"></textarea>
                        <input type="datetime-local" className="w-full p-2 border rounded-md mb-3 bg-slate-50"/>
                        <button className="w-full bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors">
                            Schedule Broadcast
                        </button>
                    </div>
                     {/* Group Management */}
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold text-slate-700 mb-3">WhatsApp Group Links</h3>
                         <p className="text-sm text-slate-500 mb-4">Manage links to departmental WhatsApp groups. (75 total)</p>
                        <button className="w-full border border-slate-300 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-100 transition-colors">
                            Manage Groups
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const rootElement = document.getElementById('dashboard-root');
if (!rootElement) {
  throw new Error("Could not find dashboard root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <DashboardApp />
  </React.StrictMode>
);
