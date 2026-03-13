"use client";

import { motion } from "framer-motion";
import { Activity, ArrowRight, Lock, Mail, User, ShieldCheck } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
    const [formData, setFormData] = useState({ 
        username: "", 
        email: "", 
        password: "" 
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:8000/signup", {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            
            if (response.status === 200 || response.status === 201) {
                router.push("/login?signup=success");
            }
        } catch (err) {
            setError(err.response?.data?.detail || "An error occurred during signup. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 relative overflow-hidden absolute inset-0 z-50">

            {/* Left Area: Splash Branding (Hidden on mobile) */}
            <div className="hidden lg:flex flex-1 relative bg-slate-900 items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 border-r border-slate-800"></div>
                </div>

                <div className="relative z-10 max-w-lg text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="flex items-center gap-3 mb-8"
                    >
                        <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
                            <Activity size={32} />
                        </div>
                        <span className="font-bold text-3xl tracking-tight text-white">
                            HealthGuard<span className="text-blue-400">AI</span>
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl font-bold text-white mb-6 leading-tight"
                    >
                        Join the <br /> Future of Healthcare.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-slate-300 leading-relaxed mb-12"
                    >
                        Create your account today and get access to our advanced predictive diagnostics.
                    </motion.p>
                </div>
            </div>

            {/* Right Area: Signup Card */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative w-full lg:max-w-[700px] bg-white">

                {/* Mobile Logo Only */}
                <div className="flex lg:hidden items-center gap-2 mb-12">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <Activity size={24} />
                    </div>
                    <span className="font-bold text-2xl tracking-tight text-slate-900">
                        HealthGuard<span className="text-blue-600">AI</span>
                    </span>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
                        <p className="text-slate-500">Join our network of healthcare practitioners.</p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3 text-sm">
                            <ShieldCheck size={20} className="mt-0.5 flex-shrink-0" /> {error}
                        </motion.div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                            <input
                                id="username" type="text" required placeholder="Full Name"
                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all outline-none"
                                value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                            <input
                                id="email" type="email" required placeholder="Email Address"
                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all outline-none"
                                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            </div>
                            <input
                                id="password" type="password" required placeholder="Password"
                                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white transition-all outline-none"
                                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-6 py-4 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Creating Account..." : "Sign Up"} <ArrowRight size={18} />
                        </button>

                        <div className="mt-8 text-center">
                            <p className="text-slate-600">
                                Already have an account?{" "}
                                <Link href="/login" className="text-blue-600 font-bold hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>

                </motion.div>
            </div>
        </div>
    );
}
