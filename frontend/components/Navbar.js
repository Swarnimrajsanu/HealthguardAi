"use client";

import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const pathname = usePathname();

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        const username = localStorage.getItem("username");
        if (userId) {
            setUser({ id: userId, username: username });
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        setUser(null);
        window.location.href = "/login";
    };

    const navLinks = [
        { name: "Dashboard", path: "/" },
        { name: "Diabetes", path: "/diabetes" },
        { name: "Heart", path: "/heart" },
        { name: "Ask AI", path: "/ask-ai" },
        { name: "Reports", path: "/reports" },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                                <Activity size={22} strokeWidth={2.5} />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-900">
                                HealthGuard<span className="text-blue-600">AI</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-1">
                        <div className="flex space-x-1 mr-4">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.path;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.path}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group",
                                            isActive ? "text-blue-700 bg-blue-50" : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="pl-4 border-l border-slate-200 flex items-center gap-3">
                            {user ? (
                                <>
                                    <span className="text-sm font-medium text-slate-600">Hi, {user.username}</span>
                                    <button 
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                                        Sign In
                                    </Link>
                                    <Link href="/signup" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden overflow-hidden bg-white border-t border-slate-100"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.path;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300",
                                            isActive
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                            <div className="h-px bg-slate-100 my-4"></div>

                             <div className="flex flex-col gap-2 pt-2">
                                {user ? (
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-center px-4 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-slate-900 hover:bg-slate-800 shadow-sm"
                                    >
                                        Sign Out ({user.username})
                                    </button>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full text-center px-4 py-3 border border-slate-200 text-base font-medium rounded-xl text-slate-700 hover:bg-slate-50"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full text-center px-4 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
