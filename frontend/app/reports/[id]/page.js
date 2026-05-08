"use client";

import { motion } from "framer-motion";
import { ActivitySquare, ArrowLeft, Calendar, ChevronRight, Clock, Database, FileText, Heart, ShieldAlert, User } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import RiskGauge from "@/components/RiskGauge";

export default function ReportDetailsPage() {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/report/${id}`);
                setReport(response.data);
            } catch (err) {
                console.error("Failed to fetch report:", err);
                setError("Report not found or server error.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchReport();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-slate-500 font-medium">Loading clinical data...</p>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Error</h2>
                    <p className="text-slate-500 mb-8">{error || "Could not load report."}</p>
                    <Link href="/reports" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
                        <ArrowLeft size={18} /> Back to Reports
                    </Link>
                </div>
            </div>
        );
    }

    const { risk_percentage, level, colorClass, recommendation } = processResult(report.risk_percentage, report.type);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Breadcrumbs / Back button */}
            <div className="mb-8">
                <Link href="/reports" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors">
                    <ArrowLeft size={18} /> Back to Reports
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Report Summary */}
                <div className="lg:col-span-4 space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center"
                    >
                        <div className="flex justify-center mb-6">
                            <RiskGauge 
                                percentage={risk_percentage} 
                                level={level} 
                                colorClass={colorClass} 
                                size={200} 
                            />
                        </div>
                        <h2 className={`text-2xl font-bold ${colorClass} mb-2 uppercase tracking-tight`}>{level}</h2>
                        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
                            <Clock size={14} /> Generated on {new Date(report.timestamp).toLocaleDateString()}
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                        className="bg-slate-900 rounded-3xl p-8 text-white shadow-lg overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Database size={120} />
                        </div>
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                            <FileText size={20} className="text-blue-400" /> Meta Information
                        </h3>
                        <div className="space-y-4 relative z-10">
                            <div>
                                <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Assessment Type</p>
                                <p className="text-white font-medium flex items-center gap-2">
                                    {report.type === 'diabetes' ? <ActivitySquare size={16} className="text-blue-400" /> : <Heart size={16} className="text-rose-400" />}
                                    {report.type.toUpperCase()} MODEL
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Report ID</p>
                                <p className="text-white font-mono text-sm break-all">{report._id}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">Clinical Context</p>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    {report.type === 'diabetes' 
                                        ? "Pima Indians Diabetes Database based inference."
                                        : "UCI Heart Disease dataset based diagnostic modeling."}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Details & Recommendation */}
                <div className="lg:col-span-8 space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
                    >
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Database size={22} className="text-blue-600" /> Raw Biological Metrics
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {getBiomarkers(report).map((bio, idx) => (
                                <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{bio.label}</p>
                                    <p className="text-slate-900 font-bold text-lg">{bio.value}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className={`rounded-3xl p-8 border-2 ${colorClass.replace('text-', 'border-').replace('500', '200').replace('600', '200')} ${colorClass.replace('text-', 'bg-').replace('500', '50').replace('600', '50')}`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-2xl bg-white shadow-sm ${colorClass}`}>
                                <ShieldAlert size={28} />
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold ${colorClass} mb-2`}>Clinical Recommendation</h3>
                                <p className="text-slate-800 font-medium leading-relaxed">
                                    {recommendation}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function processResult(percentageVal, type) {
    let level = "Low Risk";
    let colorClass = "text-green-600";
    let recommendation = "";

    const p = parseFloat(percentageVal);

    if (type === 'diabetes') {
        if (p < 33) {
            recommendation = "Your metrics indicate a low probability of diabetes. Maintain your current healthy lifestyle with regular exercise and a balanced diet.";
        } else if (p < 66) {
            level = "Moderate Risk";
            colorClass = "text-yellow-500";
            recommendation = "Your metrics show some elevated risk factors. We recommend scheduling a routine checkup and considering dietary modifications to lower blood glucose and BMI.";
        } else {
            level = "High Risk";
            colorClass = "text-red-500";
            recommendation = "High risk indicators detected. We strongly advise consulting a healthcare professional promptly for a comprehensive glucose tolerance test and personalized medical advice.";
        }
    } else {
        if (p < 30) {
            recommendation = "No significant risk factors detected in the metrics provided. Maintain a balanced diet and regular exercise.";
        } else if (p < 70) {
            level = "Moderate Risk";
            colorClass = "text-yellow-600";
            recommendation = "Some cardiovascular risk factors present. Consider consulting a healthcare professional for a routine checkup.";
        } else {
            level = "High Risk";
            colorClass = "text-red-600";
            recommendation = "High risk indicators detected. Seek medical consultation to discuss your lipid profile and blood pressure.";
        }
    }

    return { risk_percentage: p.toFixed(1), level, colorClass, recommendation };
}

function getBiomarkers(report) {
    if (report.type === 'diabetes') {
        const labels = ["Pregnancies", "Glucose", "BP", "Skin Th.", "Insulin", "BMI", "DPF", "Age"];
        return report.data.map((val, idx) => ({ label: labels[idx], value: val }));
    } else {
        const labels = [
            "Age", "Sex", "Chest Pain", "Resting BP", "Cholesterol", 
            "Fasting BS", "Resting ECG", "Max HR", "Ex. Angina", 
            "Oldpeak", "ST Slope", "Ca (Vessels)", "Thal"
        ];
        return report.data.map((val, idx) => ({ label: labels[idx] || `Metric ${idx+1}`, value: val }));
    }
}
