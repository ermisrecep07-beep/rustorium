import React, { useState, useEffect, useRef } from 'react';
import {
  Home, ShoppingBag, Users, Bell,
  Copy, Check, Sparkles, MessageCircle,
  ShieldCheck, Lock, ChevronDown,
  Map, Volume2, VolumeX, MapPin, ExternalLink
} from 'lucide-react';

function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
    `}</style>
  );
}

function RustGrain() {
  return (
    <svg className="absolute inset-0 w-full h-full z-[6] pointer-events-none" preserveAspectRatio="none">
      <filter id="corrosion">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="3" seed="7" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.62  0 0 0 0 0.27  0 0 0 0 0.13  0 0 0 0.35 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#corrosion)" opacity="0.12" />
    </svg>
  );
}

function ServerScene({ tone = 'red', dim = false }) {
  const glow = tone === 'amber' ? '#d9a441' : tone === 'blue' ? '#4a7fd9' : '#cf4520';
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#1a1712 0%,#0e0c0a 70%,#0a0908 100%)' }} />
      <div
        className="absolute -top-10 left-1/3 w-72 h-72 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${glow}44 0%, transparent 70%)` }}
      />
      <svg className="absolute inset-0 w-full h-full opacity-[0.2]" viewBox="0 0 400 220" preserveAspectRatio="none">
        <line x1="0" y1="20" x2="400" y2="70" stroke="#948b7c" strokeWidth="2" />
        <line x1="60" y1="0" x2="60" y2="220" stroke="#948b7c" strokeWidth="2" />
        <circle cx="60" cy="55" r="7" fill="none" stroke="#948b7c" strokeWidth="2" />
      </svg>
      {dim && <div className="absolute inset-0 bg-black/45" />}
    </div>
  );
}

