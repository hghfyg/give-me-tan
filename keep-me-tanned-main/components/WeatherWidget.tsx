import React from 'react';
import { Sun, CloudSun, Cloud, Umbrella, Wind, ThermometerSun, MapPin, CalendarDays } from 'lucide-react';
import { WeatherData } from '../types';

interface Props {
  data: WeatherData | null;
  loading: boolean;
}

const WeatherWidget: React.FC<Props> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="w-full h-40 glass-card rounded-[2rem] flex flex-col items-center justify-center gap-3 animate-pulse">
         <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
         <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded-full" />
      </div>
    );
  }

  // Simple icon logic based on WMO code
  const getWeatherIcon = (code: number, size = "w-16 h-16") => {
    if (code <= 1) return <Sun className={`${size} text-amber-400 drop-shadow-lg`} fill="currentColor" />;
    if (code <= 3) return <CloudSun className={`${size} text-orange-400 drop-shadow-lg`} />;
    if (code <= 60) return <Cloud className={`${size} text-slate-400 drop-shadow-lg`} fill="currentColor" />;
    return <Umbrella className={`${size} text-blue-400 drop-shadow-lg`} fill="currentColor" />;
  };

  const getUVColor = (uv: number) => {
    if (uv < 3) return "text-emerald-500 dark:text-emerald-400";
    if (uv < 6) return "text-amber-500 dark:text-amber-400";
    if (uv < 8) return "text-orange-500 dark:text-orange-400";
    return "text-red-500 dark:text-red-400";
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    
    // Check if today
    if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth()) {
        return "Idag";
    }

    return date.toLocaleDateString('sv-SE', { weekday: 'short' }).replace('.', '');
  };

  return (
    <div className="animate-enter space-y-4">
      {/* Main Current Weather Card */}
      <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 dark:bg-orange-900/40 rounded-full filter blur-[60px] opacity-40 pointer-events-none" />

        <div className="flex items-start justify-between relative z-10">
           <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Din Plats</span>
              </div>
              <div className="flex items-start">
                 <span className="text-6xl font-black text-slate-800 dark:text-white tracking-tighter">{Math.round(data.temperature)}°</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Strålande sol</p>
           </div>
           
           <div className="flex flex-col items-end gap-2">
              {getWeatherIcon(data.weatherCode)}
           </div>
        </div>

        <div className="mt-8 flex gap-4">
           <div className="flex-1 bg-white/50 dark:bg-slate-800/50 rounded-2xl p-3 flex items-center gap-3 border border-white/60 dark:border-white/5">
              <div className={`p-2 rounded-full bg-white dark:bg-slate-700 shadow-sm ${getUVColor(data.uvIndex)}`}>
                 <Sun className="w-4 h-4" />
              </div>
              <div>
                 <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">UV Index</p>
                 <p className={`text-lg font-bold ${getUVColor(data.uvIndex)}`}>{data.uvIndex.toFixed(1)}</p>
              </div>
           </div>
           
           <div className="flex-1 bg-white/50 dark:bg-slate-800/50 rounded-2xl p-3 flex items-center gap-3 border border-white/60 dark:border-white/5">
              <div className="p-2 rounded-full bg-white dark:bg-slate-700 shadow-sm text-blue-500 dark:text-blue-400">
                 <ThermometerSun className="w-4 h-4" />
              </div>
              <div>
                 <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Känns som</p>
                 <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{Math.round(data.temperature + 2)}°</p>
              </div>
           </div>
        </div>
      </div>

      {/* 5-Day Forecast Row */}
      {data.daily && (
        <div className="glass-card rounded-[2rem] p-5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 mb-4 px-1">
             <CalendarDays className="w-4 h-4 text-slate-400" />
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prognos</span>
          </div>
          <div className="flex justify-between gap-4 min-w-max">
            {data.daily.time.slice(0, 5).map((time, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 min-w-[3.5rem]">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize">
                  {getDayName(time)}
                </span>
                <div className="my-1">
                  {getWeatherIcon(data.daily!.weatherCode[idx], "w-8 h-8")}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">
                    {Math.round(data.daily!.maxTemp[idx])}°
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-600">
                    {Math.round(data.daily!.minTemp[idx])}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;