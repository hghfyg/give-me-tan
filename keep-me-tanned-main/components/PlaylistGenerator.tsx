import React, { useState } from 'react';
import { Loader2, Play, Sparkles, Disc, Aperture } from 'lucide-react';
import { generateSpotifyPlaylist } from '../services/geminiService';
import { Song } from '../types';

const PlaylistGenerator: React.FC = () => {
  const [vibe, setVibe] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vibe.trim()) return;

    setLoading(true);
    setSongs([]);
    setHasGenerated(false);
    
    // Simulate thinking time + API call
    const result = await generateSpotifyPlaylist(vibe);
    setSongs(result);
    setLoading(false);
    setHasGenerated(true);
  };

  return (
    <div className="space-y-6 animate-enter pb-8">
      {/* Apple Intelligence Global Border Glow (active when loading) */}
      {loading && <div className="ai-border-glow" />}

      {/* Main Gradient Hero Card */}
      <div className="relative w-full overflow-hidden rounded-[2.5rem] shadow-2xl shadow-purple-200/50 dark:shadow-none">
        
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 w-full h-full bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-blue-200 via-purple-200 to-orange-200 dark:from-blue-900 dark:via-purple-900 dark:to-orange-900 opacity-90" />
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-blue-400/30 via-pink-400/30 to-yellow-400/30 blur-3xl animate-[spin_20s_linear_infinite] pointer-events-none" />
        
        <div className="relative z-10 p-6 flex flex-col gap-6">
          
          {/* Header inside card */}
          <div className="flex items-start gap-4">
             <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-fuchsia-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                <Sparkles className="w-6 h-6" />
             </div>
             <div className="pt-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-none">AI DJ</h2>
                <p className="text-sm text-slate-700 dark:text-slate-200 font-medium opacity-80 mt-1">Skapa din perfekta strandmix</p>
             </div>
          </div>

          <form onSubmit={handleGenerate} className="flex flex-col gap-3">
             {/* Input Field - White & Clean */}
             <div className="relative group">
                <input
                  id="vibe"
                  type="text"
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                  placeholder="Beskriv stämningen..."
                  className="w-full h-14 pl-5 pr-14 rounded-2xl bg-white dark:bg-white/10 dark:text-white dark:placeholder:text-white/60 border-none shadow-sm text-lg font-medium text-slate-800 placeholder:text-slate-400 focus:ring-0 outline-none"
                />
                {/* The "Apple Intelligence" Multi-color Icon in input */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {loading ? (
                        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                    ) : (
                        <Aperture className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-tr from-blue-500 via-purple-500 to-orange-500 stroke-[url(#gradient)]" strokeWidth={2} />
                    )}
                     {/* SVG Gradient definition for the icon stroke */}
                     <svg width="0" height="0">
                      <linearGradient id="gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                        <stop stopColor="#3b82f6" offset="0%" />
                        <stop stopColor="#a855f7" offset="50%" />
                        <stop stopColor="#f97316" offset="100%" />
                      </linearGradient>
                    </svg>
                </div>
             </div>

             {/* Action Button */}
             <button 
                type="submit"
                disabled={loading || !vibe}
                className="w-full h-14 rounded-2xl bg-slate-900/80 dark:bg-black/60 backdrop-blur-md text-white font-semibold text-[17px] shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center"
             >
                {loading ? 'Mixar låtar...' : 'Skapa Spellista'}
             </button>
          </form>
        </div>
      </div>

      {/* Results List - iOS Style */}
      <div className="space-y-3 pt-2">
        {loading && (
            // Skeleton Loaders mimicking the reference image
            [1, 2, 3].map(i => (
               <div key={i} className="h-20 bg-white dark:bg-slate-800 rounded-3xl animate-pulse w-full" />
            ))
        )}

        {songs.length > 0 && !loading && (
          <>
            {songs.map((song, idx) => (
              <a 
                  key={idx}
                  href={`https://open.spotify.com/search/${encodeURIComponent(song.title + " " + song.artist)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative bg-white dark:bg-slate-800 rounded-[1.5rem] p-4 flex items-center gap-4 shadow-sm border border-slate-100 dark:border-slate-700/50 active:scale-[0.98] transition-all animate-enter overflow-hidden"
                  style={{ animationDelay: `${idx * 100}ms` }}
              >
                  {/* Subtle hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Album Art Placeholder */}
                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-500 shadow-inner overflow-hidden">
                    <Disc className="w-7 h-7" />
                  </div>
                  
                  <div className="relative z-10 flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-[17px] truncate leading-tight">{song.title}</h4>
                    <p className="text-[15px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{song.artist}</p>
                  </div>

                  <div className="relative z-10 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-900 dark:text-white group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all shadow-sm">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
              </a>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default PlaylistGenerator;