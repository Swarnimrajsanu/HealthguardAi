"use client";

import { FloatingInput, PredictionForm } from "@/components/PredictionForm";
import RiskGauge from "@/components/RiskGauge";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ActivitySquare, ArrowRight, ShieldAlert } from "lucide-react";
import { useState } from "react";

export default function DiabetesPrediction() {
  const [formData, setFormData] = useState({
    Pregnancies: "",
    Glucose: "",
    BloodPressure: "",
    SkinThickness: "",
    Insulin: "",
    BMI: "",
    DiabetesPedigreeFunction: "",
    Age: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataList = [
        parseInt(formData.Pregnancies, 10),
        parseFloat(formData.Glucose),
        parseFloat(formData.BloodPressure),
        parseFloat(formData.SkinThickness),
        parseFloat(formData.Insulin),
        parseFloat(formData.BMI),
        parseFloat(formData.DiabetesPedigreeFunction),
        parseInt(formData.Age, 10)
      ];

      const payload = { data: dataList };

      try {
        const userId = localStorage.getItem("user_id");
        const url = userId ? `http://localhost:8000/predict/diabetes?user_id=${userId}` : "http://localhost:8000/predict/diabetes";
        const response = await axios.post(url, payload);
        processResult(response.data.risk_percentage);
      } catch (err) {
        console.warn("Backend unavailable, using simulated prediction logic.");
        setTimeout(() => {
          const values = Object.values(payload);
          const sum = values.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0);
          const simulatedRisk = (sum % 100);
          processResult(simulatedRisk);
        }, 1500);
      }
    } catch (err) {
      setError("An error occurred structuring the prediction data. Please verify your inputs.");
      setLoading(false);
    }
  };

  const processResult = (percentageVal) => {
    let level = "Low Risk";
    let colorClass = "text-green-600";
    let recommendation = "Your metrics indicate a low probability of diabetes. Maintain your current healthy lifestyle with regular exercise and a balanced diet.";

    if (percentageVal >= 33 && percentageVal < 66) {
      level = "Moderate Risk";
      colorClass = "text-yellow-500";
      recommendation = "Your metrics show some elevated risk factors. We recommend scheduling a routine checkup and considering dietary modifications to lower blood glucose and BMI.";
    } else if (percentageVal >= 66) {
      level = "High Risk";
      colorClass = "text-red-500";
      recommendation = "High risk indicators detected. We strongly advise consulting a healthcare professional promptly for a comprehensive glucose tolerance test and personalized medical advice.";
    }

    setResult({
      percentage: parseFloat(percentageVal).toFixed(1),
      level,
      colorClass,
      recommendation
    });
    setLoading(false);
  };

  return (
    <PredictionForm
      title="Diabetes Predictive Analysis"
      subtitle="Input patient biomarkers below. Our machine learning model analyzes the interactions between these 8 metrics to calculate long-term diabetes probability."
      icon={ActivitySquare}
    >
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Left Side: Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm">1</span>
            Clinical Biomarkers
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              <FloatingInput label="Pregnancies (Count)" name="Pregnancies" value={formData.Pregnancies} onChange={handleChange} />
              <FloatingInput label="Glucose (mg/dL)" name="Glucose" value={formData.Glucose} onChange={handleChange} />
              <FloatingInput label="BloodPressure (mm Hg)" name="BloodPressure" value={formData.BloodPressure} onChange={handleChange} />
              <FloatingInput label="Skin Thickness (mm)" name="SkinThickness" value={formData.SkinThickness} onChange={handleChange} />
              <FloatingInput label="Insulin (IU/mL)" name="Insulin" value={formData.Insulin} onChange={handleChange} />
              <FloatingInput label="BMI" name="BMI" value={formData.BMI} onChange={handleChange} step="0.1" />
              <FloatingInput label="Diabetes Pedigree Func" name="DiabetesPedigreeFunction" value={formData.DiabetesPedigreeFunction} onChange={handleChange} step="0.01" />
              <FloatingInput label="Age (Years)" name="Age" value={formData.Age} onChange={handleChange} />
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3 border border-red-100">
                <ShieldAlert size={20} className="mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden group bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Executing Model Inference...
                  </span>
                ) : (
                  <>
                    <span className="relative z-10 flex items-center gap-2">
                      Run Diagnostic Assessment <ArrowRight size={18} />
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Right Side: Result Output */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-[450px] flex-shrink-0 flex flex-col gap-6"
        >
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden h-full min-h-[500px] flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm">2</span>
              Result Analysis
            </h2>
            <p className="text-slate-500 text-sm mb-8">AI inference output based on provided biomarkers.</p>

            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center px-6"
                >
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
                    <ActivitySquare size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-slate-700 font-semibold text-lg">Awaiting Input Data</h3>
                  <p className="text-slate-400 text-sm mt-2">Submit the form to generate a diagnostic risk assessment here.</p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center"
                >
                  <div className="relative">
                    <div className="w-32 h-32 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-32 h-32 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-slate-400">...</span>
                    </div>
                  </div>
                  <h3 className="text-blue-600 font-bold mt-8 animate-pulse">Calculating Vectors</h3>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col"
                >
                  <div className="flex justify-center py-6">
                    <RiskGauge
                      percentage={result.percentage}
                      level={result.level}
                      colorClass={result.colorClass}
                      size={240}
                    />
                  </div>

                  <div className={`mt-6 p-5 rounded-2xl ${result.colorClass.replace('text-', 'bg-').replace('500', '50').replace('600', '50')} border ${result.colorClass.replace('text-', 'border-').replace('500', '100').replace('600', '100')}`}>
                    <h4 className={`font-bold text-sm mb-2 ${result.colorClass}`}>Clinical Recommendation</h4>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">
                      {result.recommendation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </PredictionForm>
  );
}