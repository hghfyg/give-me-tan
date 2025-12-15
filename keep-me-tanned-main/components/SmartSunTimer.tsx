import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, ShieldCheck, Sun, AlertOctagon } from 'lucide-react';
import { SunAdvice, User } from '../types';
import { getSunBathingAdvice } from '../services/geminiService';

interface Props {
  uvIndex: number;
  user: User;
  onSessionComplete: (duration: number) => void;
}

const SmartSunTimer: React.FC<Props> = ({ uvIndex, user, onSessionComplete }) => {
  const [advice, setAdvice] = useState<SunAdvice | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [initialTime, setInitialTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // Audio ref for alarm
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch advice when UV or skin type changes
  const fetchAdvice = useCallback(async () => {
    setLoadingAdvice(true);
    const result = await getSunBathingAdvice(uvIndex, user.skinType);
    setAdvice(result);
    const seconds = result.safeMinutes * 60;
    
    // Only reset timer if not running
    if (!isRunning && timeLeft === 0 && !isFinished) {
        setTimeLeft(seconds);
        setInitialTime(seconds);
    }
    setLoadingAdvice(false);
  }, [uvIndex, user.skinType]);

  useEffect(() => {
    if (uvIndex >= 0) {
      fetchAdvice();
    }
  }, [fetchAdvice, uvIndex]); 

  // Timer Tick Logic
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
            setIsRunning(false);
            setIsFinished(true);
            
            // Haptic Feedback
            if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
            
            // Save session
            const durationMinutes = Math.floor(initialTime / 60);
            onSessionComplete(durationMinutes);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, initialTime, onSessionComplete]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;
  
  // Visual Calculations
  const radius = 110;
  const circumference = 2 * Math.PI * radius; // ~691

  return (
    <div className="glass-card rounded-[2rem] p-6 mt-6 relative overflow-hidden animate-enter delay-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
           <h2 className="text-lg font-bold text-slate-900 tracking-tight">Smart Timer</h2>
        </div>
        {user.skinType && (
            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-wider">
               Hudtyp {user.skinType.split(' - ')[0]}
            </span>
        )}
      </div>

      {/* Advice Card */}
      {loadingAdvice ? (
        <div className="h-24 w-full bg-slate-50 rounded-2xl animate-pulse mb-8" />
      ) : advice ? (
        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-4 mb-8 border border-orange-100/50 relative overflow-hidden">
           {/* Decorative sun */}
           <Sun className="absolute -right-4 -top-4 w-24 h-24 text-orange-200/50 animate-[spin_20s_linear_infinite]" />
           
           <div className="relative z-10">
              <div className="flex gap-3">
                 <ShieldCheck className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                 <p className="text-sm text-slate-800 font-medium leading-relaxed">{advice.advice}</p>
              </div>
              <div className="mt-3 flex gap-2">
                 <div className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-lg border border-orange-100 shadow-sm">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Rek. SPF</span>
                    <span className="text-lg font-bold text-slate-800">{advice.spfRecommendation}</span>
                 </div>
                 <div className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-lg border border-orange-100 shadow-sm">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Max Tid</span>
                    <span className="text-lg font-bold text-slate-800">{advice.safeMinutes} min</span>
                 </div>
              </div>
           </div>
        </div>
      ) : null}

      {/* Timer Circle */}
      <div className="relative flex flex-col items-center justify-center py-4">
         <div className="relative w-72 h-72 flex items-center justify-center">
            {/* SVG Ring Back */}
            <svg className="w-full h-full transform -rotate-90 drop-shadow-xl">
              <circle
                cx="144"
                cy="144"
                r={radius}
                className="text-slate-100"
                strokeWidth="16"
                fill="none"
                stroke="currentColor"
              />
              {/* SVG Ring Progress */}
              <circle
                cx="144"
                cy="144"
                r={radius}
                className={isFinished ? "text-red-500" : "text-orange-500"}
                strokeWidth="16"
                fill="none"
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * progress) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className={`text-7xl font-bold tracking-tighter tabular-nums ${isFinished ? 'text-red-500' : 'text-slate-900'}`}>
                 {formatTime(timeLeft)}
               </span>
               <span className={`text-xs font-bold mt-2 uppercase tracking-[0.2em] ${isRunning ? 'text-orange-500 animate-pulse' : 'text-slate-400'}`}>
                 {isFinished ? "KLART!" : isRunning ? "SOLAR" : "REDO"}
               </span>
            </div>
         </div>

         {/* Controls */}
         <div className="flex items-center gap-8 mt-8">
            <button 
              onClick={() => {
                  setTimeLeft(initialTime);
                  setIsFinished(false);
                  setIsRunning(false);
              }}
              className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all flex items-center justify-center active:scale-90"
              aria-label="Reset Timer"
            >
              <RotateCcw className="w-6 h-6" strokeWidth={2.5} />
            </button>
            
            <button 
              onClick={() => !isFinished && setIsRunning(!isRunning)}
              className={`w-24 h-24 rounded-full text-white shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                  isFinished 
                    ? 'bg-red-500 shadow-red-200' 
                    : isRunning 
                        ? 'bg-orange-500 shadow-orange-200' 
                        : 'bg-slate-900 shadow-slate-300'
              }`}
            >
              {isFinished ? (
                 <AlertOctagon className="w-10 h-10 fill-current" />
              ) : isRunning ? (
                 <Pause className="w-10 h-10 fill-current" />
              ) : (
                 <Play className="w-10 h-10 fill-current ml-1" />
              )}
            </button>
         </div>
      </div>
    </div>
  );
};

export default SmartSunTimer;