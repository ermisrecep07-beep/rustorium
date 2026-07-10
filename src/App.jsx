import React, { useState, useEffect, useRef } from 'react';
import {
  Home, ShoppingBag, Users, Bell,
  Copy, Check, Sparkles, MessageCircle,
  ShieldCheck, Lock, ChevronDown,
  Map, Volume2, VolumeX, MapPin, ExternalLink,
  Palette, Flame, Layers, RefreshCw, HelpCircle, Globe, Clock, Flag
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
      <rect width="100%" height="100%" filter="url(#corrosion)" opacity="0.10" />
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

  const [lang, setLang] = useState('en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const [onlinePlayers, setOnlinePlayers] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(200);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef(null);
  const langMenuRef = useRef(null);

  const serverName = 'RUSTORIUM | EU 2X VANILLA | TRIO #1';
  const serverIp = 'client.connect 213.14.128.140:28015';
  const discordUrl = 'https://discord.gg/ZKVqfrEAG2';
  const steamUrl = 'https://steamcommunity.com/groups/rustorium';
  const serverType = 'VANILLA 2X';
  
  const mapInfo = {
    size: 3500,
    mapHash: 'f553c87981b34a52ae3c88e54f23222b',
    mapImageUrl: 'https://content.rustmaps.com/maps/286/f553c87981b34a52ae3c88e54f23222b/map_icons.png',
    mapType: 'Procedural Custom Map with Icons',
    oilrigs: 'Large & Small Enabled',
    monuments: 'Launch Site, Excavator, Military Tunnels',
  };
  
  const battleMetricsId = '39810262';

  // Dışarı tıklandığında menüyü kapatma
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const calculateNextWipe = () => {
      const now = new Date();
      const nextWipe = new Date();
      nextWipe.setUTCHours(20, 0, 0, 0);
      
      const day = now.getUTCDay();
      let daysUntilThursday = (4 - day + 7) % 7;
      if (daysUntilThursday === 0 && now.getUTCHours() >= 20) {
        daysUntilThursday = 7;
      }
      nextWipe.setUTCDate(now.getUTCDate() + daysUntilThursday);

      const diff = nextWipe.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateNextWipe();
    const timer = setInterval(calculateNextWipe, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const t = {
    en: {
      home: 'HOME',
      map: 'MAP & SEED',
      store: 'STORE',
      community: 'COMMUNITY',
      features: 'FEATURES',
      faq: 'FAQ',
      newSeason: 'FRESH WIPED • SEASON 1',
      featured: 'FEATURED',
      title: 'RUSTORIUM REBORN',
      desc: 'Advanced anti-cheat systems, optimized maps and a competitive vanilla environment await you on Rustorium.',
      ipCopied: 'IP COPIED!',
      connect: 'CONNECT TO SERVER',
      comingSoon: 'Coming Soon...',
      skinAccess: 'SKIN ACCESS',
      skinDesc: 'Instant access to all Steam Workshop skins in-game without any additional cost.',
      paymentSoon: 'PAYMENT SYSTEM COMING SOON',
      paymentDesc: 'Payment gateway is not active right now — this feature will be available soon.',
      commSupport: 'COMMUNITY & SUPPORT',
      commTitle: 'RUSTORIUM COMMUNITY',
      joinDiscord: 'JOIN DISCORD',
      discordDesc: 'Find teammates, read server rules, and chat with our community.',
      joinServer: 'JOIN SERVER',
      steamGroup: 'STEAM GROUP',
      steamDesc: 'Join our official Steam group to stay updated on announcements and group events.',
      joinSteam: 'JOIN STEAM GROUP',
      vanillaRules: 'VANILLA RULES',
      rulesDesc: 'Review our vanilla server rules for a fair and balanced gameplay experience.',
      readRules: 'READ RULES',
      mapPreview: 'TOP-DOWN MAP PREVIEW',
      iconsEnabled: 'ICONS ENABLED',
      mapSpecs: 'MAP SPECIFICATIONS',
      mapSize: 'Map Size:',
      mapHash: 'Map ID / Hash:',
      mapType: 'Map Type:',
      oilrigs: 'Oilrigs:',
      monuments: 'Key Monuments:',
      autoUpdate: 'Map updates automatically every wipe cycle',
      faqTitle: 'FREQUENTLY ASKED QUESTIONS',
      faqSub: 'FAQ & Knowledge Base',
      wipeCountdown: 'NEXT WIPE IN:',
      biWeekly: 'BI-WEEKLY WIPE',
    },
    tr: {
      home: 'ANASAYFA',
      map: 'HARİTA & SEED',
      store: 'MAĞAZA',
      community: 'TOPLULUK',
      features: 'ÖZELLİKLER',
      faq: 'SSS',
      newSeason: 'YENİ SEZON • AKTİF WİPE',
      featured: 'ÖNE ÇIKAN',
      title: 'RUSTORIUM REBORN',
      desc: 'Gelişmiş hile koruma sistemleri, optimize edilmiş haritalar ve rekabetçi bir vanilla ortamı Rustoriumda seni bekliyor.',
      ipCopied: 'İP KOPYALANDI!',
      connect: 'SUNUCUYA BAĞLAN',
      comingSoon: 'Çok Yakında...',
      skinAccess: 'SKİN ERİŞİMİ',
      skinDesc: 'Ekstra ücret ödemeden oyun içi tüm Steam Atölyesi skinlerine anında erişim.',
      paymentSoon: 'ÖDEME SİSTEMİ ÇOK YAKINDA',
      paymentDesc: 'Ödeme altyapısı şu an aktif değil — bu özellik yakında eklenecektir.',
      commSupport: 'TOPLULUK & DESTEK',
      commTitle: 'RUSTORIUM TOPLULUĞU',
      joinDiscord: 'DİSCORD’A KATIL',
      discordDesc: 'Takım arkadaşı bul, sunucu kurallarını oku ve topluluğumuzla sohbet et.',
      joinServer: 'SUNUCUYA KATIL',
      steamGroup: 'STEAM GRUBU',
      steamDesc: 'Duyurulardan ve etkinliklerden haberdar olmak için resmi Steam grubumuza katıl.',
      joinSteam: 'STEAM GRUBUNA KATIL',
      vanillaRules: 'VANİLLA KURALLARI',
      rulesDesc: 'Adil ve dengeli bir oyun deneyimi için vanilla sunucu kurallarımızı gözden geçir.',
      readRules: 'KURALLARI OKU',
      mapPreview: 'KUŞBAKIŞI HARİTA ÖNİZLEMESİ',
      iconsEnabled: 'İKONLAR AKTİF',
      mapSpecs: 'HARİTA ÖZELLİKLERİ',
      mapSize: 'Harita Boyutu:',
      mapHash: 'Harita ID / Hash:',
      mapType: 'Harita Tipi:',
      oilrigs: 'Petrol Platformları:',
      monuments: 'Ana Anıtlar:',
      autoUpdate: 'Harita her wipe döngüsünde otomatik güncellenir',
      faqTitle: 'SIKÇA SORULAN SORULAR',
      faqSub: 'SSS & Bilgi Bankası',
      wipeCountdown: 'SONRAKİ WİPE:',
      biWeekly: '2 HAFTALIK WİPE',
    },
    de: {
      home: 'STARTSEITE',
      map: 'KARTE & SEED',
      store: 'SHOP',
      community: 'COMMUNITY',
      features: 'FEATURES',
      faq: 'FAQ',
      newSeason: 'FRESH WIPED • SAISON 1',
      featured: 'HIGHLIGHT',
      title: 'RUSTORIUM REBORN',
      desc: 'Fortschrittliche Anti-Cheat-Systeme, optimierte Karten und eine kompetitive Vanilla-Umgebung erwarten dich auf Rustorium.',
      ipCopied: 'IP KOPIERT!',
      connect: 'VERBINDEN',
      comingSoon: 'Demnächst...',
      skinAccess: 'SKIN-ZUGRIFF',
      skinDesc: 'Sofortiger Zugriff auf alle Steam-Workshop-Skins im Spiel ohne zusätzliche Kosten.',
      paymentSoon: 'ZAHLUNGSSYSTEM DEMNÄCHST',
      paymentDesc: 'Zahlungs-Gateway ist derzeit nicht aktiv — diese Funktion ist bald verfügbar.',
      commSupport: 'COMMUNITY & SUPPORT',
      commTitle: 'RUSTORIUM COMMUNITY',
      joinDiscord: 'DISCORD BEITRETEN',
      discordDesc: 'Finde Teammates, lies die Serverregeln und chatte mit unserer Community.',
      joinServer: 'SERVER BEITRETEN',
      steamGroup: 'STEAM-GRUPPE',
      steamDesc: 'Tritt unserer offiziellen Steam-Gruppe bei, um über Ankündigungen informiert zu bleiben.',
      joinSteam: 'STEAM-GRUPPE BEITRETEN',
      vanillaRules: 'VANILLA-REGELN',
      rulesDesc: 'Lies unsere Vanilla-Serverregeln für ein faires Spielerlebnis.',
      readRules: 'REGELN LESEN',
      mapPreview: 'KARTENVORSCHAU',
      iconsEnabled: 'ICONS AKTIVIERT',
      mapSpecs: 'KARTEN-SPEZIFIKATIONEN',
      mapSize: 'Kartengröße:',
      mapHash: 'Karten-ID / Hash:',
      mapType: 'Kartentyp:',
      oilrigs: 'Ölinseln:',
      monuments: 'Wichtige Monumente:',
      autoUpdate: 'Karte aktualisiert sich automatisch mit jedem Wipe-Zyklus',
      faqTitle: 'HÄUFIG GESTELLTE FRAGEN',
      faqSub: 'FAQ & Wissensdatenbank',
      wipeCountdown: 'NÄCHSTER WIPE IN:',
      biWeekly: 'ZWEIWOCHEN-WIPE',
    },
    fr: {
      home: 'ACCUEIL',
      map: 'CARTE & SEED',
      store: 'BOUTIQUE',
      community: 'COMMUNAUTÉ',
      features: 'FONCTIONNALITÉS',
      faq: 'FAQ',
      newSeason: 'FRESH WIPED • SAISON 1',
      featured: 'EN VEDETTE',
      title: 'RUSTORIUM REBORN',
      desc: 'Des systèmes anti-triche avancés, des cartes optimisées et un environnement vanilla compétitif vous attendent sur Rustorium.',
      ipCopied: 'IP COPIÉE !',
      connect: 'REJOINDRE LE SERVEUR',
      comingSoon: 'Bientôt disponible...',
      skinAccess: 'ACCÈS AUX SKINS',
      skinDesc: 'Accès instantané à tous les skins du Steam Workshop en jeu sans frais supplémentaires.',
      paymentSoon: 'SYSTÈME DE PAIEMENT BIENTÔT',
      paymentDesc: "La passerelle de paiement n'est pas active pour le moment — cette fonctionnalité sera bientôt disponible.",
      commSupport: 'COMMUNAUTÉ & SUPPORT',
      commTitle: 'COMMUNAUTÉ RUSTORIUM',
      joinDiscord: 'REJOINDRE DISCORD',
      discordDesc: 'Trouvez des coéquipiers, lisez les règles du serveur et discutez avec notre communauté.',
      joinServer: 'REJOINDRE LE SERVEUR',
      steamGroup: 'GROUPE STEAM',
      steamDesc: 'Rejoignez notre groupe Steam officiel pour rester informé des annonces et des événements.',
      joinSteam: 'REJOINDRE LE GROUPE STEAM',
      vanillaRules: 'RÈGLES VANILLA',
      rulesDesc: 'Consultez les règles de notre serveur vanilla pour une expérience de jeu équitable.',
      readRules: 'LIRE LES RÈGLES',
      mapPreview: 'APERÇU DE LA CARTE',
      iconsEnabled: 'ICÔNES ACTIVÉES',
      mapSpecs: 'SPÉCIFICATIONS DE LA CARTE',
      mapSize: 'Taille de la carte :',
      mapHash: 'ID de la carte / Hash :',
      mapType: 'Type de carte :',
      oilrigs: 'Plates-formes pétrolières :',
      monuments: 'Monuments clés :',
      autoUpdate: 'La carte se met à jour automatiquement à chaque cycle de wipe',
      faqTitle: 'FOIRE AUX QUESTIONS',
      faqSub: 'FAQ & Base de connaissances',
      wipeCountdown: 'PROCHAIN WIPE DANS :',
      biWeekly: 'WIPE BI-HEBDOMADAIRE',
    },
    pl: {
      home: 'STRONA GŁÓWNA',
      map: 'MAPA & SEED',
      store: 'SKLEP',
      community: 'SPOŁECZNOŚĆ',
      features: 'FUNKCJE',
      faq: 'FAQ',
      newSeason: 'FRESH WIPED • SEZON 1',
      featured: 'POLECANE',
      title: 'RUSTORIUM REBORN',
      desc: 'Zaawansowane systemy anti-cheat, zoptymalizowane mapy i konkurencyjne środowisko vanilla czekają na Ciebie na Rustorium.',
      ipCopied: 'IP SKOPIOWANE!',
      connect: 'POŁĄCZ Z SERWEREM',
      comingSoon: 'Wkrótce...',
      skinAccess: 'DOSTĘP DO SKINÓW',
      skinDesc: 'Natychmiastowy dostęp do wszystkich skinów z Warsztatu Steam w grze bez żadnych dodatkowych kosztów.',
      paymentSoon: 'SYSTEM PŁATNOŚCI WKRÓTCE',
      paymentDesc: 'Bramka płatności nie jest obecnie aktywna — ta funkcja będzie dostępna wkrótce.',
      commSupport: 'SPOŁECZNOŚĆ & WSPARCIE',
      commTitle: 'SPOŁECZNOŚĆ RUSTORIUM',
      joinDiscord: 'DOŁĄCZ DO DISCORDA',
      discordDesc: 'Znajdź znajomych do gry, przeczytaj regulamin serwera i rozmawiaj z naszą społecznością.',
      joinServer: 'DOŁĄCZ DO SERWERA',
      steamGroup: 'GRUPA STEAM',
      steamDesc: 'Dołącz do naszej oficjalnej grupy Steam, aby być na bieżąco z ogłoszeniami i wydarzeniami.',
      joinSteam: 'DOŁĄCZ DO GRUPY STEAM',
      vanillaRules: 'ZASADY VANILLA',
      rulesDesc: 'Zapoznaj się z zasadami naszego serwera vanilla, aby zapewnić uczciwą rozgrywkę.',
      readRules: 'PRZECZYTAJ REGULAMIN',
      mapPreview: 'PODGLĄD MAPY',
      iconsEnabled: 'IKONY WŁĄCZONE',
      mapSpecs: 'SPECYFIKACJA MAPY',
      mapSize: 'Rozmiar mapy:',
      mapHash: 'ID mapy / Hash:',
      mapType: 'Typ mapy:',
      oilrigs: 'Platformy wiertnicze:',
      monuments: 'Główne monumenty:',
      autoUpdate: 'Mapa aktualizuje się automatycznie przy każdym cyklu wipe',
      faqTitle: 'NAJCZĘŚCIEJ ZADAWANE PYTANIA',
      faqSub: 'FAQ & Baza wiedzy',
      wipeCountdown: 'NASTĘPNY WİPE ZA:',
      biWeekly: 'WIPE CO DWA TYGODNIE',
    }
  }[lang];

  const tabs = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'map', label: t.map, icon: Map },
    { id: 'store', label: t.store, icon: ShoppingBag },
    { id: 'social', label: t.community, icon: Users },
    { id: 'features', label: t.features, icon: Sparkles },
    { id: 'faq', label: t.faq, icon: HelpCircle },
  ];

  const rules = [
    'No cheating, exploiting, or utilizing game breaking bugs.',
    'No racism, extreme hate speech, or targeted harassment.',
    'Respect team limits if specified by the server configuration.',
    'No excessive chat spam, advertising, or toxic behavior.',
    'Use the official Discord ticket system for reports and ban appeals.',
  ];

  const faqList = {
    en: [
      { q: 'How do I connect?', a: 'Press F1 in-game to open the console, type client.connect 213.14.128.140:28015 and press Enter. Alternatively, click the "CONNECT TO SERVER" button on the home page to copy the IP address.' },
      { q: 'How long do VIP features last?', a: 'Purchased VIP packages and perks (e.g., Skin Access) are valid for 30 days (1 month) from the moment they are activated. They need to be renewed upon expiration.' },
      { q: 'Where can I submit a ban appeal?', a: 'You can report any bans, penalties, or unfair restrictions by opening a support ticket through our official Discord server.' },
      { q: 'What is the wipe schedule?', a: 'Our server wipes both the map and blueprints bi-weekly. Announcements are shared via Discord.' }
    ],
    tr: [
      { q: 'Nasıl bağlanırım?', a: 'Oyun içinde F1 tuşuna basarak konsolu açın, ardından client.connect 213.14.128.140:28015 komutunu yazıp Enter tuşuna basın. Alternatif olarak ana sayfadaki "SUNUCUYA BAĞLAN" butonuna tıklayarak İP adresini kopyalayabilirsiniz.' },
      { q: 'VIP özellikleri ne kadar geçerli?', a: 'Satın aldığınız VIP paketleri ve ayrıcalıkları (Örn: Skin Access) aktif edildiği andan itibaren 30 gün boyunca geçerlidir. Süre sonunda yenilenmesi gerekir.' },
      { q: 'Ban itirazı nereye yapılır?', a: 'Yasaklama, ceza veya haksız kısıtlamalarla ilgili itirazlarınızı resmi Discord sunucumuz üzerinden destek bileti (ticket) açarak yetkili ekibimize bildirebilirsiniz.' },
      { q: 'Wipe süreleri nasıldır?', a: 'Sunucumuz iki haftada bir (Bi-weekly) hem harita hem de blueprint sıfırlaması almaktadır. Duyurular Discord üzerinden paylaşılır.' }
    ],
    de: [
      { q: 'Wie verbinde ich mich?', a: 'Drücke im Spiel F1, um die Konsole zu öffnen, gib client.connect 213.14.128.140:28015 ein und drücke Enter. Alternativ kannst du auf der Startseite auf "VERBINDEN" klicken, um die IP-Adresse zu kopieren.' },
      { q: 'Wie lange halten VIP-Features?', a: 'Gekaufte VIP-Pakete und Vorteile (z. B. Skin-Zugriff) sind ab dem Zeitpunkt der Aktivierung 30 Tage (1 Monat) lang gültig. Sie müssen nach Ablauf verlängert werden.' },
      { q: 'Wo kann ich einen Entbannungsantrag stellen?', a: 'Du kannst Sperren oder Strafen melden, indem du über unseren offiziellen Discord-Server ein Support-Ticket öffnest.' },
      { q: 'Wie sieht der Wipe-Zeitplan aus?', a: 'Unser Server setzt sowohl die Karte als auch die Blueprints alle zwei Wochen (bi-weekly) zurück. Ankündigungen werden über Discord geteilt.' }
    ],
    fr: [
      { q: 'Comment se connecter ?', a: 'Appuyez sur F1 en jeu pour ouvrir la console, tapez client.connect 213.14.128.140:28015 et appuyez sur Entrée. Sinon, cliquez sur le bouton "REJOINDRE LE SERVEUR" sur la page d\'accueil pour copier l\'adresse IP.' },
      { q: 'Combien de temps durent les fonctionnalités VIP ?', a: 'Les packages VIP et avantages achetés (ex: Accès aux skins) sont valables pendant 30 jours (1 mois) à partir du moment où ils sont activés. Ils doivent être renouvelés à l\'expiration.' },
      { q: 'Où puis-je faire une demande de débanissement ?', a: 'Vous pouvez signaler toute exclusion ou sanction en ouvrant un ticket de support via notre serveur Discord officiel.' },
      { q: 'Quel est le calendrier des wipes ?', a: 'Notre serveur réinitialise la carte et les blueprints toutes les deux semaines (bi-weekly). Les annonces sont partagées via Discord.' }
    ],
    pl: [
      { q: 'Jak się połączyć?', a: 'Naciśnij F1 w grze, aby otworzyć konsolę, wpisz client.connect 213.14.128.140:28015 i naciśnij Enter. Alternatywnie kliknij przycisk "POŁĄCZ Z SERWEREM" na stronie głównej, aby skopiować adres IP.' },
      { q: 'Jak długo trwają funkcje VIP?', a: 'Zakupione pakiety VIP i przywileje (np. dostęp do skinów) są ważne przez 30 dni (1 miesiąc) od momentu ich aktywacji. Po upływie tego czasu należy je odnowić.' },
      { q: 'Gdzie mogę złożyć odwołanie od bana?', a: 'Możesz zgłosić wszelkie bany lub kary, otwierając zgłoszenie (ticket) wsparcia za pośrednictwem naszego oficjalnego serwera Discord.' },
      { q: 'Jaki jest harmonogram wipe’ów?', a: 'Nasz serwer czyści zarówno mapę, jak i projekty (blueprints) co dwa tygodnie (bi-weekly). Ogłoszenia są udostępniane na Discordzie.' }
    ]
  }[lang];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
    { code: 'pl', label: 'Polski' }
  ];

  const renderFlag = (lCode) => {
    switch (lCode) {
      case 'tr':
        return (
          <svg className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0" viewBox="0 0 1200 800">
            <rect width="1200" height="800" fill="#E30A17"/>
            <circle cx="400" cy="400" r="240" fill="#FFFFFF"/>
            <circle cx="440" cy="400" r="192" fill="#E30A17"/>
            <polygon points="620,400 740,361 665,468 665,332 740,439" fill="#FFFFFF"/>
          </svg>
        );
      case 'de':
        return (
          <svg className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0" viewBox="0 0 5 3">
            <rect width="5" height="1" fill="#000000"/>
            <rect y="1" width="5" height="1" fill="#DD0000"/>
            <rect y="2" width="5" height="1" fill="#FFCE00"/>
          </svg>
        );
      case 'fr':
        return (
          <svg className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0" viewBox="0 0 3 2">
            <rect width="1" height="2" fill="#0055A5"/>
            <rect x="1" width="1" height="2" fill="#FFFFFF"/>
            <rect x="2" width="1" height="2" fill="#E1000F"/>
          </svg>
        );
      case 'pl':
        return (
          <svg className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0" viewBox="0 0 8 5">
            <rect width="8" height="2.5" fill="#FFFFFF"/>
            <rect y="2.5" width="8" height="2.5" fill="#DC143C"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-3.5 rounded-[2px] shadow-sm flex-shrink-0" viewBox="0 0 60 30">
            <rect width="60" height="30" fill="#012169"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
          </svg>
        );
    }
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden text-[#e9e2d3] select-none bg-[#0c0b0a] font-['Inter',system-ui,sans-serif]">
      <FontLoader />

      {/* 1. KATMAN: Optimize Edilmiş Video Arkaplanı */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ filter: 'brightness(0.55) contrast(1.1) saturate(0.85)' }}
      >
        <source src="/mountain.mp4" type="video/mp4" />
      </video>
      
      <audio ref={audioRef} loop src="/music.mp3" preload="auto" />

      {/* 2. KATMAN: Atmosferik Gradyan ve Vignette (Kenar Karartma) Katmanı */}
      <div 
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at center, rgba(12, 11, 10, 0.35) 0%, rgba(8, 7, 6, 0.82) 100%),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(12, 11, 10, 0.88))
          `
        }}
      ></div>

      {/* 3. KATMAN: Rust Grain / Korozyon Efekti */}
      <RustGrain />

      {/* TOP NAVIGATION BAR */}
      <nav className="absolute top-0 left-0 w-full h-[60px] bg-black/40 backdrop-blur-2xl flex items-center justify-between z-50 border-b border-white/10 shadow-lg">
        <div className="flex items-center h-full pl-3 gap-1">
          <div 
            className="w-10 h-10 bg-gradient-to-br from-[#cf4520] to-[#9c3216] flex items-center justify-center cursor-pointer shadow-lg shadow-[#cf4520]/20 mr-3 transition-transform hover:scale-105"
            style={{ clipPath: 'polygon(0 0, 100% 0, 80% 50%, 100% 100%, 0 100%)' }}
          >
            <Flag className="w-4 h-4 text-white ml-[-2px]" />
          </div>

          <span className="font-['Oswald'] font-semibold text-base tracking-[0.2em] mr-4">
            RUST<span className="text-[#cf4520]">ORIUM</span>
          </span>

          <div className="flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-full p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`h-9 px-4 lg:px-5 rounded-full flex items-center gap-2 text-[12px] font-['Oswald'] font-medium tracking-wider border-none outline-none transition-all ${
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
          {/* DROPDOWN LANGUAGE SELECTOR */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setLangMenuOpen((prev) => !prev)}
              className="h-9 px-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center gap-2 text-[11px] font-['JetBrains_Mono'] font-bold text-[#d9a441] backdrop-blur-md transition-all outline-none"
              title="Select Language"
            >
              {renderFlag(lang)}
              <span>{lang.toUpperCase()}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#d9a441] transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-[#141210]/95 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 py-1">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 flex items-center gap-2.5 text-left text-[11px] font-['JetBrains_Mono'] font-medium transition-colors ${
                      lang === l.code ? 'bg-white/15 text-white font-bold' : 'text-[#c9c2b6] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {renderFlag(l.code)}
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href={discordUrl}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full bg-[#5865F2]/20 hover:bg-[#5865F2]/40 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2] backdrop-blur-md transition-all"
            title="Join Discord"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 127.14 96.36">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.79,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.68,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.81,11.11,105.61,105.61,0,0,0,32.22-16.15c2.62-27.24-4.52-51.13-21.29-76.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5.18-12.72,11.45-12.72S53.9,46,53.89,53,48.71,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.22,60,73.22,53s5.18-12.72,11.47-12.72S96.18,46,96.17,53,91,65.69,84.69,65.69Z"/>
            </svg>
          </a>

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

          <a
            href={`https://www.battlemetrics.com/servers/rust/${battleMetricsId}`}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full bg-[#d9a441]/20 hover:bg-[#d9a441]/40 border border-[#d9a441]/40 flex items-center justify-center text-[#d9a441] backdrop-blur-md transition-all font-['JetBrains_Mono'] font-bold text-[10px]"
            title="View on BattleMetrics"
          >
            BM
          </a>

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

      {/* FAQ TAB */}
      {activeTab === 'faq' && (
        <div className="absolute top-[60px] bottom-[36px] left-0 w-full px-6 flex items-center justify-center z-10 overflow-y-auto py-6">
          <div className="w-full max-w-2xl bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-5 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#d9a441]/15 border border-[#d9a441]/30 flex items-center justify-center text-[#d9a441]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-['Oswald'] font-semibold text-lg text-white">{t.faqTitle}</h2>
                <p className="text-[11px] text-[#948b7c] font-['JetBrains_Mono']">{t.faqSub}</p>
              </div>
            </div>

            <div className="space-y-3">
              {faqList.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden transition-all">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-4 py-3.5 flex items-center justify-between text-left font-['Oswald'] font-medium text-white text-[13px] hover:bg-white/[0.02]"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[#cf4520]">#</span> {item.q}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-[#948b7c] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-[11.5px] text-[#c9c2b6] leading-relaxed border-t border-white/5 font-['Inter']">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FEATURES TAB */}
      {activeTab === 'features' && (
        <div className="absolute top-[60px] bottom-[36px] left-0 w-full px-6 flex items-center justify-center z-10 overflow-y-auto py-6">
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#d9a441]/15 border border-[#d9a441]/30 flex items-center justify-center mb-3 text-[#d9a441]">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="font-['Oswald'] font-semibold text-base text-white mb-1">EASY SKIN</h3>
                <p className="text-[#948b7c] text-[11px] leading-relaxed mb-2">
                  <span className="font-['JetBrains_Mono'] text-white">skin [skinid]</span>
                </p>
                <p className="text-[#948b7c] text-[11px] leading-relaxed">
                  Changes skin of held item instantly with simple chat commands.
                </p>
              </div>
              <span className="mt-4 font-['JetBrains_Mono'] text-[9px] text-[#d9a441] font-bold">CUSTOMIZATION</span>
            </div>

            <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#cf4520]/15 border border-[#cf4520]/30 flex items-center justify-center mb-3 text-[#cf4520]">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="font-['Oswald'] font-semibold text-base text-white mb-1">FURNACE SPLITTER</h3>
                <p className="text-[#948b7c] text-[11px] leading-relaxed mb-2">
                  <span className="font-['JetBrains_Mono'] text-white">Auto Distribution</span>
                </p>
                <p className="text-[#948b7c] text-[11px] leading-relaxed">
                  Automatically splits ore and wood evenly across your furnaces.
                </p>
              </div>
              <span className="mt-4 font-['JetBrains_Mono'] text-[9px] text-[#cf4520] font-bold">QUALITY OF LIFE</span>
            </div>

            <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#52c77a]/15 border border-[#52c77a]/30 flex items-center justify-center mb-3 text-[#52c77a]">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-['Oswald'] font-semibold text-base text-white mb-1">CHEST SORTER</h3>
                <p className="text-[#948b7c] text-[11px] leading-relaxed mb-2">
                  <span className="font-['JetBrains_Mono'] text-white">Quick Organize</span>
                </p>
                <p className="text-[#948b7c] text-[11px] leading-relaxed">
                  Quickly organize and sort items inside your storage containers with ease.
                </p>
              </div>
              <span className="mt-4 font-['JetBrains_Mono'] text-[9px] text-[#52c77a] font-bold">INVENTORY MGMT</span>
            </div>

            <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#4a7fd9]/15 border border-[#4a7fd9]/30 flex items-center justify-center mb-3 text-[#4a7fd9]">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="font-['Oswald'] font-semibold text-base text-white mb-1">RECYCLER SPEED</h3>
                <p className="text-[#948b7c] text-[11px] leading-relaxed mb-2">
                  <span className="font-['JetBrains_Mono'] text-white">1.5X Speed Multiplier</span>
                </p>
                <p className="text-[#948b7c] text-[11px] leading-relaxed">
                  Recycler operations process components 50 percent faster than vanilla.
                </p>
              </div>
              <span className="mt-4 font-['JetBrains_Mono'] text-[9px] text-[#4a7fd9] font-bold">SERVER BOOST</span>
            </div>

          </div>
        </div>
      )}

      {/* HOME with NEW CLEAN SEASON INDICATOR */}
      {activeTab === 'home' && (
        <div className="absolute inset-0 top-[60px] z-10">
          <div className="absolute inset-0 top-0 flex items-end justify-between px-8 pb-20">
            <div className="w-[340px] cursor-pointer" onClick={handleCopyIp}>
              <div className="bg-white/[0.06] backdrop-blur-2xl w-full aspect-video relative overflow-hidden border border-white/10 rounded-2xl flex flex-col justify-between p-4 shadow-2xl">
                <ServerScene tone="amber" dim />
                <div className="relative z-10 flex justify-between items-center">
                  <span 
                    className="bg-[#cf4520] text-white text-[9px] font-extrabold px-3 py-1 font-['JetBrains_Mono'] uppercase tracking-wider"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)' }}
                  >
                    {serverType}
                  </span>
                  <span className="text-[10px] font-['JetBrains_Mono'] text-[#52c77a] font-bold flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-[#52c77a]"></span> {onlinePlayers}/{maxPlayers}
                  </span>
                </div>
                
                <div className="relative z-10 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between text-[9px] text-[#d9a441] font-['JetBrains_Mono'] font-bold mb-1">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t.wipeCountdown}</span>
                    <span>{t.biWeekly}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center font-['JetBrains_Mono']">
                    <div className="bg-white/[0.05] p-1 rounded"><span className="text-white font-bold text-xs">{timeLeft.days}</span><span className="block text-[8px] text-[#948b7c]">D</span></div>
                    <div className="bg-white/[0.05] p-1 rounded"><span className="text-white font-bold text-xs">{timeLeft.hours}</span><span className="block text-[8px] text-[#948b7c]">H</span></div>
                    <div className="bg-white/[0.05] p-1 rounded"><span className="text-white font-bold text-xs">{timeLeft.minutes}</span><span className="block text-[8px] text-[#948b7c]">M</span></div>
                    <div className="bg-white/[0.05] p-1 rounded"><span className="text-white font-bold text-xs">{timeLeft.seconds}</span><span className="block text-[8px] text-[#948b7c]">S</span></div>
                  </div>
                </div>

                <div className="relative z-10 bg-black/50 backdrop-blur-md p-2 rounded-xl border border-white/10 mt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-['Oswald'] font-medium uppercase text-white truncate mr-2">{serverName}</span>
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
                <span className="text-[11px] font-['Oswald'] font-medium text-[#948b7c] tracking-wider uppercase">{t.newSeason}</span>
                <span 
                  className="bg-[#cf4520] text-white text-[10px] font-bold px-3 py-0.5 font-['JetBrains_Mono'] uppercase"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)' }}
                >
                  {t.featured}
                </span>
              </div>

              <h1 className="text-[48px] font-['Oswald'] font-semibold leading-none mb-2 tracking-tight text-white drop-shadow-md">
                {t.title}
              </h1>

              <p className="text-[13px] text-[#c9c2b6] mb-6 leading-relaxed max-w-lg drop-shadow">
                {t.desc}
              </p>

              <div className="flex gap-2">
                <button onClick={handleCopyIp} className="bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 flex items-center gap-2 text-[11px] font-['Oswald'] font-medium text-white shadow-lg">
                  {copiedIp ? <Check className="w-3.5 h-3.5 text-[#52c77a]" /> : <Copy className="w-3.5 h-3.5 text-[#948b7c]" />}
                  <span>{copiedIp ? t.ipCopied : t.connect}</span>
                </button>
                <button onClick={() => setActiveTab('store')} className="bg-[#d9a441] hover:bg-[#c3922f] text-[#141210] rounded-full px-6 py-2.5 flex items-center gap-1.5 text-[11px] font-['Oswald'] font-bold shadow-lg">
                  <span>{t.store}</span>
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
            <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-['Oswald'] font-semibold text-[#d9a441] flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {t.mapPreview}
                  </span>
                  <span className="text-[9px] font-['JetBrains_Mono'] bg-black/40 px-2 py-0.5 rounded text-white/70">{t.iconsEnabled}</span>
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
                        Map image failed to load. You can check it via the link below.
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <a href={`https://rustmaps.com/map/${mapInfo.mapHash}`} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-1.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 py-2.5 rounded-xl text-[11px] font-['Oswald'] text-white">
                <span>VIEW FULL MAP ON RUSTMAPS</span> <ExternalLink className="w-3.5 h-3.5 text-[#948b7c]" />
              </a>
            </div>

            <div className="bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-['Oswald'] font-semibold text-[#cf4520] flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> {t.mapSpecs}
                  </span>
                </div>
                <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-3 font-['JetBrains_Mono'] text-[12px]">
                  <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[#948b7c]">{t.mapSize}</span> <span className="text-white font-bold">{mapInfo.size}m</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[#948b7c]">{t.mapHash}</span> <span className="text-[#d9a441] font-bold text-[10px]">{mapInfo.mapHash}</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[#948b7c]">{t.mapType}</span> <span className="text-white">{mapInfo.mapType}</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[#52c77a]">{t.oilrigs}</span> <span className="text-[#52c77a]">{mapInfo.oilrigs}</span></div>
                  <div className="flex justify-between"><span className="text-[#948b7c]">{t.monuments}</span> <span className="text-white/80 text-[10px] text-right">{mapInfo.monuments}</span></div>
                </div>
              </div>
              <div className="mt-4 text-center text-[9px] text-[#5c564c] font-['JetBrains_Mono']">{t.autoUpdate}</div>
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
                {t.comingSoon}
              </span>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-['Oswald'] font-semibold text-xl text-white tracking-wide">{t.skinAccess}</h2>
                <span className="text-[12px] font-bold font-['JetBrains_Mono'] text-[#d9a441] bg-[#d9a441]/10 px-3 py-1 rounded-full border border-[#d9a441]/30">
                  $5.00 / MO
                </span>
              </div>
              <p className="text-[#c9c2b6] leading-relaxed text-[12px] mb-5">
                {t.skinDesc}
              </p>
              <button disabled className="w-full bg-white/[0.05] text-[#8a8378] px-6 py-3 rounded-xl font-['JetBrains_Mono'] text-[11px] font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-white/10">
                <Lock className="w-4 h-4 text-[#d9a441]" /> {t.paymentSoon}
              </button>
              <p className="text-center text-[10px] text-[#5c564c] font-['JetBrains_Mono'] mt-3">
                {t.paymentDesc}
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
              <span className="text-[12px] font-['Oswald'] font-medium text-[#cf4520] tracking-wider uppercase">{t.commSupport}</span>
              <span className="text-[10px] font-['JetBrains_Mono'] text-[#5c564c]">{t.commTitle}</span>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <MessageCircle className="w-6 h-6 text-[#5865F2] mb-3" />
                  <div className="font-['Oswald'] font-medium text-white text-sm mb-1.5">{t.joinDiscord}</div>
                  <p className="text-[#948b7c] text-[11px] leading-relaxed">
                    {t.discordDesc}
                  </p>
                </div>
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center justify-center text-white px-4 py-2.5 rounded-lg font-['Oswald'] font-medium tracking-wide text-[11px] w-fit shadow-md"
                  style={{ backgroundColor: '#5865F2' }}
                >
                  {t.joinServer}
                </a>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <Users className="w-6 h-6 text-[#66c0f4] mb-3" />
                  <div className="font-['Oswald'] font-medium text-white text-sm mb-1.5">{t.steamGroup}</div>
                  <p className="text-[#948b7c] text-[11px] leading-relaxed">
                    {t.steamDesc}
                  </p>
                </div>
                <a
                  href={steamUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center justify-center text-white px-4 py-2.5 rounded-lg font-['Oswald'] font-medium tracking-wide text-[11px] w-fit shadow-md"
                  style={{ backgroundColor: '#1b2838' }}
                >
                  {t.joinSteam}
                </a>
              </div>

              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <ShieldCheck className="w-6 h-6 text-[#52c77a] mb-3" />
                  <div className="font-['Oswald'] font-medium text-white text-sm mb-1.5">{t.vanillaRules}</div>
                  <p className="text-[#948b7c] text-[11px] leading-relaxed">
                    {t.rulesDesc}
                  </p>
                </div>
                <button
                  onClick={() => setRulesOpen((v) => !v)}
                  className="mt-4 inline-flex items-center justify-between bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-lg text-[#c9c2b6] px-4 py-2.5 font-['Oswald'] font-medium tracking-wide text-[11px]"
                >
                  {t.readRules}
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
      <footer className="absolute bottom-0 left-0 w-full h-[36px] bg-black/40 backdrop-blur-xl border-t border-white/10 flex items-center justify-between px-6 z-50">
        <span className="font-['JetBrains_Mono'] text-[10px] text-[#5c564c] tracking-widest">RUSTORIUM.COM v1.0</span>
        <span className="font-['JetBrains_Mono'] text-[10px] text-[#52c77a] tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#52c77a] animate-pulse"></span>
          EU-WEST #1
        </span>
      </footer>
    </div>
  );
}
