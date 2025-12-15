import React from 'react';
import { Sun, Map, Music, User } from 'lucide-react';

export type Tab = 'home' | 'map' | 'music' | 'profile';

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TabBar: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const getIcon = (tab: Tab, Icon: any) => {
    const isActive = activeTab === tab;
    return (
      <button 
        onClick={() => onTabChange(tab)}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${isActive ? 'text-orange-500' : 'text-slate-400'}`}
      >
        <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} strokeWidth={2} />
        <span className="text-[10px] font-medium">{getLabel(tab)}</span>
      </button>
    );
  };

  const getLabel = (tab: Tab) => {
    switch(tab) {
      case 'home': return 'Sola';
      case 'map': return 'Karta';
      case 'music': return 'Musik';
      case 'profile': return 'Profil';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-t border-slate-200 pb-5 z-40 flex justify-around items-center px-4 max-w-md mx-auto">
      {getIcon('home', Sun)}
      {getIcon('map', Map)}
      {getIcon('music', Music)}
      {getIcon('profile', User)}
    </div>
  );
};

export default TabBar;