import React, { useState } from 'react';
import { SkinType, User } from '../types';
import { Shield, User as UserIcon, Sun, ArrowRight, X } from 'lucide-react';

interface Props {
  onComplete: (name: string, skinType: SkinType, spf: number) => void;
  onSkip: () => void;
}

const OnboardingScreen: React.FC<Props> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [skinType, setSkinType] = useState<SkinType>(SkinType.TYPE_3);
  const [spf, setSpf] = useState(30);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(name || "Solbadare", skinType, spf);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 dark:bg-slate-900 z-50 flex flex-col items-center justify-center p-6 animate-enter">
      {/* Skip Button */}
      <button 
        onClick={onSkip}
        className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:text-slate-500 text-sm font-medium"
      >
        Hoppa över
      </button>

      <div className="w-full max-w-md space-y-8">
        
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-orange-500' : 'w-2 bg-slate-200 dark:bg-slate-700'}`} 
            />
          ))}
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-6 animate-enter">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-500">
                <UserIcon className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Vad heter du?</h2>
              <p className="text-slate-500 dark:text-slate-400">Så vi vet vem vi ska hålla brun och säker.</p>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ditt namn..."
              className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none shadow-sm text-center text-lg"
              autoFocus
            />
          </div>
        )}

        {/* Step 2: Skin Type */}
        {step === 2 && (
          <div className="space-y-6 animate-enter">
             <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-500">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Din hudtyp?</h2>
              <p className="text-slate-500 dark:text-slate-400">Detta hjälper AI:n att beräkna din soltid.</p>
            </div>
            <div className="space-y-2 max-h-[40vh] overflow-y-auto no-scrollbar">
              {Object.values(SkinType).map((type) => (
                <button
                  key={type}
                  onClick={() => setSkinType(type)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    skinType === type 
                      ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 ring-1 ring-orange-500' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className={`block font-medium ${skinType === type ? 'text-orange-700 dark:text-orange-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: SPF */}
        {step === 3 && (
          <div className="space-y-6 animate-enter">
             <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-yellow-500">
                <Sun className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Favorit SPF?</h2>
              <p className="text-slate-500 dark:text-slate-400">Vilken solskyddsfaktor använder du oftast?</p>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <span className="text-6xl font-black text-slate-900 dark:text-white">{spf}</span>
              <input 
                type="range" 
                min="0" 
                max="50" 
                step="5" 
                value={spf} 
                onChange={(e) => setSpf(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between w-full text-xs text-slate-400 font-bold uppercase tracking-widest px-1">
                <span>Ingen</span>
                <span>SPF 15</span>
                <span>SPF 30</span>
                <span>SPF 50+</span>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={handleNext}
          disabled={step === 1 && name.length === 0}
          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg shadow-lg shadow-slate-300 dark:shadow-none active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
        >
          {step === 3 ? 'Klar' : 'Nästa'}
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
};

export default OnboardingScreen;