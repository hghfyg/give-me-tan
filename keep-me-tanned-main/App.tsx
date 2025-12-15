import React, { useEffect, useState } from 'react';
import WeatherWidget from './components/WeatherWidget';
import SmartSunTimer from './components/SmartSunTimer';
import PlaylistGenerator from './components/PlaylistGenerator';
import BeachMap from './components/BeachMap';
import LoginScreen from './components/LoginScreen';
import OnboardingScreen from './components/OnboardingScreen';
import TabBar, { Tab } from './components/TabBar';
import ProfileView from './components/ProfileView';
import { fetchWeatherData } from './services/weatherService';
import { WeatherData, GeoLocation, User, SkinType, SunSession } from './types';

const App: React.FC = () => {
  // --- State ---
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Controls LoginScreen visibility
  const [isOnboarding, setIsOnboarding] = useState(false); // Controls OnboardingScreen visibility
  
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- Effects ---
  
  // Theme Management
  useEffect(() => {
    const savedTheme = localStorage.getItem('kmt_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kmt_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kmt_theme', 'light');
    }
  };

  // Load user from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('kmt_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Save user to local storage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('kmt_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kmt_user');
    }
  }, [user]);

  // Get Location & Weather
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const loc = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setLocation(loc);
          const wData = await fetchWeatherData(loc.lat, loc.lon);
          setWeather(wData);
          setLoadingWeather(false);
        },
        (error) => {
          console.error("Geo error:", error);
          setLoadingWeather(false);
          const defaultLoc = { lat: 59.3293, lon: 18.0686 };
          setLocation(defaultLoc);
          fetchWeatherData(defaultLoc.lat, defaultLoc.lon).then(w => setWeather(w));
        }
      );
    }
  }, []);

  // --- Handlers ---

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    // If we don't have a user profile saved yet, show onboarding
    if (!user) {
      setIsOnboarding(true);
    }
  };

  const handleOnboardingComplete = (name: string, skinType: SkinType, spf: number) => {
    const newUser: User = {
      id: 'user_' + Date.now(),
      name: name,
      email: name.toLowerCase().replace(/\s/g, '.') + '@gmail.com', // Fake email based on name
      skinType: skinType,
      history: [],
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`
    };
    setUser(newUser);
    setIsOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    // Create default user
    const newUser: User = {
      id: 'user_' + Date.now(),
      name: 'Solbadare',
      email: 'user@example.com',
      skinType: SkinType.TYPE_3,
      history: [],
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces'
    };
    setUser(newUser);
    setIsOnboarding(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setIsOnboarding(false);
  };

  const handleUpdateSkinType = (type: SkinType) => {
    if (!user) return;
    setUser({ ...user, skinType: type });
  };

  const handleSessionComplete = (durationMinutes: number) => {
    if (!user || !weather) return;
    const newSession: SunSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      durationMinutes,
      uvIndex: weather.uvIndex,
      location: 'Min Plats' 
    };
    setUser({ ...user, history: [...user.history, newSession] });
  };

  // --- Date Formatter ---
  const today = new Date();
  const dayName = today.toLocaleDateString('sv-SE', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' });
  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);

  // --- Render Logic ---

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLoginSuccess} />;
  }

  if (isOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />;
  }

  if (!user) return null; // Should not happen if logged in and not onboarding

  // Define layout types
  const isFullScreen = activeTab === 'map';

  return (
    <div className="h-full w-full bg-[#F2F2F7] dark:bg-[#0f172a] relative transition-colors duration-300">
      
      {/* Content Container */}
      <div className={`h-full w-full ${isFullScreen ? '' : 'md:max-w-md md:mx-auto overflow-y-auto no-scrollbar'}`}>
         
         {activeTab === 'home' && (
           <div className="pt-8 px-5 pb-32 space-y-8 animate-enter">
              <header className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{capitalizedDay}</h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-[15px]">{dateStr}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden">
                   <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
                </div>
              </header>
              <WeatherWidget data={weather} loading={loadingWeather} />
              {weather && user && (
                <SmartSunTimer 
                  uvIndex={weather.uvIndex} 
                  user={user}
                  onSessionComplete={handleSessionComplete}
                />
              )}
           </div>
         )}

         {activeTab === 'map' && (
            <div className="h-full w-full">
              {location ? <BeachMap userLocation={location} /> : <div className="h-full w-full flex items-center justify-center text-slate-400">Hämtar GPS...</div>}
            </div>
         )}

         {activeTab === 'music' && (
            <div className="pt-8 px-5 pb-32 md:max-w-md md:mx-auto">
               <header className="mb-6">
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Musik</h1>
               </header>
               <PlaylistGenerator />
            </div>
         )}

         {activeTab === 'profile' && (
            <ProfileView 
              user={user} 
              onUpdateSkinType={handleUpdateSkinType}
              onLogout={handleLogout}
              isDarkMode={isDarkMode}
              onToggleTheme={toggleTheme}
            />
         )}

      </div>

      {/* Tab Bar sits on top of everything */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;