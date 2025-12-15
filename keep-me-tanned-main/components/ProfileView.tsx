import React from 'react';
import { User, SkinType, SunSession } from '../types';
import { ChevronRight, History, Shield, LogOut, Sun, Moon, Bell, Palette } from 'lucide-react';

interface Props {
  user: User;
  onUpdateSkinType: (type: SkinType) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const ProfileView: React.FC<Props> = ({ user, onUpdateSkinType, onLogout, isDarkMode, onToggleTheme }) => {
  return (
    <div className="pt-8 pb-32 px-4 animate-enter">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 px-2">Profil</h1>

      {/* User Header */}
      <div className="flex items-center gap-4 mb-10 px-2">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-200 to-yellow-200 p-[2px] shadow-lg">
           <div className="w-full h-full rounded-full bg-slate-50 dark:bg-slate-800 overflow-hidden relative">
             {user.avatarUrl ? (
               <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
             ) : (
               <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-slate-300 dark:text-slate-600">{user.name.charAt(0)}</span>
             )}
           </div>
        </div>
        <div>
          <h2 className="font-bold text-xl text-slate-900 dark:text-white">{user.name}</h2>
          <p className="text-sm text-slate-400 font-medium">{user.email}</p>
        </div>
      </div>

      {/* Settings Group 1 */}
      <div className="bg-white dark:bg-slate-800/50 rounded-[1.5rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700/50 mb-6">
        {/* Skin Type Row */}
        <div className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-700/50 relative active:bg-slate-50 dark:active:bg-slate-800 transition-colors">
           <div className="flex items-center gap-3">
             <div className="w-7 h-7 rounded bg-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-200 dark:shadow-none">
               <Shield className="w-4 h-4 fill-current" />
             </div>
             <span className="font-medium text-slate-900 dark:text-white text-[15px]">Min Hudtyp</span>
           </div>
           
           <div className="flex items-center gap-2">
             <select 
                value={user.skinType}
                onChange={(e) => onUpdateSkinType(e.target.value as SkinType)}
                className="appearance-none bg-transparent text-slate-400 dark:text-slate-400 text-[15px] font-normal text-right pr-6 focus:outline-none cursor-pointer absolute inset-0 w-full h-full"
                style={{ textIndent: '100%', whiteSpace: 'nowrap', overflow: 'hidden' }} 
             />
             <span className="text-slate-500 dark:text-slate-400 text-[15px] pointer-events-none">{user.skinType.split(' - ')[0]}</span>
             <ChevronRight className="w-4 h-4 text-slate-300 pointer-events-none" />
           </div>
        </div>
        
        {/* Appearance Row */}
        <div className="p-4 flex items-center justify-between active:bg-slate-50 dark:active:bg-slate-800 transition-colors">
           <div className="flex items-center gap-3">
             <div className="w-7 h-7 rounded bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-sm">
               {isDarkMode ? <Moon className="w-4 h-4 fill-current" /> : <Sun className="w-4 h-4 fill-current" />}
             </div>
             <span className="font-medium text-slate-900 dark:text-white text-[15px]">Mörkt Läge</span>
           </div>
           
           {/* Toggle Switch */}
           <button 
             onClick={onToggleTheme}
             className={`w-12 h-7 rounded-full transition-colors duration-300 relative ${isDarkMode ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`}
           >
             <div className={`w-6 h-6 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform duration-300 ${isDarkMode ? 'left-[calc(100%-1.6rem)]' : 'left-0.5'}`} />
           </button>
        </div>
      </div>

      {/* History Group */}
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-4">Solhistorik</h3>
      <div className="bg-white dark:bg-slate-800/50 rounded-[1.5rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700/50 mb-8 min-h-[100px]">
        {user.history.length === 0 ? (
          <div className="p-6 text-center">
            <Sun className="w-8 h-8 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Ingen historik än.</p>
          </div>
        ) : (
          user.history.slice().reverse().map((session, idx) => (
            <div key={session.id} className={`p-4 flex items-center justify-between ${idx !== user.history.length - 1 ? 'border-b border-slate-50 dark:border-slate-700/50' : ''}`}>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400">
                   <History className="w-4 h-4" />
                 </div>
                 <div>
                   <p className="font-semibold text-slate-900 dark:text-white text-sm">{new Date(session.date).toLocaleDateString('sv-SE', { month: 'long', day: 'numeric' })}</p>
                   <p className="text-xs text-slate-400">UV Index {session.uvIndex}</p>
                 </div>
               </div>
               <span className="font-bold text-slate-900 dark:text-white text-[15px]">{session.durationMinutes} min</span>
            </div>
          ))
        )}
      </div>

      <button 
        onClick={onLogout}
        className="w-full py-4 rounded-xl text-red-500 font-semibold text-[15px] bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 active:bg-red-50 dark:active:bg-red-900/10 transition-colors"
      >
        Logga ut
      </button>
      
      <p className="text-center text-xs text-slate-300 dark:text-slate-600 mt-8">Version 1.0.3 • Keep Me Tanned</p>
    </div>
  );
};

export default ProfileView;