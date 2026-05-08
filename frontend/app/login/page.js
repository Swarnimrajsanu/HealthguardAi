"use client";

import { motion } from "framer-motion";
import { Activity, ArrowRight, Chrome, Lock, Mail, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "", remember: false });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("signup") === "success") {
            setSuccess("Account created successfully! Please sign in.");
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/login`, {
                email: formData.email,
                password: formData.password
            });
            
            if (response.data.user_id) {
                localStorage.setItem("user_id", response.data.user_id);
                localStorage.setItem("username", response.data.username);
                router.push("/");
            }
        } catch (err) {
            setError(err.response?.data?.detail || "Invalid email or password.");
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
                        Clinical Precision, <br /> Powered by AI.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-slate-300 leading-relaxed mb-12"
                    >
                        Join thousands of modern healthcare facilities using our predictive analytics suite to improve patient outcomes.
                        Secure, compliant, and lightning fast.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                        className="flex -space-x-4"
                    >
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                                <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="Doctor avatar" className="w-full h-full object-cover opacity-80" />
                            </div>
                        ))}
                        <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-blue-900 flex items-center justify-center text-xs font-bold text-white z-10">
                            +2k
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Area: Login Card */}
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
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                        <p className="text-slate-500">Sign in to your practitioner dashboard.</p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3 text-sm">
                            <ShieldCheck size={20} className="mt-0.5 flex-shrink-0" /> {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 bg-green-50 text-green-600 p-4 rounded-xl border border-green-100 flex items-start gap-3 text-sm">
                            <ShieldCheck size={20} className="mt-0.5 flex-shrink-0" /> {success}
                        </motion.div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
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

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center">
                                <input
                                    id="remember-me" type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-slate-300 rounded cursor-pointer"
                                    checked={formData.remember} onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer">
                                    Remember me
                                </label>
                            </div>
                            <a href="#" className="font-semibold text-sm text-blue-600 hover:text-blue-500 transition-colors">
                                Recover Password
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-6 py-4 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Verifying..." : "Access Dashboard"} <ArrowRight size={18} />
                        </button>

                        <div className="mt-8 text-center">
                            <p className="text-slate-600">
                                Don't have an account?{" "}
                                <Link href="/signup" className="text-blue-600 font-bold hover:underline">
                                    Sign Up
                                </Link>
                            </p>
                        </div>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-slate-400 font-medium">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full py-4 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 hover:-translate-y-0.5 hover:shadow-sm"
                        >
                            <Chrome size={20} className="text-slate-700" />
                            Google SSO Provider
                        </button>
                    </form>

                </motion.div>
            </div>
        </div>
    );
}
