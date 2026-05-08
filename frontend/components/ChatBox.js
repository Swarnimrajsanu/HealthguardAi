"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Clock, Send, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ChatBox() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "ai",
            content: "Hello! I am your HealthGuard AI Assistant. I can interpret diagnostic reports, explain medical terminology, and offer validated literature insights. How can I assist?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            role: "user",
            content: input.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/ask-ai`, { query: userMessage.content });
            appendAiResponse(response.data.reply || response.data.answer);
        } catch (err) {
            console.warn("Backend unavailable, using simulated AI response.");
            setTimeout(() => {
                appendAiResponse(getMockResponse(userMessage.content));
            }, 1500 + Math.random() * 1000);
        }
    };

    const appendAiResponse = (content) => {
        const aiResponse = {
            id: Date.now() + 1,
            role: "ai",
            content: content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiResponse]);
        setIsLoading(false);
    };

    const clearChat = () => {
        setMessages([{
            id: 1,
            role: "ai",
            content: "Chat history cleared. How can I help you today?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    };

    const getMockResponse = (query) => {
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes("diabetes")) return "Type 2 diabetes management involves HbA1c monitoring, metformin titration (if prescribed), and lifestyle modifications achieving a 5-7% weight loss. Would you like to review typical biomarker target ranges?";
        if (lowerQuery.includes("heart") || lowerQuery.includes("pressure")) return "Hypertension (BP > 130/80) and elevated LDL cholesterol are primary ASCVD risk factors. The American Heart Association recommends 150 minutes of moderate aerobic activity weekly.";
        return "Based on clinical literature, proactive screening combined with continuous biomarker tracking yields the best long-term patient outcomes. Is there a specific diagnostic metric you'd like me to explain?";
    };

    return (
        <div className="flex flex-col h-[750px] w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h2 className="text-slate-900 font-bold text-lg">Dr. HealthGuard (AI)</h2>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Online & Ready
                        </div>
                    </div>
                </div>

                <button
                    onClick={clearChat}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors tooltip-trigger relative group"
                    title="Clear Conversation"
                >
                    <Trash2 size={20} />
                    <span className="absolute hidden group-hover:block -bottom-8 right-0 bg-slate-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">Clear Chat</span>
                </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`flex max-w-[85%] gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${msg.role === "user" ? "bg-slate-800 text-white" : "bg-blue-100 text-blue-700"}`}>
                                    {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <div className={`p-4 rounded-2xl ${msg.role === "user" ? "bg-slate-800 text-white rounded-tr-sm shadow-md" : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm leading-relaxed"}`}>
                                        {msg.content}
                                    </div>
                                    <div className={`text-[10px] items-center gap-1 text-slate-400 flex font-medium ${msg.role === "user" ? "justify-end pr-1" : "justify-start pl-1"}`}>
                                        <Clock size={10} /> {msg.timestamp}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Thinking Indicator */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex w-full justify-start"
                        >
                            <div className="flex max-w-[85%] gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shadow-sm">
                                    <Bot size={20} />
                                </div>
                                <div className="p-4 rounded-2xl bg-white border border-slate-200 rounded-tl-sm flex items-center gap-3 shadow-sm h-[56px]">
                                    <div className="flex gap-1.5">
                                        <motion.div className="w-2 h-2 rounded-full bg-blue-400" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} />
                                        <motion.div className="w-2 h-2 rounded-full bg-blue-400" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }} />
                                        <motion.div className="w-2 h-2 rounded-full bg-blue-400" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
                <form onSubmit={handleSubmit} className="flex gap-3 relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="Type your medical query here..."
                        disabled={isLoading}
                        className="flex-1 px-5 py-4 pl-5 pr-16 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all disabled:opacity-50 resize-none h-14 overflow-hidden"
                        rows="1"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-2 bottom-2 aspect-square flex-shrink-0 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm shadow-blue-600/20"
                    >
                        <Send size={18} className="ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