export default function RustoriumMenu() {
  const [activeTab, setActiveTab] = useState('home');
  const [copiedIp, setCopiedIp] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [mapError, setMapError] = useState(false);

  // DYNAMIC SERVER STATS STATE
  const [onlinePlayers, setOnlinePlayers] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(200);

  // MUSIC STATE
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef(null);

  const serverName = 'RUSTORIUM | EU 2X VANILLA | TRIO #1';
  const serverIp = 'client.connect 213.14.128.140:28015';
  const discordUrl = 'https://discord.gg/ZKVqfrEAG2';
  const steamUrl = 'https://steamcommunity.com/groups/rustorium';
  const serverType = 'VANILLA 2X';
  const wipeInfo = 'BI-WEEKLY WIPE';
  
  // MAP & SEED DETAILS
  const mapInfo = {
    size: 3500,
    mapHash: 'f553c87981b34a52ae3c88e54f23222b',
    mapImageUrl: 'https://content.rustmaps.com/maps/286/f553c87981b34a52ae3c88e54f23222b/map_icons.png',
    mapType: 'Procedural Custom Map with Icons',
    oilrigs: 'Large & Small Enabled',
    monuments: 'Launch Site, Excavator, Military Tunnels',
  };
  
  // BATTLEMETRICS SUNUCU ID
  const battleMetricsId = '39810262';

  useEffect(() => {
    if (!battleMetricsId || battleMetricsId.includes('BURAYA')) return;

    const fetchServerData = async () => {
      try {
        const response = await fetch(`https://api.battlemetrics.com/servers/${battleMetricsId}`);
        const data = await response.json();
        if (data && data.data && data.data.attributes) {
          setOnlinePlayers(data.data.attributes.players || 0);
          setMaxPlayers(data.data.attributes.maxPlayers || 200);
        }
      } catch (error) {
        console.error('Failed to fetch server stats:', error);
      }
    };

    fetchServerData();
    const interval = setInterval(fetchServerData, 30000);
    return () => clearInterval(interval);
  }, [battleMetricsId]);

  // TOGGLE MUSIC FUNCTION
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.volume = 0.2;
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(() => {});
    }
  };

  const playerPercentage = maxPlayers > 0 ? Math.round((onlinePlayers / maxPlayers) * 100) : 0;

  const handleCopyIp = () => {
    navigator.clipboard.writeText(serverIp);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const tabs = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'map', label: 'MAP & SEED', icon: Map },
    { id: 'store', label: 'STORE', icon: ShoppingBag },
    { id: 'social', label: 'COMMUNITY', icon: Users },
  ];

  const rules = [
    'No cheating, exploiting, or utilizing game breaking bugs.',
    'No racism, extreme hate speech, or targeted harassment.',
    'Respect team limits if specified by the server configuration.',
    'No excessive chat spam, advertising, or toxic behavior.',
    'Use the official Discord ticket system for reports and ban appeals.',
  ];

  return (
    <div className="h-screen w-screen relative overflow-hidden text-[#e9e2d3] select-none bg-[#0c0b0a] font-['Inter',system-ui,sans-serif]">
      <FontLoader />

      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-50">
        <source src="/mountain.mp4" type="video/mp4" />
      </video>
      
      {/* BACKGROUND AUDIO ELEMENT */}
      <audio ref={audioRef} loop src="/music.mp3" preload="auto" />

      <div className="absolute inset-0 bg-[#0c0b0a]/70 z-[5]"></div>
      <RustGrain />

      {/* TOP NAVIGATION BAR */}
      <nav className="absolute top-0 left-0 w-full h-[60px] bg-black/30 backdrop-blur-2xl flex items-center justify-between z-50 border-b border-white/10">
        <div className="flex items-center h-full pl-3 gap-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#cf4520] to-[#9c3216] flex items-center justify-center cursor-pointer shadow-lg shadow-[#cf4520]/20 mr-3">
            <div className="w-4 h-4 relative flex items-center justify-center">
              <div className="w-3 h-3 bg-white transform rotate-45"></div>
              <div className="absolute w-1.5 h-1.5 bg-[#cf4520] rounded-full"></div>
            </div>
          </div>

          <span className="font-['Oswald'] font-semibold text-base tracking-[0.2em] mr-4">
            RUST<span className="text-[#cf4520]">ORIUM</span>
          </span>

          <div className="flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-full p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-9 px-5 rounded-full flex items-center gap-2 text-[12px] font-['Oswald'] font-medium tracking-wider border-none outline-none transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/15 backdrop-blur-md text-white shadow-inner border border-white/20'
                    : 'text-[#a89f92] hover:bg-white/5 hover:text-[#e9e2d3]'
                }`}
              >
                <tab.icon className="w-4 h-4" strokeWidth={2} style={activeTab === tab.id ? { color: '#cf4520' } : {}} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 h-full pr-4">
          {/* DISCORD */}
          <a
            href={discordUrl}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full bg-[#5865F2]/20 hover:bg-[#5865F2]/40 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2] backdrop-blur-md transition-all"
            title="Join Discord"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.011c3.924 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </a>

          {/* DÜZGÜN RENDER EDİLEN NET STEAM LOGOSU */}
          <a
            href={steamUrl}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full bg-[#1b2838] hover:bg-[#2a475e] border border-[#66c0f4]/50 flex items-center justify-center text-[#66c0f4] backdrop-blur-md transition-all shadow-md shadow-[#1b2838]/50"
            title="Join Steam Group"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="15.5" cy="8.5" r="4.2" fill="none" stroke="currentColor" strokeWidth="2.2" />
              <circle cx="15.5" cy="8.5" r="1.6" fill="currentColor" />
              <circle cx="8.5" cy="15.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="2.2" />
              <circle cx="8.5" cy="15.5" r="1.1" fill="currentColor" />
              <line x1="10.8" y1="13.2" x2="13.2" y2="10.8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </a>

          {/* BATTLEMETRICS */}
          <a
            href={`https://www.battlemetrics.com/servers/rust/${battleMetricsId}`}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full bg-[#d9a441]/20 hover:bg-[#d9a441]/40 border border-[#d9a441]/40 flex items-center justify-center text-[#d9a441] backdrop-blur-md transition-all font-['JetBrains_Mono'] font-bold text-[10px]"
            title="View on BattleMetrics"
          >
            BM
          </a>

          {/* MUSIC TOGGLE */}
          <button
            onClick={toggleMusic}
            className={`w-9 h-9 rounded-full flex items-center justify-center border backdrop-blur-md transition-all ${
              isPlayingMusic ? 'bg-[#cf4520]/20 border-[#cf4520] text-[#cf4520]' : 'bg-white/[0.05] border-white/10 text-[#c9c2b6] hover:bg-white/[0.1]'
            }`}
            title="Toggle Background Music"
          >
            {isPlayingMusic ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          <button className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-[#c9c2b6] border border-white/10 backdrop-blur-md">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* HOME */}
      {activeTab === 'home' && (
        <div className="absolute inset-0 top-[60px] z-10">
          <div className="absolute inset-0 top-0 flex items-end justify-between px-8 pb-24">
            <div className="w-[320px] cursor-pointer" onClick={handleCopyIp}>
              <div className="bg-white/[0.06] backdrop-blur-2xl w-full aspect-video relative overflow-hidden border border-white/10 rounded-2xl flex flex-col justify-between p-4 shadow-2xl">
                <ServerScene tone="amber" dim />
                <div className="relative z-10 flex justify-between items-center">
                  <span className="bg-[#cf4520] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded font-['JetBrains_Mono']">{serverType}</span>
                  <span className="text-[10px] font-['JetBrains_Mono'] text-[#52c77a] font-bold flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-[#52c77a]"></span> {onlinePlayers}/{maxPlayers}
                  </span>
                </div>
                <div className="relative z-10 bg-black/50 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                  <span className="text-[9px] text-[#948b7c] font-['JetBrains_Mono']">{wipeInfo}</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[11px] font-['Oswald'] font-medium uppercase text-white">{serverName}</span>
                    {copiedIp ? <Check className="w-4 h-4 text-[#52c77a]" /> : <Copy className="w-4 h-4 text-[#948b7c]" />}
                  </div>
                </div>
              </div>
              <div className="w-full h-[3px] bg-white/10 rounded-full flex mt-2 overflow-hidden">
                <div className="h-full bg-[#cf4520]" style={{ width: `${playerPercentage}%` }}></div>
              </div>
            </div>

            <div className="flex flex-col items-end text-right max-w-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-['Oswald'] font-medium text-[#948b7c] tracking-wider">NEW SEASON ACTIVE</span>
                <span className="bg-[#cf4520] text-white text-[10px] font-bold px-1.5 py-0.5 rounded font-['JetBrains_Mono']">FEATURED</span>
              </div>

              <h1 className="text-[48px] font-['Oswald'] font-semibold leading-none mb-2 tracking-tight text-white">
                RUSTORIUM REBORN
              </h1>

              <p className="text-[13px] text-[#c9c2b6] mb-6 leading-relaxed max-w-lg">
                Advanced anti-cheat systems, optimized maps and a competitive
                vanilla environment await you on Rustorium.
              </p>

              <div className="flex gap-2">
                <button onClick={handleCopyIp} className="bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 flex items-center gap-2 text-[11px] font-['Oswald'] font-medium text-white">
                  {copiedIp ? <Check className="w-3.5 h-3.5 text-[#52c77a]" /> : <Copy className="w-3.5 h-3.5 text-[#948b7c]" />}
                  <span>{copiedIp ? 'IP COPIED!' : 'CONNECT TO SERVER'}</span>
                </button>
                <button onClick={() => setActiveTab('store')} className="bg-[#d9a441] hover:bg-[#c3922f] text-[#141210] rounded-full px-6 py-2.5 flex items-center gap-1.5 text-[11px] font-['Oswald'] font-bold">
                  <span>STORE</span>
                  <span className="text-sm">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAP & SEED TAB */}
      {activeTab === 'map' && (
        <div className="absolute top-[60px] bottom-[36px] left-0 w-full px-6 flex items-center justify-center z-10 overflow-y-auto py-6">
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-['Oswald'] font-semibold text-[#d9a441] flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> TOP-DOWN MAP PREVIEW
                  </span>
                  <span className="text-[9px] font-['JetBrains_Mono'] bg-black/40 px-2 py-0.5 rounded text-white/70">ICONS ENABLED</span>
                </div>
                <div className="w-full aspect-square bg-black/40 border border-white/10 rounded-xl relative overflow-hidden flex items-center justify-center">
                  {!mapError ? (
                    <img
                      src={mapInfo.mapImageUrl}
                      alt={`Rust Map Icons ${mapInfo.mapHash}`}
                      className="w-full h-full object-cover rounded-xl"
                      onError={() => setMapError(true)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-center p-4">
                      <span className="text-[11px] font-['JetBrains_Mono'] text-[#948b7c]">
                        Harita görseli yüklenemedi. Aşağıdaki bağlantıdan kontrol edebilirsiniz.
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <a href={`https://rustmaps.com/map/${mapInfo.mapHash}`} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 py-2.5 rounded-xl text-[11px] font-['Oswald'] text-white">
                <span>VIEW FULL MAP ON RUSTMAPS</span> <ExternalLink className="w-3.5 h-3.5 text-[#948b7c]" />
              </a>
            </div>

            <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-['Oswald'] font-semibold text-[#cf4520] flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> MAP SPECIFICATIONS
                  </span>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-3 font-['JetBrains_Mono'] text-[12px]">
                  <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[#948b7c]">Map Size:</span> <span className="text-white font-bold">{mapInfo.size}m</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[#948b7c]">Map ID / Hash:</span> <span className="text-[#d9a441] font-bold text-[10px]">{mapInfo.mapHash}</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[#948b7c]">Map Type:</span> <span className="text-white">{mapInfo.mapType}</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[#52c77a]">Oilrigs:</span> <span className="text-[#52c77a]">{mapInfo.oilrigs}</span></div>
                  <div className="flex justify-between"><span className="text-[#948b7c]">Key Monuments:</span> <span className="text-white/80 text-[10px] text-right">{mapInfo.monuments}</span></div>
                </div>
              </div>
              <div className="mt-4 text-center text-[9px] text-[#5c564c] font-['JetBrains_Mono']">Map updates automatically every wipe cycle</div>
            </div>
          </div>
        </div>
      )}

      {/* STORE */}
      {activeTab === 'store' && (
        <div className="absolute top-[60px] bottom-[36px] left-0 w-full px-8 flex items-center justify-center z-10">
          <div className="w-full max-w-xl bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative h-36 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 20%, #d9a44133, transparent 65%)' }} />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
              <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center bg-[#d9a441]/15 border border-[#d9a441]/40">
                <Sparkles className="w-8 h-8 text-[#d9a441]" strokeWidth={1.5} />
              </div>
              <span className="absolute top-3 left-3 text-[9px] font-bold font-['JetBrains_Mono'] px-1.5 py-0.5 rounded bg-[#d9a441] text-[#141210]">
                Coming Soon...
              </span>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-['Oswald'] font-semibold text-xl text-white tracking-wide">SKIN ACCESS</h2>
                <span className="text-[12px] font-bold font-['JetBrains_Mono'] text-[#d9a441] bg-[#d9a441]/10 px-3 py-1 rounded-full border border-[#d9a441]/30">
                  $5.00 / MO
                </span>
              </div>
              <p className="text-[#c9c2b6] leading-relaxed text-[12px] mb-5">
                Instant access to all Steam Workshop skins in-game without any additional cost.
              </p>
              <button disabled className="w-full bg-white/[0.05] text-[#8a8378] px-6 py-3 rounded-xl font-['JetBrains_Mono'] text-[11px] font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-white/10">
                <Lock className="w-4 h-4 text-[#d9a441]" /> PAYMENT SYSTEM COMING SOON
              </button>
              <p className="text-center text-[10px] text-[#5c564c] font-['JetBrains_Mono'] mt-3">
                Payment gateway is not active right now — this feature will be available soon.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SOCIAL / COMMUNITY */}
      {activeTab === 'social' && (
        <div className="absolute top-[60px] bottom-[36px] left-0 w-full px-8 flex items-center justify-center z-10 overflow-y-auto py-6">
          <div className="w-full max-w-xl bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-black/20 border-b border-white/10 px-6 py-3 flex items-center justify-between">
              <span className="text-[12px] font-['Oswald'] font-medium text-[#cf4520] tracking-wider uppercase">COMMUNITY &amp; SUPPORT</span>
              <span className="text-[10px] font-['JetBrains_Mono'] text-[#5c564c]">RUSTORIUM COMMUNITY</span>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <MessageCircle className="w-6 h-6 text-[#5865F2] mb-3" />
                  <div className="font-['Oswald'] font-medium text-white text-sm mb-1.5">JOIN DISCORD</div>
                  <p className="text-[#948b7c] text-[11px] leading-relaxed">
                    Find teammates, read server rules, and chat with our community.
                  </p>
                </div>
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center justify-center text-white px-4 py-2.5 rounded-lg font-['Oswald'] font-medium tracking-wide text-[11px] w-fit"
                  style={{ backgroundColor: '#5865F2' }}
                >
                  JOIN SERVER
                </a>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <Users className="w-6 h-6 text-[#66c0f4] mb-3" />
                  <div className="font-['Oswald'] font-medium text-white text-sm mb-1.5">STEAM GROUP</div>
                  <p className="text-[#948b7c] text-[11px] leading-relaxed">
                    Join our official Steam group to stay updated on announcements and group events.
                  </p>
                </div>
                <a
                  href={steamUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center justify-center text-white px-4 py-2.5 rounded-lg font-['Oswald'] font-medium tracking-wide text-[11px] w-fit"
                  style={{ backgroundColor: '#1b2838' }}
                >
                  JOIN STEAM GROUP
                </a>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <ShieldCheck className="w-6 h-6 text-[#52c77a] mb-3" />
                  <div className="font-['Oswald'] font-medium text-white text-sm mb-1.5">VANILLA RULES</div>
                  <p className="text-[#948b7c] text-[11px] leading-relaxed">
                    Review our vanilla server rules for a fair and balanced gameplay experience.
                  </p>
                </div>
                <button
                  onClick={() => setRulesOpen((v) => !v)}
                  className="mt-4 inline-flex items-center justify-between bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-lg text-[#c9c2b6] px-4 py-2.5 font-['Oswald'] font-medium tracking-wide text-[11px]"
                >
                  READ RULES
                  <ChevronDown className={`w-4 h-4 transition-transform ${rulesOpen ? 'rotate-180' : ''}`} />
                </button>
                {rulesOpen && (
                  <ul className="mt-3 space-y-2 border-t border-white/10 pt-3">
                    {rules.map((r) => (
                      <li key={r} className="text-[10.5px] text-[#c9c2b6] leading-relaxed flex gap-2">
                        <span className="text-[#52c77a] mt-0.5">▸</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER BAR */}
      <footer className="absolute bottom-0 left-0 w-full h-[36px] bg-black/30 backdrop-blur-xl border-t border-white/10 flex items-center justify-center z-50">
        <span className="font-['JetBrains_Mono'] text-[10px] text-[#5c564c] tracking-widest">RUSTORIUM.COM v1.0</span>
      </footer>
    </div>
  );
}