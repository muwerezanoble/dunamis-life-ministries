import React, { useState, useEffect, useCallback, useRef } from "react";
import { Room, RoomEvent, Track, createLocalVideoTrack } from "livekit-client";
import {
  Play, BookOpen, NotebookPen, Heart, Bell, Settings, Send, Plus, X, Radio,
  Grid3x3, ChevronLeft, HandHeart, Calendar, Users, Download, Globe, Wallet, Tag,
  Megaphone, ShieldCheck, ChevronRight, Landmark, TrendingUp, TrendingDown, Receipt, Home, Cross, Sparkles, Camera, Mic, MicOff, Video, VideoOff, RotateCcw, Save,
} from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap');`;

const COLORS = {
  bg: "#1B1F2A",
  surface: "#242938",
  surfaceRaised: "#2D3345",
  gold: "#C9A24B",
  goldSoft: "#D9BB74",
  lavender: "#7C8DB5",
  ink: "#F1EDE4",
  inkMuted: "#9BA3B5",
  border: "#343B4E",
};

const UI_STRINGS = {
  en: { live: "Live", sermons: "Sermons", bible: "Bible", more: "More", notes: "Notebook", testimonies: "Testimonies", prayer: "Prayer Wall", events: "Events", giving: "Giving", groups: "Small Groups", notifications: "Alerts", language: "Language", offline: "Offline Readings", welcome: "Grace be with you" },
  lg: { live: "Ku Bulambe", sermons: "Ebisaale", bible: "Baibuli", more: "Ebirala", notes: "Ekitabo", testimonies: "Obujulizi", prayer: "Ekisenge ky'Okusaba", events: "Ebiro", giving: "Ekyokuwaayo", groups: "Ebibinja", notifications: "Obubaka", language: "Olulimi", offline: "Okusoma nga Toli ku Yintaneeti", welcome: "Ekisa kibeere naawe" },
  fr: { live: "En direct", sermons: "Sermons", bible: "Bible", more: "Plus", notes: "Carnet", testimonies: "Témoignages", prayer: "Mur de prière", events: "Événements", giving: "Don", groups: "Petits groupes", notifications: "Alertes", language: "Langue", offline: "Lectures hors ligne", welcome: "Que la grâce soit avec vous" },
  de: { live: "Live", sermons: "Predigten", bible: "Bibel", more: "Mehr", notes: "Notizen", testimonies: "Zeugnisse", prayer: "Gebetswand", events: "Veranstaltungen", giving: "Spenden", groups: "Kleingruppen", notifications: "Benachrichtigungen", language: "Sprache", offline: "Offline-Lesungen", welcome: "Gnade sei mit dir" },
  sw: { live: "Moja kwa Moja", sermons: "Mahubiri", bible: "Biblia", more: "Zaidi", notes: "Daftari", testimonies: "Ushuhuda", prayer: "Ukuta wa Sala", events: "Matukio", giving: "Sadaka", groups: "Vikundi Vidogo", notifications: "Arifa", language: "Lugha", offline: "Usomaji Nje ya Mtandao", welcome: "Neema iwe nawe" },
  ar: { live: "بث مباشر", sermons: "العظات", bible: "الكتاب المقدس", more: "المزيد", notes: "الملاحظات", testimonies: "الشهادات", prayer: "جدار الصلاة", events: "الفعاليات", giving: "العطاء", groups: "مجموعات صغيرة", notifications: "الإشعارات", language: "اللغة", offline: "قراءات دون اتصال", welcome: "لتكن النعمة معك" },
  zh: { live: "直播", sermons: "讲道", bible: "圣经", more: "更多", notes: "笔记本", testimonies: "见证", prayer: "祷告墙", events: "活动", giving: "奉献", groups: "小组", notifications: "通知", language: "语言", offline: "离线阅读", welcome: "愿恩典与你同在" },
  es: { live: "En vivo", sermons: "Sermones", bible: "Biblia", more: "Más", notes: "Cuaderno", testimonies: "Testimonios", prayer: "Muro de oración", events: "Eventos", giving: "Ofrenda", groups: "Grupos pequeños", notifications: "Notificaciones", language: "Idioma", offline: "Lecturas sin conexión", welcome: "Que la gracia sea contigo" },
  ru: { live: "Прямой эфир", sermons: "Проповеди", bible: "Библия", more: "Ещё", notes: "Заметки", testimonies: "Свидетельства", prayer: "Стена молитв", events: "События", giving: "Пожертвования", groups: "Малые группы", notifications: "Уведомления", language: "Язык", offline: "Чтение офлайн", welcome: "Благодать вам" },
  pa: { live: "ਸਿੱਧਾ ਪ੍ਰਸਾਰਣ", sermons: "ਉਪਦੇਸ਼", bible: "ਬਾਈਬਲ", more: "ਹੋਰ", notes: "ਨੋਟਬੁੱਕ", testimonies: "ਗਵਾਹੀਆਂ", prayer: "ਪ੍ਰਾਰਥਨਾ ਕੰਧ", events: "ਸਮਾਗਮ", giving: "ਦਾਨ", groups: "ਛੋਟੇ ਸਮੂਹ", notifications: "ਸੂਚਨਾਵਾਂ", language: "ਭਾਸ਼ਾ", offline: "ਆਫਲਾਈਨ ਰੀਡਿੰਗ", welcome: "ਕਿਰਪਾ ਤੁਹਾਡੇ ਨਾਲ ਹੋਵੇ" },
  pt: { live: "Ao vivo", sermons: "Sermões", bible: "Bíblia", more: "Mais", notes: "Caderno", testimonies: "Testemunhos", prayer: "Mural de oração", events: "Eventos", giving: "Ofertas", groups: "Pequenos grupos", notifications: "Notificações", language: "Idioma", offline: "Leituras offline", welcome: "Graça e paz" },
  sv: { live: "Live", sermons: "Predikningar", bible: "Bibeln", more: "Mer", notes: "Anteckningar", testimonies: "Vittnesbörd", prayer: "Bönevägg", events: "Evenemang", giving: "Gåvor", groups: "Smågrupper", notifications: "Aviseringar", language: "Språk", offline: "Offline-läsning", welcome: "Nåd vare med dig" },
  it: { live: "In diretta", sermons: "Prediche", bible: "Bibbia", more: "Altro", notes: "Quaderno", testimonies: "Testimonianze", prayer: "Muro della preghiera", events: "Eventi", giving: "Offerte", groups: "Piccoli gruppi", notifications: "Notifiche", language: "Lingua", offline: "Letture offline", welcome: "La grazia sia con te" },
};

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" }, { code: "fr", label: "Français" }, { code: "de", label: "Deutsch" },
  { code: "sw", label: "Kiswahili" }, { code: "lg", label: "Luganda" }, { code: "ar", label: "العربية", rtl: true },
  { code: "zh", label: "中文" }, { code: "es", label: "Español" }, { code: "ru", label: "Русский" },
  { code: "pa", label: "ਪੰਜਾਬੀ" }, { code: "pt", label: "Português" }, { code: "sv", label: "Svenska" },
  { code: "it", label: "Italiano" },
];

const BIBLE_VERSIONS = [
  { code: "kjv", label: "KJV", available: true },
  { code: "niv", label: "NIV", available: false },
  { code: "amp", label: "Amplified", available: false },
];

const BIBLE_BOOKS = [
  { name: "Genesis", chapters: 50 }, { name: "Exodus", chapters: 40 }, { name: "Leviticus", chapters: 27 },
  { name: "Numbers", chapters: 36 }, { name: "Deuteronomy", chapters: 34 }, { name: "Joshua", chapters: 24 },
  { name: "Judges", chapters: 21 }, { name: "Ruth", chapters: 4 }, { name: "1 Samuel", chapters: 31 },
  { name: "2 Samuel", chapters: 24 }, { name: "1 Kings", chapters: 22 }, { name: "2 Kings", chapters: 25 },
  { name: "1 Chronicles", chapters: 29 }, { name: "2 Chronicles", chapters: 36 }, { name: "Ezra", chapters: 10 },
  { name: "Nehemiah", chapters: 13 }, { name: "Esther", chapters: 10 }, { name: "Job", chapters: 42 },
  { name: "Psalms", chapters: 150 }, { name: "Proverbs", chapters: 31 }, { name: "Ecclesiastes", chapters: 12 },
  { name: "Song of Solomon", chapters: 8 }, { name: "Isaiah", chapters: 66 }, { name: "Jeremiah", chapters: 52 },
  { name: "Lamentations", chapters: 5 }, { name: "Ezekiel", chapters: 48 }, { name: "Daniel", chapters: 12 },
  { name: "Hosea", chapters: 14 }, { name: "Joel", chapters: 3 }, { name: "Amos", chapters: 9 },
  { name: "Obadiah", chapters: 1 }, { name: "Jonah", chapters: 4 }, { name: "Micah", chapters: 7 },
  { name: "Nahum", chapters: 3 }, { name: "Habakkuk", chapters: 3 }, { name: "Zephaniah", chapters: 3 },
  { name: "Haggai", chapters: 2 }, { name: "Zechariah", chapters: 14 }, { name: "Malachi", chapters: 4 },
  { name: "Matthew", chapters: 28 }, { name: "Mark", chapters: 16 }, { name: "Luke", chapters: 24 },
  { name: "John", chapters: 21 }, { name: "Acts", chapters: 28 }, { name: "Romans", chapters: 16 },
  { name: "1 Corinthians", chapters: 16 }, { name: "2 Corinthians", chapters: 13 }, { name: "Galatians", chapters: 6 },
  { name: "Ephesians", chapters: 6 }, { name: "Philippians", chapters: 4 }, { name: "Colossians", chapters: 4 },
  { name: "1 Thessalonians", chapters: 5 }, { name: "2 Thessalonians", chapters: 3 }, { name: "1 Timothy", chapters: 6 },
  { name: "2 Timothy", chapters: 4 }, { name: "Titus", chapters: 3 }, { name: "Philemon", chapters: 1 },
  { name: "Hebrews", chapters: 13 }, { name: "James", chapters: 5 }, { name: "1 Peter", chapters: 5 },
  { name: "2 Peter", chapters: 3 }, { name: "1 John", chapters: 5 }, { name: "2 John", chapters: 1 },
  { name: "3 John", chapters: 1 }, { name: "Jude", chapters: 1 }, { name: "Revelation", chapters: 22 },
];
const TOTAL_CHAPTERS = BIBLE_BOOKS.reduce((sum, b) => sum + b.chapters, 0);

function chapterKey(bookIdx, chapter) { return `bible-full:${bookIdx}:${chapter}`; }
const OFFLINE_VERSES = [
  { ref: "John 3:16", text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
  { ref: "Psalm 23:1", text: "The LORD is my shepherd; I shall not want." },
  { ref: "Romans 8:28", text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
  { ref: "Philippians 4:13", text: "I can do all things through Christ which strengtheneth me." },
  { ref: "Isaiah 41:10", text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee." },
  { ref: "Joshua 1:9", text: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest." },
  { ref: "Proverbs 3:5-6", text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths." },
  { ref: "Psalm 46:1", text: "God is our refuge and strength, a very present help in trouble." },
  { ref: "Matthew 11:28", text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest." },
  { ref: "Jeremiah 29:11", text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end." },
  { ref: "1 Corinthians 13:4-7", text: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up... Beareth all things, believeth all things, hopeth all things, endureth all things." },
  { ref: "Galatians 5:22-23", text: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance: against such there is no law." },
];

// ---------- shared primitives ----------
function useSharedList(key) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const result = await window.storage.get(key, true);
      setItems(result ? JSON.parse(result.value) : []);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => { load(); }, [load]);

  const save = useCallback(async (next) => {
    setItems(next);
    try {
      await window.storage.set(key, JSON.stringify(next), true);
    } catch (e) {
      console.error("Storage error", e);
    }
  }, [key]);

  return { items, save, loading, reload: load };
}

function Header({ title, subtitle, onBack }) {
  return (
    <div style={{ padding: "28px 20px 18px", display: "flex", alignItems: "flex-start", gap: 10 }}>
      {onBack && (
        <div onClick={onBack} style={{ cursor: "pointer", marginTop: 4 }}>
          <ChevronLeft size={22} color={COLORS.inkMuted} />
        </div>
      )}
      <div>
        <div style={{ fontFamily: "Lora, serif", fontSize: 26, fontWeight: 600, color: COLORS.ink, letterSpacing: 0.2 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: COLORS.inkMuted, marginTop: 4 }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 18, ...style }}>
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, style }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? COLORS.border : COLORS.gold,
        color: disabled ? COLORS.inkMuted : "#1B1F2A",
        border: "none", borderRadius: 10, padding: "11px 18px",
        fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14,
        cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent", color: COLORS.lavender,
        border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "11px 18px",
        fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function TextField({ value, onChange, placeholder, multiline, rows, type }) {
  const common = {
    width: "100%", background: COLORS.surfaceRaised, border: `1px solid ${COLORS.border}`,
    borderRadius: 10, padding: "10px 12px", color: COLORS.ink,
    fontFamily: "Inter, sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box",
  };
  return multiline ? (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      rows={rows || 4} style={{ ...common, resize: "vertical", fontFamily: "Lora, serif", lineHeight: 1.6 }} />
  ) : (
    <input type={type || "text"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={common} />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      style={{ background: COLORS.surfaceRaised, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 12px", color: COLORS.ink, fontFamily: "Inter, sans-serif", fontSize: 14 }}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{ textAlign: "center", padding: "36px 12px", color: COLORS.inkMuted, fontFamily: "Inter, sans-serif", fontSize: 13.5 }}>
      {text}
    </div>
  );
}

function Pill({ children, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      padding: "6px 12px", borderRadius: 999, fontSize: 12, fontFamily: "Inter, sans-serif", fontWeight: 600,
      cursor: onClick ? "pointer" : "default",
      background: active ? COLORS.gold : COLORS.surfaceRaised,
      color: active ? "#1B1F2A" : COLORS.inkMuted,
      border: `1px solid ${active ? COLORS.gold : COLORS.border}`,
      whiteSpace: "nowrap",
    }}>
      {children}
    </div>
  );
}

// ---------- LIVE ----------
function toEmbedUrl(url) {
  if (!url) return null;
  const yt = url.match(/(?:youtu\.be\/|v=|live\/)([a-zA-Z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=0`;
  if (url.includes("facebook.com")) return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`;
  return url;
}

function LiveTab({ isAdmin }) {
  const [serviceTitle, setServiceTitle] = useState("Sunday Celebration Service");
  const [titleDraft, setTitleDraft] = useState("Sunday Celebration Service");
  const [nextService, setNextService] = useState("");
  const [nextDraft, setNextDraft] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [amenCount, setAmenCount] = useState(0);
  const [prayer, setPrayer] = useState("");
  const [prayerSent, setPrayerSent] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [tool, setTool] = useState("notes");
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  const [streamState, setStreamState] = useState("idle");
  const [streamError, setStreamError] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [facing, setFacing] = useState("environment");
  const videoRef = useRef(null);
  const roomRef = useRef(null);
  const TOKEN_ENDPOINT = import.meta.env.VITE_TOKEN_ENDPOINT || "http://localhost:3001/api/token";

  const quickVerses = [
    ["Psalm 23:1", "The LORD is my shepherd; I shall not want."],
    ["John 3:16", "For God so loved the world, that he gave his only begotten Son..."],
    ["Philippians 4:13", "I can do all things through Christ which strengtheneth me."],
    ["Isaiah 40:31", "But they that wait upon the LORD shall renew their strength..."],
    ["Romans 8:28", "And we know that all things work together for good to them that love God..."],
  ];

  const attachTrack = useCallback((track) => {
    if (track.kind === Track.Kind.Video && videoRef.current) {
      track.attach(videoRef.current);
    }
    if (track.kind === Track.Kind.Audio) track.attach();
  }, []);

  const disconnectRoom = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    try { await room.disconnect(); } catch (e) {}
    roomRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setViewerCount(0);
    setCameraOn(false);
    setStreamState("idle");
  }, []);

  const getToken = async (role) => {
    const identity = `${role}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const res = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identity, role, roomName: "dunamis-main-service" }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Could not get a streaming token.");
    return data;
  };

  const connectViewer = useCallback(async () => {
    if (isAdmin || roomRef.current) return;
    setStreamState("connecting"); setStreamError("");
    try {
      const { token, serverUrl } = await getToken("viewer");
      const room = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = room;
      const updateCount = () => setViewerCount(room.remoteParticipants.size + 1);
      room.on(RoomEvent.TrackSubscribed, (track) => { attachTrack(track); if (track.kind === Track.Kind.Video) setIsLive(true); });
      room.on(RoomEvent.TrackUnsubscribed, (track) => { if (track.kind === Track.Kind.Video) setIsLive(false); });
      room.on(RoomEvent.ParticipantConnected, updateCount);
      room.on(RoomEvent.ParticipantDisconnected, updateCount);
      room.on(RoomEvent.Disconnected, () => setStreamState("idle"));
      await room.connect(serverUrl, token);
      updateCount();
      room.remoteParticipants.forEach(p => p.trackPublications.forEach(pub => pub.track && attachTrack(pub.track)));
      setStreamState("connected");
    } catch (e) {
      roomRef.current = null;
      setStreamState("error");
      setStreamError(e?.message || "Streaming server is not configured yet.");
    }
  }, [isAdmin, attachTrack]);

  useEffect(() => {
    (async () => {
      try {
        const [t,n,l,a,no] = await Promise.all([
          window.storage.get("live-service-title", true), window.storage.get("live-next-service", true),
          window.storage.get("live-status", true), window.storage.get("live-amen-count", true),
          window.storage.get("live-service-notes", true),
        ]);
        if (t) { setServiceTitle(t.value); setTitleDraft(t.value); }
        if (n) { setNextService(n.value); setNextDraft(n.value); }
        if (l) setIsLive(l.value === "true");
        if (a) setAmenCount(Number(a.value) || 0);
        if (no) setNotes(no.value || "");
      } catch (e) {}
    })();
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(timer); const r=roomRef.current; if(r) r.disconnect(); };
  }, []);

  useEffect(() => { if (!isAdmin) connectViewer(); }, [isAdmin, connectViewer]);

  const startBroadcast = async () => {
    setStreamError(""); setStreamState("connecting");
    try {
      await disconnectRoom();
      setStreamState("connecting");
      const { token, serverUrl } = await getToken("broadcaster");
      const room = new Room({ adaptiveStream: true, dynacast: true });
      roomRef.current = room;
      const updateCount = () => setViewerCount(room.remoteParticipants.size + 1);
      room.on(RoomEvent.ParticipantConnected, updateCount);
      room.on(RoomEvent.ParticipantDisconnected, updateCount);
      room.on(RoomEvent.Disconnected, () => setStreamState("idle"));
      await room.connect(serverUrl, token);
      await room.localParticipant.setMicrophoneEnabled(true);
      await room.localParticipant.setCameraEnabled(true, { facingMode: facing });
      const pub = room.localParticipant.getTrackPublication(Track.Source.Camera);
      if (pub?.track && videoRef.current) pub.track.attach(videoRef.current);
      setMicOn(true); setCameraOn(true); setIsLive(true); setStreamState("broadcasting"); updateCount();
      try { await window.storage.set("live-status", "true", true); } catch(e){}
    } catch (e) {
      setStreamState("error"); setStreamError(e?.message || "Could not start broadcast.");
      setIsLive(false);
    }
  };

  const endBroadcast = async () => {
    const room=roomRef.current;
    if(room){ try { await room.localParticipant.setCameraEnabled(false); await room.localParticipant.setMicrophoneEnabled(false); } catch(e){} }
    await disconnectRoom(); setIsLive(false); setCameraOn(false); setMicOn(false);
    try { await window.storage.set("live-status", "false", true); } catch(e){}
  };
  const toggleMic = async () => { const next=!micOn; try { await roomRef.current?.localParticipant.setMicrophoneEnabled(next); setMicOn(next); } catch(e){setStreamError(e.message);} };
  const toggleCamera = async () => { const next=!cameraOn; try { await roomRef.current?.localParticipant.setCameraEnabled(next, {facingMode:facing}); setCameraOn(next); } catch(e){setStreamError(e.message);} };
  const switchCamera = async () => {
    const room=roomRef.current; if(!room) return;
    const next=facing==="environment"?"user":"environment"; setFacing(next);
    try {
      const oldPub=room.localParticipant.getTrackPublication(Track.Source.Camera);
      if(oldPub?.track) await room.localParticipant.unpublishTrack(oldPub.track, true);
      const track=await createLocalVideoTrack({facingMode:next});
      await room.localParticipant.publishTrack(track);
      if(videoRef.current) track.attach(videoRef.current);
      setCameraOn(true);
    } catch(e){ setStreamError(e?.message||"Could not switch camera."); }
  };
  const saveSettings = async () => { setServiceTitle(titleDraft.trim()||"Live Service"); setNextService(nextDraft); try { await Promise.all([window.storage.set("live-service-title",titleDraft.trim()||"Live Service",true),window.storage.set("live-next-service",nextDraft,true)]); } catch(e){} };
  const addAmen = async () => { const next=amenCount+1; setAmenCount(next); try { await window.storage.set("live-amen-count",String(next),true); } catch(e){} };
  const saveNotes = async () => { try { await window.storage.set("live-service-notes",notes,true); } catch(e){} setNotesSaved(true); setTimeout(()=>setNotesSaved(false),1800); };
  const submitPrayer = async () => { if(!prayer.trim()) return; try { const r=await window.storage.get("prayer-requests",true); const existing=r?.value?JSON.parse(r.value):[]; await window.storage.set("prayer-requests",JSON.stringify([{id:Date.now(),text:prayer.trim(),date:new Date().toISOString(),source:"Live Service"},...existing]),true); } catch(e){} setPrayer("");setPrayerSent(true);setTimeout(()=>setPrayerSent(false),2200); };

  const serviceDate=nextService?new Date(nextService).getTime():0, remaining=serviceDate-now;
  const countdown=remaining>0?(()=>{const total=Math.floor(remaining/1000),d=Math.floor(total/86400),h=Math.floor((total%86400)/3600),m=Math.floor((total%3600)/60),sec=total%60;return `${d?d+"d ":""}${String(h).padStart(2,"0")}h ${String(m).padStart(2,"0")}m ${String(sec).padStart(2,"0")}s`;})():null;

  return <div style={{padding:"0 20px 30px"}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"flex-start",marginBottom:14,flexWrap:"wrap"}}>
      <div><div style={{display:"flex",alignItems:"center",gap:9,marginBottom:5}}><span style={{width:9,height:9,borderRadius:99,background:isLive?"#EF5350":COLORS.inkMuted,boxShadow:isLive?"0 0 0 5px rgba(239,83,80,.12)":"none"}}/><span style={{fontFamily:"Inter,sans-serif",fontSize:12,fontWeight:700,letterSpacing:1.2,color:isLive?"#EF7773":COLORS.inkMuted}}>{isLive?"LIVE NOW":"NEXT SERVICE"}</span></div><h2 style={{margin:0,fontFamily:"Lora,serif",color:COLORS.ink,fontSize:25}}>{serviceTitle}</h2>{!isLive&&countdown&&<div style={{color:COLORS.goldSoft,fontFamily:"Inter,sans-serif",marginTop:6,fontWeight:600}}>Starts in {countdown}</div>}</div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>{viewerCount>0&&<Pill>{viewerCount} connected</Pill>}{isLive&&<Pill active>● LIVE</Pill>}</div>
    </div>

    <Card style={{padding:0,overflow:"hidden",borderColor:isLive?COLORS.gold:COLORS.border}}>
      <div style={{position:"relative",background:"#080A0F",aspectRatio:"16/9",display:"grid",placeItems:"center"}}>
        <video ref={videoRef} playsInline autoPlay muted={isAdmin} controls={!isAdmin} style={{width:"100%",height:"100%",objectFit:"cover",display:(streamState==="broadcasting"||streamState==="connected")?"block":"none"}}/>
        {(streamState!=="broadcasting"&&streamState!=="connected")&&<div style={{padding:"40px 24px",textAlign:"center"}}><Radio size={36} color={COLORS.gold} style={{marginBottom:12}}/><div style={{color:COLORS.ink,fontFamily:"Lora,serif",fontSize:20,marginBottom:7}}>{streamState==="connecting"?"Connecting to Dunamis Live…":"Dunamis Live"}</div><div style={{color:COLORS.inkMuted,fontFamily:"Inter,sans-serif",fontSize:14,lineHeight:1.6}}>{streamError||"When the media team starts the broadcast, the service will play here automatically."}</div>{!isAdmin&&streamState==="error"&&<div style={{marginTop:12}}><PrimaryButton onClick={connectViewer}>Retry Connection</PrimaryButton></div>}</div>}
        {isLive&&<div style={{position:"absolute",left:12,top:12,background:"rgba(126,48,48,.9)",padding:"7px 10px",borderRadius:999,color:"#fff",fontFamily:"Inter,sans-serif",fontSize:11,fontWeight:800}}>● LIVE</div>}
      </div>
    </Card>

    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:12}}>
      <button onClick={()=>setTool("bible")} style={{minHeight:50,borderRadius:12,border:`1px solid ${tool==="bible"?COLORS.gold:COLORS.border}`,background:tool==="bible"?"rgba(201,162,75,.12)":COLORS.surface,color:COLORS.ink,fontWeight:700,cursor:"pointer"}}><BookOpen size={17} style={{verticalAlign:"middle",marginRight:6}}/>Bible</button>
      <button onClick={()=>setTool("notes")} style={{minHeight:50,borderRadius:12,border:`1px solid ${tool==="notes"?COLORS.gold:COLORS.border}`,background:tool==="notes"?"rgba(201,162,75,.12)":COLORS.surface,color:COLORS.ink,fontWeight:700,cursor:"pointer"}}><NotebookPen size={17} style={{verticalAlign:"middle",marginRight:6}}/>Notes</button>
      <button onClick={addAmen} style={{minHeight:50,borderRadius:12,border:`1px solid ${COLORS.border}`,background:COLORS.surface,color:COLORS.ink,fontWeight:700,cursor:"pointer"}}>🙏 Amen · <span style={{color:COLORS.goldSoft}}>{amenCount}</span></button>
    </div>

    {tool==="notes"&&<Card style={{marginTop:12}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}><strong style={{color:COLORS.ink,fontFamily:"Inter,sans-serif"}}>Service Notebook</strong><span style={{fontSize:11,color:COLORS.inkMuted}}>Saved on this device</span></div><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Write sermon points, scriptures, revelations and prayer notes…" style={{width:"100%",minHeight:150,boxSizing:"border-box",resize:"vertical",padding:13,borderRadius:10,border:`1px solid ${COLORS.border}`,background:COLORS.surfaceRaised,color:COLORS.ink,fontFamily:"Inter,sans-serif",fontSize:14,lineHeight:1.6}}/><div style={{display:"flex",justifyContent:"flex-end",marginTop:9}}><PrimaryButton onClick={saveNotes}><Save size={15}/>{notesSaved?"Saved":"Save Notes"}</PrimaryButton></div></Card>}
    {tool==="bible"&&<Card style={{marginTop:12}}><strong style={{color:COLORS.ink,fontFamily:"Inter,sans-serif"}}>Bible — Quick Access (KJV)</strong><div style={{display:"grid",gap:8,marginTop:10}}>{quickVerses.map(([ref,text])=><div key={ref} style={{padding:12,borderRadius:10,background:COLORS.surfaceRaised,border:`1px solid ${COLORS.border}`}}><div style={{color:COLORS.goldSoft,fontWeight:700,fontSize:12,marginBottom:5}}>{ref}</div><div style={{color:COLORS.ink,fontFamily:"Lora,serif",fontSize:14,lineHeight:1.55}}>{text}</div><button onClick={()=>{setNotes(n=>n+(n?"\n\n":"")+ref+" — "+text);setTool("notes")}} style={{marginTop:8,border:0,background:"transparent",color:COLORS.gold,cursor:"pointer",padding:0,fontWeight:700}}>+ Add to notes</button></div>)}</div><div style={{fontSize:12,color:COLORS.inkMuted,marginTop:10}}>Use the main Bible tab for the complete Bible reader.</div></Card>}

    <Card style={{marginTop:12}}><div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}><HandHeart size={19} color={COLORS.gold}/><strong style={{fontFamily:"Inter,sans-serif",color:COLORS.ink}}>Prayer during service</strong></div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><div style={{flex:"1 1 260px"}}><TextField value={prayer} onChange={setPrayer} placeholder="Type your prayer request…"/></div><PrimaryButton onClick={submitPrayer}><Send size={16}/>{prayerSent?"Sent":"Send"}</PrimaryButton></div></Card>

    {isAdmin&&<Card style={{marginTop:16,borderColor:"rgba(201,162,75,.45)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginBottom:14,flexWrap:"wrap"}}><div><div style={{fontFamily:"Inter,sans-serif",fontWeight:700,color:COLORS.ink}}>Dunamis Live Studio</div><div style={{fontFamily:"Inter,sans-serif",fontSize:12,color:COLORS.inkMuted,marginTop:3}}>Broadcast this phone or computer camera directly to members.</div></div><button onClick={isLive?endBroadcast:startBroadcast} disabled={streamState==="connecting"} style={{border:0,borderRadius:999,padding:"10px 16px",cursor:"pointer",fontWeight:800,background:isLive?"#7E3030":COLORS.gold,color:isLive?"#fff":"#1B1F2A",opacity:streamState==="connecting"?.65:1}}>{streamState==="connecting"?"Connecting…":isLive?"End Broadcast":"Start Broadcast"}</button></div>
      {isLive&&<div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}><GhostButton onClick={toggleMic}>{micOn?<Mic size={16}/>:<MicOff size={16}/>} {micOn?"Mic On":"Mic Off"}</GhostButton><GhostButton onClick={toggleCamera}>{cameraOn?<Video size={16}/>:<VideoOff size={16}/>} {cameraOn?"Camera On":"Camera Off"}</GhostButton><GhostButton onClick={switchCamera}><RotateCcw size={16}/>Switch Camera</GhostButton></div>}
      {streamError&&<div style={{padding:10,borderRadius:9,background:"rgba(239,83,80,.10)",color:"#EF9A9A",fontSize:12,marginBottom:10}}>{streamError}</div>}
      <div style={{padding:11,borderRadius:10,background:"rgba(201,162,75,.08)",border:`1px solid rgba(201,162,75,.22)`,color:COLORS.inkMuted,fontFamily:"Inter,sans-serif",fontSize:12,lineHeight:1.55,marginBottom:12}}><strong style={{color:COLORS.goldSoft}}>Real streaming:</strong> V6 connects the broadcaster and viewers through LiveKit WebRTC. Add your LiveKit server credentials to the included <b>.env</b> file before using it across different phones.</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}><div><div style={{fontSize:12,color:COLORS.inkMuted,marginBottom:6}}>Service title</div><TextField value={titleDraft} onChange={setTitleDraft}/></div><div><div style={{fontSize:12,color:COLORS.inkMuted,marginBottom:6}}>Next service</div><input type="datetime-local" value={nextDraft} onChange={e=>setNextDraft(e.target.value)} style={{width:"100%",boxSizing:"border-box",padding:"12px 13px",borderRadius:10,border:`1px solid ${COLORS.border}`,background:COLORS.surfaceRaised,color:COLORS.ink,fontSize:14}}/></div></div><div style={{display:"flex",justifyContent:"flex-end",marginTop:10}}><PrimaryButton onClick={saveSettings}>Save Service Settings</PrimaryButton></div>
    </Card>}
  </div>;
}
// ---------- SERMONS (with series/tags + offline download) ----------
function SermonsTab({ isAdmin }) {
  const { items: sermons, save, loading } = useSharedList("sermons");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "Sunday Service", series: "", preacher: "", url: "", audioUrl: "" });
  const [activeTag, setActiveTag] = useState("All");

  const types = ["Sunday Service", "Bible Study", "Youth Service", "Special Event", "Testimony Night"];

  const addSermon = async () => {
    if (!form.title.trim()) return;
    const next = [
      { id: Date.now(), ...form, date: new Date().toISOString().slice(0, 10) },
      ...sermons,
    ];
    await save(next);
    setForm({ title: "", type: "Sunday Service", series: "", preacher: "", url: "", audioUrl: "" });
    setShowForm(false);
  };

  const allSeries = ["All", ...Array.from(new Set(sermons.map((s) => s.series).filter(Boolean)))];
  const filtered = activeTag === "All" ? sermons : sermons.filter((s) => s.series === activeTag);

  return (
    <div style={{ padding: "0 20px 24px" }}>
      {isAdmin && (
        <div style={{ marginBottom: 16 }}>
          {!showForm ? (
            <PrimaryButton onClick={() => setShowForm(true)}><Plus size={16} /> Upload sermon</PrimaryButton>
          ) : (
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: COLORS.ink }}>New sermon</span>
                <X size={16} color={COLORS.inkMuted} style={{ cursor: "pointer" }} onClick={() => setShowForm(false)} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <TextField value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Sermon title" />
                <Select value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={types} />
                <TextField value={form.preacher} onChange={(v) => setForm({ ...form, preacher: v })} placeholder="Preacher name" />
                <TextField value={form.series} onChange={(v) => setForm({ ...form, series: v })} placeholder="Series / topic tag (e.g. Faith, Family)" />
                <TextField value={form.url} onChange={(v) => setForm({ ...form, url: v })} placeholder="Video link (YouTube etc.)" />
                <TextField value={form.audioUrl} onChange={(v) => setForm({ ...form, audioUrl: v })} placeholder="Downloadable audio/MP3 link (optional)" />
                <PrimaryButton onClick={addSermon}>Publish sermon</PrimaryButton>
              </div>
            </Card>
          )}
        </div>
      )}

      {allSeries.length > 1 && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14, paddingBottom: 2 }}>
          {allSeries.map((s) => (
            <Pill key={s} active={activeTag === s} onClick={() => setActiveTag(s)}>{s}</Pill>
          ))}
        </div>
      )}

      {loading ? (
        <EmptyState text="Loading sermons…" />
      ) : filtered.length === 0 ? (
        <EmptyState text="No sermons here yet." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((s) => (
            <Card key={s.id}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: COLORS.gold, fontWeight: 600 }}>{s.type}</span>
                {s.series && (
                  <span style={{ display: "flex", alignItems: "center", gap: 3, fontFamily: "Inter, sans-serif", fontSize: 11, color: COLORS.lavender }}>
                    <Tag size={10} /> {s.series}
                  </span>
                )}
              </div>
              <div style={{ fontFamily: "Lora, serif", fontSize: 17, color: COLORS.ink, marginTop: 4 }}>{s.title}</div>
              {s.preacher && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: COLORS.inkMuted, marginTop: 2 }}>{s.preacher}</div>}
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.inkMuted, marginTop: 6 }}>{s.date}</div>
              <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                {s.url && (
                  <a href={s.url} target="_blank" rel="noreferrer" style={{ color: COLORS.lavender, fontFamily: "Inter, sans-serif", fontSize: 13, textDecoration: "none" }}>
                    Watch →
                  </a>
                )}
                {s.audioUrl && (
                  <a href={s.audioUrl} target="_blank" rel="noreferrer" download style={{ display: "flex", alignItems: "center", gap: 4, color: COLORS.goldSoft, fontFamily: "Inter, sans-serif", fontSize: 13, textDecoration: "none" }}>
                    <Download size={13} /> Download audio
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- BIBLE ----------
function BibleTab() {
  const [query, setQuery] = useState("John 3:16");
  const [version, setVersion] = useState("kjv");
  const [verse, setVerse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fromCache, setFromCache] = useState(false);

  const fetchVerse = useCallback(async (ref, ver) => {
    const versionMeta = BIBLE_VERSIONS.find((v) => v.code === ver);
    if (versionMeta && !versionMeta.available) {
      setVerse(null);
      setError(`${versionMeta.label} isn't connected yet — it needs a licensed Bible API key from the publisher. KJV works now.`);
      return;
    }
    setLoading(true); setError(null); setFromCache(false);
    const cacheKey = `bible-cache:${ref}:${ver}`;
    try {
      const res = await fetch(`https://bible-api.com/${encodeURIComponent(ref)}?translation=${ver}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setVerse(data);
      try { await window.storage.set(cacheKey, JSON.stringify(data), false); } catch (e) {}
    } catch (e) {
      try {
        const cached = await window.storage.get(cacheKey, false);
        if (cached) { setVerse(JSON.parse(cached.value)); setFromCache(true); }
        else { setError("Couldn't find that reference, and it isn't saved for offline reading yet."); setVerse(null); }
      } catch (e2) {
        setError("Couldn't find that reference, and it isn't saved for offline reading yet.");
        setVerse(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVerse(query, version); }, []); // eslint-disable-line

  return (
    <div style={{ padding: "0 20px 24px" }}>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 12, paddingBottom: 2 }}>
        {BIBLE_VERSIONS.map((v) => (
          <Pill key={v.code} active={version === v.code} onClick={() => { setVersion(v.code); fetchVerse(query, v.code); }}>
            {v.label}{!v.available ? " 🔒" : ""}
          </Pill>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <TextField value={query} onChange={setQuery} placeholder="e.g. John 3:16, Psalm 23" />
        <PrimaryButton onClick={() => fetchVerse(query, version)} style={{ flexShrink: 0 }}>Go</PrimaryButton>
      </div>
      <Card style={{ minHeight: 140 }}>
        {loading ? (
          <div style={{ color: COLORS.inkMuted, fontFamily: "Inter, sans-serif", fontSize: 14 }}>Loading…</div>
        ) : error ? (
          <div style={{ color: COLORS.inkMuted, fontFamily: "Inter, sans-serif", fontSize: 14 }}>{error}</div>
        ) : verse ? (
          <div>
            {fromCache && (
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: COLORS.lavender, marginBottom: 8, fontWeight: 600 }}>SAVED OFFLINE COPY</div>
            )}
            <div style={{ fontFamily: "Lora, serif", fontStyle: "italic", fontSize: 18, lineHeight: 1.7, color: COLORS.ink }}>{verse.text?.trim()}</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: COLORS.gold, marginTop: 12, fontWeight: 600 }}>{verse.reference} · {BIBLE_VERSIONS.find((v) => v.code === version)?.label}</div>
          </div>
        ) : null}
      </Card>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.inkMuted, marginTop: 10, lineHeight: 1.6 }}>
        Every passage you open is saved to this device, so you can reread it later without data. For guaranteed offline reading before you even have a connection, see Offline Readings under More.
      </div>
    </div>
  );
}

// ---------- WHOLE-BIBLE DOWNLOADER + READER ----------
function useDownloadedCount() {
  const [count, setCount] = useState(0);
  const [checked, setChecked] = useState(false);
  const refresh = useCallback(async () => {
    try {
      const r = await window.storage.list("bible-full:", false);
      setCount((r?.keys || []).length);
    } catch (e) {}
    setChecked(true);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { count, checked, refresh };
}

function WholeBibleReader() {
  const { count, checked, refresh } = useDownloadedCount();
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cancelFlag, setCancelFlag] = useState(false);

  const [bookIdx, setBookIdx] = useState(0);
  const [chapter, setChapter] = useState(1);
  const [chapterData, setChapterData] = useState(null);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [chapterMissing, setChapterMissing] = useState(false);

  const loadChapter = useCallback(async (bIdx, ch) => {
    setChapterLoading(true); setChapterMissing(false); setChapterData(null);
    try {
      const cached = await window.storage.get(chapterKey(bIdx, ch), false);
      if (cached) { setChapterData(JSON.parse(cached.value)); setChapterLoading(false); return; }
    } catch (e) {}
    setChapterMissing(true);
    setChapterLoading(false);
  }, []);

  useEffect(() => { loadChapter(bookIdx, chapter); }, [bookIdx, chapter, loadChapter]);

  const fetchSingleChapter = async () => {
    setChapterLoading(true);
    const book = BIBLE_BOOKS[bookIdx];
    try {
      const res = await fetch(`https://bible-api.com/${encodeURIComponent(book.name)}+${chapter}?translation=kjv`);
      if (!res.ok) throw new Error("fail");
      const data = await res.json();
      await window.storage.set(chapterKey(bookIdx, chapter), JSON.stringify(data), false);
      setChapterData(data);
      setChapterMissing(false);
      refresh();
    } catch (e) {
      setChapterMissing(true);
    }
    setChapterLoading(false);
  };

  const startDownload = async () => {
    setDownloading(true); setCancelFlag(false); setProgress(0);
    const tasks = [];
    BIBLE_BOOKS.forEach((book, bIdx) => {
      for (let ch = 1; ch <= book.chapters; ch++) tasks.push({ bIdx, ch, book });
    });

    let done = 0;
    let idx = 0;
    const CONCURRENCY = 5;

    const worker = async () => {
      while (idx < tasks.length) {
        if (cancelFlag) return;
        const myIdx = idx++;
        const t = tasks[myIdx];
        const key = chapterKey(t.bIdx, t.ch);
        try {
          const already = await window.storage.get(key, false);
          if (!already) {
            const res = await fetch(`https://bible-api.com/${encodeURIComponent(t.book.name)}+${t.ch}?translation=kjv`);
            if (res.ok) {
              const data = await res.json();
              await window.storage.set(key, JSON.stringify(data), false);
            }
          }
        } catch (e) {}
        done++;
        setProgress(done);
      }
    };

    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    setDownloading(false);
    refresh();
    loadChapter(bookIdx, chapter);
  };

  const goToChapter = (bIdx, ch) => { setBookIdx(bIdx); setChapter(ch); };

  const nextChapter = () => {
    const book = BIBLE_BOOKS[bookIdx];
    if (chapter < book.chapters) goToChapter(bookIdx, chapter + 1);
    else if (bookIdx < BIBLE_BOOKS.length - 1) goToChapter(bookIdx + 1, 1);
  };
  const prevChapter = () => {
    if (chapter > 1) goToChapter(bookIdx, chapter - 1);
    else if (bookIdx > 0) goToChapter(bookIdx - 1, BIBLE_BOOKS[bookIdx - 1].chapters);
  };

  const isComplete = checked && count >= TOTAL_CHAPTERS;
  const pct = Math.round((Math.max(count, progress) / TOTAL_CHAPTERS) * 100);

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: COLORS.ink, marginBottom: 6 }}>
          Whole Bible (KJV) — Genesis 1 to Revelation 22
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: COLORS.inkMuted, marginBottom: 12 }}>
          {checked ? (isComplete ? "Fully downloaded — readable with no connection." : `${count} of ${TOTAL_CHAPTERS} chapters saved on this device.`) : "Checking what's already saved…"}
        </div>
        <div style={{ height: 6, borderRadius: 999, background: COLORS.surfaceRaised, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ height: "100%", width: `${downloading ? pct : Math.round((count / TOTAL_CHAPTERS) * 100)}%`, background: COLORS.gold, transition: "width 0.3s" }} />
        </div>
        {!isComplete && (
          downloading ? (
            <GhostButton onClick={() => setCancelFlag(true)}>Stop downloading ({progress}/{TOTAL_CHAPTERS})</GhostButton>
          ) : (
            <PrimaryButton onClick={startDownload}><Download size={14} /> Download whole Bible for offline</PrimaryButton>
          )
        )}
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: COLORS.inkMuted, marginTop: 10, lineHeight: 1.5 }}>
          Needs a connection once, while downloading. After that, every chapter opens with no data.
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <select value={bookIdx} onChange={(e) => goToChapter(Number(e.target.value), 1)}
            style={{ flex: 1, background: COLORS.surfaceRaised, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 8px", color: COLORS.ink, fontFamily: "Inter, sans-serif", fontSize: 13 }}>
            {BIBLE_BOOKS.map((b, i) => <option key={b.name} value={i}>{b.name}</option>)}
          </select>
          <select value={chapter} onChange={(e) => goToChapter(bookIdx, Number(e.target.value))}
            style={{ width: 84, background: COLORS.surfaceRaised, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 8px", color: COLORS.ink, fontFamily: "Inter, sans-serif", fontSize: 13 }}>
            {Array.from({ length: BIBLE_BOOKS[bookIdx].chapters }, (_, i) => i + 1).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ minHeight: 160 }}>
          {chapterLoading ? (
            <div style={{ color: COLORS.inkMuted, fontFamily: "Inter, sans-serif", fontSize: 14 }}>Loading…</div>
          ) : chapterMissing ? (
            <div>
              <div style={{ color: COLORS.inkMuted, fontFamily: "Inter, sans-serif", fontSize: 13.5, marginBottom: 10 }}>
                {BIBLE_BOOKS[bookIdx].name} {chapter} isn't saved on this device yet.
              </div>
              <GhostButton onClick={fetchSingleChapter}>Fetch this chapter now</GhostButton>
            </div>
          ) : chapterData ? (
            <div>
              <div style={{ fontFamily: "Lora, serif", fontSize: 18, fontWeight: 600, color: COLORS.gold, marginBottom: 10 }}>
                {BIBLE_BOOKS[bookIdx].name} {chapter}
              </div>
              {(chapterData.verses || []).map((v) => (
                <div key={v.verse} style={{ fontFamily: "Lora, serif", fontSize: 15.5, lineHeight: 1.8, color: COLORS.ink, marginBottom: 4 }}>
                  <span style={{ color: COLORS.lavender, fontFamily: "Inter, sans-serif", fontSize: 11, marginRight: 6 }}>{v.verse}</span>
                  {v.text?.trim()}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <GhostButton onClick={prevChapter} style={{ padding: "8px 14px", fontSize: 13 }}>← Previous</GhostButton>
          <GhostButton onClick={nextChapter} style={{ padding: "8px 14px", fontSize: 13 }}>Next →</GhostButton>
        </div>
      </Card>
    </div>
  );
}

// ---------- OFFLINE READINGS ----------
function OfflineTab() {
  const [savedRefs, setSavedRefs] = useState([]);
  const [openIdx, setOpenIdx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullBible, setShowFullBible] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.list("bible-cache:", false);
        const keys = r?.keys || [];
        const loaded = [];
        for (const k of keys) {
          try {
            const item = await window.storage.get(k, false);
            if (item) loaded.push(JSON.parse(item.value));
          } catch (e) {}
        }
        setSavedRefs(loaded);
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  return (
    <div style={{ padding: "0 20px 24px" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Pill active={showFullBible} onClick={() => setShowFullBible(true)}>Whole Bible</Pill>
        <Pill active={!showFullBible} onClick={() => setShowFullBible(false)}>Quick Verses</Pill>
      </div>

      {showFullBible ? (
        <WholeBibleReader />
      ) : (
        <>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: COLORS.gold, fontWeight: 600, letterSpacing: 0.4, marginBottom: 10 }}>
            ALWAYS AVAILABLE, NO DATA NEEDED
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {OFFLINE_VERSES.map((v, i) => (
              <Card key={v.ref} style={{ cursor: "pointer" }}>
                <div onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: COLORS.gold, fontWeight: 600 }}>{v.ref}</div>
                  {openIdx === i && (
                    <div style={{ fontFamily: "Lora, serif", fontStyle: "italic", fontSize: 15, lineHeight: 1.6, color: COLORS.ink, marginTop: 8 }}>{v.text}</div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {savedRefs.length > 0 && (
            <>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: COLORS.inkMuted, fontWeight: 600, letterSpacing: 0.4, marginBottom: 10 }}>
                PASSAGES YOU'VE OPENED BEFORE
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {savedRefs.map((s, i) => (
                  <Card key={i}>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: COLORS.lavender, fontWeight: 600 }}>{s.reference}</div>
                    <div style={{ fontFamily: "Lora, serif", fontStyle: "italic", fontSize: 14, lineHeight: 1.6, color: COLORS.ink, marginTop: 6 }}>{s.text?.trim()}</div>
                  </Card>
                ))}
              </div>
            </>
          )}
          {loading && <EmptyState text="Loading your saved passages…" />}
        </>
      )}
    </div>
  );
}

// ---------- NOTES ----------
function NotesTab() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("sermon-notes", false);
        if (r) setNote(r.value);
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (loading) return;
    setSaved(false);
    const t = setTimeout(async () => {
      try { await window.storage.set("sermon-notes", note, false); setSaved(true); } catch (e) {}
    }, 600);
    return () => clearTimeout(t);
  }, [note, loading]);

  return (
    <div style={{ padding: "0 20px 24px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: saved ? COLORS.inkMuted : COLORS.gold }}>{saved ? "Saved" : "Saving…"}</span>
      </div>
      <Card>
        <TextField value={note} onChange={setNote} placeholder="Write what's speaking to you during the sermon…" multiline rows={16} />
      </Card>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.inkMuted, marginTop: 10 }}>Your notes are private to this device.</div>
    </div>
  );
}

// ---------- TESTIMONIES ----------
function TestimoniesTab() {
  const { items: testimonies, save, loading } = useSharedList("testimonies");
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const post = async () => {
    if (!text.trim()) return;
    const next = [{ id: Date.now(), name: name.trim() || "Anonymous", text: text.trim(), date: new Date().toISOString().slice(0, 10) }, ...testimonies];
    await save(next);
    setText("");
  };

  return (
    <div style={{ padding: "0 20px 24px" }}>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: COLORS.ink, marginBottom: 10 }}>Share your testimony</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <TextField value={name} onChange={setName} placeholder="Your name (optional)" />
          <TextField value={text} onChange={setText} placeholder="What has God done for you?" multiline rows={3} />
          <PrimaryButton onClick={post}><Send size={14} /> Post to the wall</PrimaryButton>
        </div>
      </Card>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: COLORS.inkMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.6 }}>Visible to all members</div>
      {loading ? (
        <EmptyState text="Loading testimonies…" />
      ) : testimonies.length === 0 ? (
        <EmptyState text="No testimonies shared yet. Be the first." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {testimonies.map((t) => (
            <Card key={t.id}>
              <div style={{ fontFamily: "Lora, serif", fontStyle: "italic", fontSize: 15, lineHeight: 1.6, color: COLORS.ink }}>"{t.text}"</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.gold, marginTop: 10, fontWeight: 600 }}>
                — {t.name} <span style={{ color: COLORS.inkMuted, fontWeight: 400 }}>· {t.date}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- PRAYER WALL ----------
function PrayerTab() {
  const { items: requests, save, loading } = useSharedList("prayer-requests");
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const post = async () => {
    if (!text.trim()) return;
    const next = [{ id: Date.now(), name: name.trim() || "Anonymous", text: text.trim(), date: new Date().toISOString().slice(0, 10), prayers: 0, answered: false }, ...requests];
    await save(next);
    setText("");
  };

  const pray = async (id) => {
    await save(requests.map((r) => (r.id === id ? { ...r, prayers: r.prayers + 1 } : r)));
  };

  const markAnswered = async (id) => {
    await save(requests.map((r) => (r.id === id ? { ...r, answered: !r.answered } : r)));
  };

  return (
    <div style={{ padding: "0 20px 24px" }}>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: COLORS.ink, marginBottom: 10 }}>Ask for prayer</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <TextField value={name} onChange={setName} placeholder="Your name (optional)" />
          <TextField value={text} onChange={setText} placeholder="What would you like the church to pray for?" multiline rows={3} />
          <PrimaryButton onClick={post}><HandHeart size={14} /> Post request</PrimaryButton>
        </div>
      </Card>
      {loading ? (
        <EmptyState text="Loading prayer requests…" />
      ) : requests.length === 0 ? (
        <EmptyState text="No prayer requests yet." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {requests.map((r) => (
            <Card key={r.id} style={{ opacity: r.answered ? 0.6 : 1 }}>
              {r.answered && <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: COLORS.gold, fontWeight: 600, marginBottom: 6 }}>ANSWERED</div>}
              <div style={{ fontFamily: "Lora, serif", fontSize: 15, lineHeight: 1.6, color: COLORS.ink }}>{r.text}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.inkMuted, marginTop: 8 }}>— {r.name} · {r.date}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <GhostButton onClick={() => pray(r.id)} style={{ padding: "7px 12px", fontSize: 12.5 }}>
                  <HandHeart size={13} /> I'm praying ({r.prayers})
                </GhostButton>
                <GhostButton onClick={() => markAnswered(r.id)} style={{ padding: "7px 12px", fontSize: 12.5 }}>
                  {r.answered ? "Reopen" : "Mark answered"}
                </GhostButton>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- EVENTS ----------
function EventsTab({ isAdmin }) {
  const { items: events, save, loading } = useSharedList("events");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", time: "", location: "" });

  const addEvent = async () => {
    if (!form.title.trim() || !form.date) return;
    const next = [...events, { id: Date.now(), ...form }].sort((a, b) => a.date.localeCompare(b.date));
    await save(next);
    setForm({ title: "", date: "", time: "", location: "" });
    setShowForm(false);
  };

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.date >= today);

  return (
    <div style={{ padding: "0 20px 24px" }}>
      {isAdmin && (
        <div style={{ marginBottom: 16 }}>
          {!showForm ? (
            <PrimaryButton onClick={() => setShowForm(true)}><Plus size={16} /> Add event</PrimaryButton>
          ) : (
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: COLORS.ink }}>New event</span>
                <X size={16} color={COLORS.inkMuted} style={{ cursor: "pointer" }} onClick={() => setShowForm(false)} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <TextField value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="Event name" />
                <TextField type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} placeholder="Date" />
                <TextField value={form.time} onChange={(v) => setForm({ ...form, time: v })} placeholder="Time (e.g. 9:00 AM)" />
                <TextField value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="Location" />
                <PrimaryButton onClick={addEvent}>Add to calendar</PrimaryButton>
              </div>
            </Card>
          )}
        </div>
      )}
      {loading ? (
        <EmptyState text="Loading events…" />
      ) : upcoming.length === 0 ? (
        <EmptyState text="No upcoming events." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {upcoming.map((e) => (
            <Card key={e.id} style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ textAlign: "center", background: COLORS.surfaceRaised, borderRadius: 10, padding: "8px 12px", minWidth: 56 }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: COLORS.gold, fontWeight: 700 }}>
                  {new Date(e.date + "T00:00:00").toLocaleString("en", { month: "short" }).toUpperCase()}
                </div>
                <div style={{ fontFamily: "Lora, serif", fontSize: 18, color: COLORS.ink }}>
                  {new Date(e.date + "T00:00:00").getDate()}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "Lora, serif", fontSize: 16, color: COLORS.ink }}>{e.title}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: COLORS.inkMuted, marginTop: 3 }}>
                  {[e.time, e.location].filter(Boolean).join(" · ")}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- GIVING ----------
function GivingTab() {
  const [method, setMethod] = useState("Mobile Money");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div style={{ padding: "0 20px 24px" }}>
      <Card style={{ marginBottom: 16, background: `linear-gradient(135deg, ${COLORS.surfaceRaised}, ${COLORS.surface})` }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: COLORS.gold, fontWeight: 600, letterSpacing: 0.4 }}>GIVE</div>
        <div style={{ fontFamily: "Lora, serif", fontSize: 20, color: COLORS.ink, marginTop: 6, lineHeight: 1.5 }}>
          "Each of you should give what you have decided in your heart to give." — 2 Corinthians 9:7
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["Mobile Money", "Card"].map((m) => (
            <Pill key={m} active={method === m} onClick={() => setMethod(m)}>{m}</Pill>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <TextField value={amount} onChange={setAmount} placeholder="Amount (UGX)" type="number" />
          {method === "Mobile Money" ? (
            <TextField value={phone} onChange={setPhone} placeholder="MTN or Airtel number" />
          ) : (
            <TextField value={phone} onChange={setPhone} placeholder="Card number" />
          )}
          <PrimaryButton disabled style={{ marginTop: 4 }}><Wallet size={14} /> Give {amount ? `UGX ${amount}` : ""}</PrimaryButton>
        </div>
      </Card>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.inkMuted, marginTop: 14, lineHeight: 1.6 }}>
        This screen is a demo — the button is disabled because taking real payments requires connecting a licensed payment provider (e.g. Flutterwave, Pesapal, or direct MTN/Airtel mobile money APIs). That's a short integration step once you're ready to go live, and it needs your church's bank details and provider account.
      </div>
    </div>
  );
}

// ---------- GROUPS ----------
function GroupsTab({ isAdmin }) {
  const { items: groups, save, loading } = useSharedList("small-groups");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", leader: "", meets: "", location: "" });

  const addGroup = async () => {
    if (!form.name.trim()) return;
    await save([...groups, { id: Date.now(), ...form }]);
    setForm({ name: "", leader: "", meets: "", location: "" });
    setShowForm(false);
  };

  return (
    <div style={{ padding: "0 20px 24px" }}>
      {isAdmin && (
        <div style={{ marginBottom: 16 }}>
          {!showForm ? (
            <PrimaryButton onClick={() => setShowForm(true)}><Plus size={16} /> Add group</PrimaryButton>
          ) : (
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: COLORS.ink }}>New small group</span>
                <X size={16} color={COLORS.inkMuted} style={{ cursor: "pointer" }} onClick={() => setShowForm(false)} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <TextField value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Group name (e.g. Youth Cell, Nakawa Fellowship)" />
                <TextField value={form.leader} onChange={(v) => setForm({ ...form, leader: v })} placeholder="Leader's name" />
                <TextField value={form.meets} onChange={(v) => setForm({ ...form, meets: v })} placeholder="Meets (e.g. Wednesdays 6pm)" />
                <TextField value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="Location" />
                <PrimaryButton onClick={addGroup}>Add group</PrimaryButton>
              </div>
            </Card>
          )}
        </div>
      )}
      {loading ? (
        <EmptyState text="Loading groups…" />
      ) : groups.length === 0 ? (
        <EmptyState text="No small groups listed yet." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {groups.map((g) => (
            <Card key={g.id}>
              <div style={{ fontFamily: "Lora, serif", fontSize: 16, color: COLORS.ink }}>{g.name}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: COLORS.inkMuted, marginTop: 4, lineHeight: 1.6 }}>
                {g.leader && <>Led by {g.leader}<br /></>}
                {[g.meets, g.location].filter(Boolean).join(" · ")}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- NOTIFICATIONS ----------
function NotificationsTab({ isAdmin }) {
  const { items: notifications, save, loading } = useSharedList("notifications");
  const [text, setText] = useState("");

  const post = async () => {
    if (!text.trim()) return;
    await save([{ id: Date.now(), text: text.trim(), date: new Date().toISOString().slice(0, 10) }, ...notifications]);
    setText("");
  };

  return (
    <div style={{ padding: "0 20px 24px" }}>
      {isAdmin && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: COLORS.ink, marginBottom: 10 }}>Send a notification</div>
          <div style={{ display: "flex", gap: 8 }}>
            <TextField value={text} onChange={setText} placeholder="e.g. Service starts at 9am tomorrow" />
            <PrimaryButton onClick={post} style={{ flexShrink: 0 }}>Send</PrimaryButton>
          </div>
        </Card>
      )}
      {loading ? (
        <EmptyState text="Loading…" />
      ) : notifications.length === 0 ? (
        <EmptyState text="No notifications yet." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifications.map((n) => (
            <Card key={n.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: 14 }}>
              <Bell size={16} color={COLORS.gold} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: COLORS.ink }}>{n.text}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: COLORS.inkMuted, marginTop: 3 }}>{n.date}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.inkMuted, marginTop: 14, lineHeight: 1.6 }}>
        This is an in-app feed. Push notifications that reach members outside the app need the native build.
      </div>
    </div>
  );
}

// ---------- ADMIN DASHBOARD ----------
function AdminDashboard({ goTo }) {
  const { items: notifications, save: saveNotifications } = useSharedList("notifications");
  const { items: sermons } = useSharedList("sermons");
  const { items: events } = useSharedList("events");
  const { items: prayers, save: savePrayers } = useSharedList("prayer-requests");
  const { items: testimonies, save: saveTestimonies } = useSharedList("testimonies");
  const [text, setText] = useState("");
  const [justSent, setJustSent] = useState(false);
  const [verse, setVerse] = useState({ text: "For with God nothing shall be impossible.", ref: "LUKE 1:37" });
  const [savedVerse, setSavedVerse] = useState(false);

  useEffect(() => {
    (async () => {
      try { const r = await window.storage.get("verse-of-day", true); if (r) setVerse(JSON.parse(r.value)); } catch (e) {}
    })();
  }, []);

  const post = async () => {
    if (!text.trim()) return;
    await saveNotifications([{ id: Date.now(), text: text.trim(), date: new Date().toISOString().slice(0, 10) }, ...notifications]);
    setText(""); setJustSent(true); setTimeout(() => setJustSent(false), 2000);
  };
  const saveVerse = async () => {
    await window.storage.set("verse-of-day", JSON.stringify(verse), true);
    setSavedVerse(true); setTimeout(() => setSavedVerse(false), 2000);
  };
  const removePrayer = (id) => savePrayers(prayers.filter(x => x.id !== id));
  const removeTestimony = (id) => saveTestimonies(testimonies.filter(x => x.id !== id));

  const stats = [
    ["Sermons", sermons.length, Play], ["Events", events.length, Calendar],
    ["Prayer requests", prayers.length, HandHeart], ["Testimonies", testimonies.length, Heart]
  ];
  const links = [
    { id: "sermons", label: "Manage sermons", icon: Play }, { id: "live", label: "Set live stream", icon: Radio },
    { id: "events", label: "Manage events", icon: Calendar }, { id: "groups", label: "Manage small groups", icon: Users },
  ];

  return <div style={{ padding: "0 20px 30px" }}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:18}}>
      {stats.map(([label,count,Icon])=><Card key={label} style={{padding:14}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><Icon size={18} color={COLORS.gold}/><b style={{fontFamily:"Lora,serif",fontSize:24,color:COLORS.ink}}>{count}</b></div><div style={{fontFamily:"Inter,sans-serif",fontSize:11.5,color:COLORS.inkMuted,marginTop:7}}>{label}</div></Card>)}
    </div>

    <Card style={{ marginBottom: 14, border: `1px solid ${COLORS.gold}` }}>
      <div style={{fontFamily:"Inter,sans-serif",fontWeight:700,color:COLORS.ink,marginBottom:5}}>Church announcement</div>
      <div style={{fontFamily:"Inter,sans-serif",fontSize:12,color:COLORS.inkMuted,marginBottom:10}}>Post an announcement to the members' Alerts feed.</div>
      <TextField value={text} onChange={setText} placeholder="Type an announcement..." multiline rows={3}/>
      <PrimaryButton onClick={post} disabled={!text.trim()} style={{marginTop:8,width:"100%"}}><Send size={14}/>{justSent?"Sent ✓":"Publish announcement"}</PrimaryButton>
    </Card>

    <Card style={{marginBottom:14}}>
      <div style={{fontFamily:"Inter,sans-serif",fontWeight:700,color:COLORS.ink,marginBottom:10}}>Verse of the day</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}><TextField value={verse.text} onChange={v=>setVerse({...verse,text:v})} placeholder="Verse text" multiline rows={3}/><TextField value={verse.ref} onChange={v=>setVerse({...verse,ref:v})} placeholder="Reference e.g. LUKE 1:37"/><PrimaryButton onClick={saveVerse}>{savedVerse?"Saved ✓":"Save verse"}</PrimaryButton></div>
    </Card>

    <div style={{fontFamily:"Inter,sans-serif",fontSize:11,color:COLORS.inkMuted,fontWeight:700,letterSpacing:.7,margin:"18px 0 9px"}}>CONTENT MANAGEMENT</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>{links.map(l=>{const Icon=l.icon;return <div key={l.id} onClick={()=>goTo(l.id)} style={{background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:14,cursor:"pointer",display:"flex",gap:9,alignItems:"center"}}><Icon size={16} color={COLORS.gold}/><span style={{fontFamily:"Inter,sans-serif",fontSize:12.5,color:COLORS.ink}}>{l.label}</span></div>})}</div>

    <div style={{fontFamily:"Inter,sans-serif",fontSize:11,color:COLORS.inkMuted,fontWeight:700,letterSpacing:.7,margin:"20px 0 9px"}}>PRAYER REQUESTS</div>
    {prayers.length===0?<EmptyState text="No prayer requests yet."/>:prayers.slice(0,6).map(x=><Card key={x.id} style={{padding:13,marginBottom:7,display:"flex",gap:10,justifyContent:"space-between"}}><div style={{fontFamily:"Inter,sans-serif",fontSize:12.5,color:COLORS.ink,lineHeight:1.5}}>{x.text||x.request||"Prayer request"}</div><X size={15} color={COLORS.inkMuted} style={{cursor:"pointer",flexShrink:0}} onClick={()=>removePrayer(x.id)}/></Card>)}

    <div style={{fontFamily:"Inter,sans-serif",fontSize:11,color:COLORS.inkMuted,fontWeight:700,letterSpacing:.7,margin:"20px 0 9px"}}>TESTIMONIES</div>
    {testimonies.length===0?<EmptyState text="No testimonies yet."/>:testimonies.slice(0,6).map(x=><Card key={x.id} style={{padding:13,marginBottom:7,display:"flex",gap:10,justifyContent:"space-between"}}><div style={{fontFamily:"Inter,sans-serif",fontSize:12.5,color:COLORS.ink,lineHeight:1.5}}>{x.text||x.testimony||"Testimony"}</div><X size={15} color={COLORS.inkMuted} style={{cursor:"pointer",flexShrink:0}} onClick={()=>removeTestimony(x.id)}/></Card>)}

    <div style={{fontFamily:"Inter,sans-serif",fontSize:11.5,color:COLORS.inkMuted,marginTop:18,lineHeight:1.6}}>V3 saves your content on this PC/browser. A cloud database and secure staff accounts will be the next step before public launch.</div>
  </div>;
}

// ---------- FINANCE (BUSINESS MANAGER) ----------
function FinanceDashboard() {
  const { items: giving, save: saveGiving, loading: loadingGiving } = useSharedList("finance-giving");
  const { items: expenses, save: saveExpenses, loading: loadingExpenses } = useSharedList("finance-expenses");
  const [tab, setTab] = useState("give");
  const [giveForm, setGiveForm] = useState({ source: "", amount: "", method: "Mobile Money" });
  const [expenseForm, setExpenseForm] = useState({ item: "", amount: "", category: "General" });

  const totalGiving = giving.reduce((s, g) => s + (Number(g.amount) || 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const balance = totalGiving - totalExpenses;

  const recordGiving = async () => {
    if (!giveForm.amount) return;
    const next = [{ id: Date.now(), ...giveForm, date: new Date().toISOString().slice(0, 10) }, ...giving];
    await saveGiving(next);
    setGiveForm({ source: "", amount: "", method: "Mobile Money" });
  };

  const recordExpense = async () => {
    if (!expenseForm.amount) return;
    const next = [{ id: Date.now(), ...expenseForm, date: new Date().toISOString().slice(0, 10) }, ...expenses];
    await saveExpenses(next);
    setExpenseForm({ item: "", amount: "", category: "General" });
  };

  const categories = ["General", "Utilities", "Maintenance", "Salaries", "Outreach", "Events"];

  return (
    <div style={{ padding: "0 20px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        <Card style={{ padding: 12, textAlign: "center" }}>
          <TrendingUp size={14} color={COLORS.gold} />
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: COLORS.inkMuted, marginTop: 4 }}>Giving</div>
          <div style={{ fontFamily: "Lora, serif", fontSize: 15, color: COLORS.ink, marginTop: 2 }}>{totalGiving.toLocaleString()}</div>
        </Card>
        <Card style={{ padding: 12, textAlign: "center" }}>
          <TrendingDown size={14} color={COLORS.lavender} />
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: COLORS.inkMuted, marginTop: 4 }}>Expenses</div>
          <div style={{ fontFamily: "Lora, serif", fontSize: 15, color: COLORS.ink, marginTop: 2 }}>{totalExpenses.toLocaleString()}</div>
        </Card>
        <Card style={{ padding: 12, textAlign: "center" }}>
          <Landmark size={14} color={COLORS.goldSoft} />
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, color: COLORS.inkMuted, marginTop: 4 }}>Balance</div>
          <div style={{ fontFamily: "Lora, serif", fontSize: 15, color: COLORS.ink, marginTop: 2 }}>{balance.toLocaleString()}</div>
        </Card>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Pill active={tab === "give"} onClick={() => setTab("give")}>Giving</Pill>
        <Pill active={tab === "expense"} onClick={() => setTab("expense")}>Expenses</Pill>
      </div>

      {tab === "give" ? (
        <>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: COLORS.ink, marginBottom: 10 }}>Record giving</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <TextField value={giveForm.source} onChange={(v) => setGiveForm({ ...giveForm, source: v })} placeholder="Giver's name (optional)" />
              <TextField value={giveForm.amount} onChange={(v) => setGiveForm({ ...giveForm, amount: v })} placeholder="Amount (UGX)" type="number" />
              <Select value={giveForm.method} onChange={(v) => setGiveForm({ ...giveForm, method: v })} options={["Mobile Money", "Card", "Cash", "Bank Transfer"]} />
              <PrimaryButton onClick={recordGiving}><Plus size={14} /> Record</PrimaryButton>
            </div>
          </Card>
          {loadingGiving ? <EmptyState text="Loading…" /> : giving.length === 0 ? <EmptyState text="No giving recorded yet." /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {giving.slice(0, 12).map((g) => (
                <Card key={g.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: COLORS.ink }}>{g.source || "Anonymous"}</div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: COLORS.inkMuted, marginTop: 2 }}>{g.method} · {g.date}</div>
                  </div>
                  <div style={{ fontFamily: "Lora, serif", fontSize: 15, color: COLORS.gold }}>{Number(g.amount).toLocaleString()}</div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: COLORS.ink, marginBottom: 10 }}>Record expense</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <TextField value={expenseForm.item} onChange={(v) => setExpenseForm({ ...expenseForm, item: v })} placeholder="What was it for?" />
              <TextField value={expenseForm.amount} onChange={(v) => setExpenseForm({ ...expenseForm, amount: v })} placeholder="Amount (UGX)" type="number" />
              <Select value={expenseForm.category} onChange={(v) => setExpenseForm({ ...expenseForm, category: v })} options={categories} />
              <PrimaryButton onClick={recordExpense}><Plus size={14} /> Record</PrimaryButton>
            </div>
          </Card>
          {loadingExpenses ? <EmptyState text="Loading…" /> : expenses.length === 0 ? <EmptyState text="No expenses recorded yet." /> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {expenses.slice(0, 12).map((e) => (
                <Card key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14 }}>
                  <div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: COLORS.ink, display: "flex", alignItems: "center", gap: 6 }}>
                      <Receipt size={12} color={COLORS.inkMuted} /> {e.item}
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: COLORS.inkMuted, marginTop: 2 }}>{e.category} · {e.date}</div>
                  </div>
                  <div style={{ fontFamily: "Lora, serif", fontSize: 15, color: COLORS.lavender }}>-{Number(e.amount).toLocaleString()}</div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.inkMuted, marginTop: 16, lineHeight: 1.6 }}>
        These are manual records for church bookkeeping — they don't move real money. Once online giving is connected to a payment provider, successful payments can be logged here automatically.
      </div>
    </div>
  );
}

// ---------- LANGUAGE ----------
function LanguageTab({ lang, setLang }) {
  return (
    <div style={{ padding: "0 20px 24px" }}>
      <Card>
        <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: COLORS.ink, marginBottom: 12 }}>
          Choose app language
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {LANGUAGE_OPTIONS.map((l) => (
            <div key={l.code} onClick={() => setLang(l.code)} style={{
              padding: "12px 14px", borderRadius: 10, cursor: "pointer",
              background: lang === l.code ? COLORS.surfaceRaised : "transparent",
              border: `1px solid ${lang === l.code ? COLORS.gold : COLORS.border}`,
              color: lang === l.code ? COLORS.gold : COLORS.ink,
              fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500,
              direction: l.rtl ? "rtl" : "ltr", textAlign: l.rtl ? "right" : "left",
            }}>
              {l.label}
            </div>
          ))}
        </div>
      </Card>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: COLORS.inkMuted, marginTop: 14, lineHeight: 1.6 }}>
        This switches menu labels now, as a starting point. These are first-pass translations — worth having a fluent speaker in each language review them before members see it. Translating sermon text, testimonies, and notifications fully is a bigger next step.
      </div>
    </div>
  );
}

// ---------- MORE (grid menu) ----------
function MoreGrid({ onOpen, t }) {
  const items = [
    { id: "notes", label: t.notes, icon: NotebookPen },
    { id: "testimonies", label: t.testimonies, icon: Heart },
    { id: "prayer", label: t.prayer, icon: HandHeart },
    { id: "events", label: t.events, icon: Calendar },
    { id: "giving", label: t.giving, icon: Wallet },
    { id: "groups", label: t.groups, icon: Users },
    { id: "offline", label: t.offline, icon: Download },
    { id: "notifications", label: t.notifications, icon: Bell },
    { id: "language", label: t.language, icon: Globe },
  ];
  return (
    <div style={{ padding: "0 20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <div key={it.id} onClick={() => onOpen(it.id)} style={{
            background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14,
            padding: "20px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer",
          }}>
            <Icon size={22} color={COLORS.gold} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: COLORS.ink, textAlign: "center" }}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ---------- HOME ----------
function HomeTab({ navigate, openFeature }) {
  const [dailyVerse, setDailyVerse] = useState({ text: "For with God nothing shall be impossible.", ref: "LUKE 1:37" });
  useEffect(()=>{ (async()=>{ try { const r=await window.storage.get("verse-of-day", true); if(r) setDailyVerse(JSON.parse(r.value)); } catch(e){} })(); },[]);
  const quick = [
    { id: "live", label: "Watch Live", icon: Radio, sub: "Join the current service" },
    { id: "sermons", label: "Latest Sermons", icon: Play, sub: "Messages that build faith" },
    { id: "bible", label: "Read the Bible", icon: BookOpen, sub: "Study God's Word" },
    { id: "prayer", label: "Prayer Request", icon: HandHeart, sub: "Let us pray with you", feature: true },
    { id: "events", label: "Upcoming Events", icon: Calendar, sub: "Services & gatherings", feature: true },
    { id: "giving", label: "Giving", icon: Heart, sub: "Support the ministry", feature: true },
  ];
  return (
    <div style={{ padding: "8px 20px 34px" }}>
      <div style={{
        minHeight: 300, borderRadius: 24, overflow: "hidden", position: "relative",
        background: "radial-gradient(circle at 80% 20%, rgba(201,162,75,.28), transparent 35%), linear-gradient(135deg,#252c3d 0%,#171b25 65%,#10131a 100%)",
        border: `1px solid ${COLORS.border}`, padding: "34px 30px", display: "flex", flexDirection: "column", justifyContent: "center"
      }}>
        <div style={{ position:"absolute", right:-30, top:-20, width:220, height:220, borderRadius:"50%", border:"1px solid rgba(201,162,75,.18)" }} />
        <div style={{ position:"absolute", right:35, top:45, width:110, height:110, borderRadius:"50%", border:"1px solid rgba(201,162,75,.25)" }} />
        <div style={{ display:"flex", alignItems:"center", gap:8, color:COLORS.goldSoft, fontFamily:"Inter,sans-serif", fontSize:12, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase" }}><Sparkles size={15}/> Welcome Home</div>
        <h1 style={{ fontFamily:"Lora,serif", fontSize:"clamp(34px,7vw,58px)", lineHeight:1.05, color:COLORS.ink, maxWidth:650, margin:"14px 0 12px" }}>Encounter God.<br/><span style={{color:COLORS.gold}}>Live with power.</span></h1>
        <p style={{ fontFamily:"Inter,sans-serif", color:COLORS.inkMuted, fontSize:15, lineHeight:1.7, maxWidth:590, margin:"0 0 22px" }}>Welcome to Dunamis Life Ministries — a family growing in the Word, worship, prayer and the transforming power of God.</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <PrimaryButton onClick={()=>navigate("live")}><Radio size={17}/> Watch Live</PrimaryButton>
          <GhostButton onClick={()=>navigate("sermons")}><Play size={17}/> Explore Sermons</GhostButton>
        </div>
      </div>

      <div style={{ marginTop:28, display:"flex", alignItems:"end", justifyContent:"space-between", gap:12 }}>
        <div><div style={{fontFamily:"Lora,serif",fontSize:24,fontWeight:600,color:COLORS.ink}}>Your church, wherever you are</div><div style={{fontFamily:"Inter,sans-serif",fontSize:13,color:COLORS.inkMuted,marginTop:5}}>Everything you need to stay connected and grow.</div></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:12, marginTop:16 }}>
        {quick.map((q)=>{ const Icon=q.icon; return <div key={q.id} onClick={()=>q.feature?openFeature(q.id):navigate(q.id)} style={{background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:16,padding:18,cursor:"pointer",display:"flex",gap:14,alignItems:"center"}}>
          <div style={{width:44,height:44,borderRadius:13,background:"rgba(201,162,75,.12)",display:"grid",placeItems:"center",flex:"0 0 auto"}}><Icon size={21} color={COLORS.gold}/></div>
          <div><div style={{fontFamily:"Inter,sans-serif",fontWeight:700,fontSize:14,color:COLORS.ink}}>{q.label}</div><div style={{fontFamily:"Inter,sans-serif",fontSize:11.5,color:COLORS.inkMuted,marginTop:4}}>{q.sub}</div></div>
          <ChevronRight size={16} color={COLORS.inkMuted} style={{marginLeft:"auto"}}/>
        </div>})}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12,marginTop:24}}>
        <Card style={{padding:22,background:"linear-gradient(145deg,#2b3040,#222735)"}}><Cross size={24} color={COLORS.gold}/><div style={{fontFamily:"Lora,serif",fontSize:20,color:COLORS.ink,marginTop:14}}>Verse for the day</div><div style={{fontFamily:"Lora,serif",fontSize:15,color:COLORS.inkMuted,lineHeight:1.7,marginTop:8}}>“{dailyVerse.text}”</div><div style={{fontFamily:"Inter,sans-serif",fontSize:11,color:COLORS.gold,marginTop:10,fontWeight:700}}>{dailyVerse.ref}</div></Card>
        <Card style={{padding:22}}><Calendar size={24} color={COLORS.gold}/><div style={{fontFamily:"Lora,serif",fontSize:20,color:COLORS.ink,marginTop:14}}>Stay connected</div><div style={{fontFamily:"Inter,sans-serif",fontSize:13,color:COLORS.inkMuted,lineHeight:1.6,marginTop:8}}>See upcoming services, ministry gatherings and special events in one place.</div><GhostButton onClick={()=>openFeature("events")} style={{marginTop:14,padding:"9px 13px"}}>View Events <ChevronRight size={15}/></GhostButton></Card>
      </div>
    </div>
  );
}

// ---------- APP ROOT ----------
export default function ChurchApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [moreView, setMoreView] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminGate, setShowAdminGate] = useState(false);
  const [pin, setPin] = useState("");
  const [lang, setLang] = useState("en");

  const t = UI_STRINGS[lang];

  const tryAdmin = () => {
    if (pin === "1234") { setIsAdmin(true); setShowAdminGate(false); setPin(""); }
    else setPin("");
  };

  const PRIMARY_TABS = [
    { id: "home", label: "Home", icon: Home },
    { id: "live", label: t.live, icon: Radio },
    { id: "sermons", label: t.sermons, icon: Play },
    { id: "bible", label: t.bible, icon: BookOpen },
    { id: "more", label: t.more, icon: Grid3x3 },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: ShieldCheck }] : []),
  ];

  useEffect(() => {
    if (!isAdmin && activeTab === "admin") setActiveTab("home");
  }, [isAdmin, activeTab]);

  const titles = {
    home: ["Welcome", "Dunamis Life Ministries"],
    live: ["Live Service", "Join today's stream"],
    sermons: ["Sermon Library", "Watch or download past messages"],
    bible: ["Bible", "Search any verse or passage"],
    more: [t.more, t.welcome],
    admin: ["Admin", "Notify members and manage content"],
  };

  const moreTitles = {
    notes: [t.notes, "Notes from today's sermon"],
    testimonies: [t.testimonies, "What God has done"],
    prayer: [t.prayer, "Ask the church to pray with you"],
    events: [t.events, "Upcoming services and gatherings"],
    giving: [t.giving, "Support the church"],
    groups: [t.groups, "Find a fellowship near you"],
    offline: [t.offline, "Available with no internet connection"],
    notifications: [t.notifications, "Church announcements"],
    language: [t.language, "Choose how the app reads"],
  };

  const goBack = () => setMoreView(null);
  const openMore = (id) => setMoreView(id);

  let headerTitle, headerSubtitle, onBack;
  if (activeTab === "more" && moreView) {
    [headerTitle, headerSubtitle] = moreTitles[moreView];
    onBack = goBack;
  } else {
    [headerTitle, headerSubtitle] = titles[activeTab];
    onBack = null;
  }

  const switchTab = (id) => { setActiveTab(id); setMoreView(null); };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", justifyContent: "center" }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ width: "100%", maxWidth: activeTab === "home" ? 1080 : 680, minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 0" }}>
          <div>
            <div style={{ fontFamily: "Lora, serif", fontSize: 17, fontWeight: 600, color: COLORS.gold, letterSpacing: 0.3 }}>
              DUNAMIS LIFE MINISTRIES
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: COLORS.inkMuted, letterSpacing: 1.2, marginTop: 2 }}>
              {isAdmin ? "ADMIN MODE" : "WORD • WORSHIP • LIFE"}
            </div>
          </div>
          <div onClick={() => setShowAdminGate(true)} style={{ cursor: "pointer", opacity: 0.6 }}>
            <Settings size={16} color={COLORS.inkMuted} />
          </div>
        </div>

        {activeTab !== "home" && <Header title={headerTitle} subtitle={headerSubtitle} onBack={onBack} />}

        <div style={{ flex: 1, overflowY: "auto" }}>
          {activeTab === "home" && <HomeTab navigate={switchTab} openFeature={(id)=>{setActiveTab("more");setMoreView(id);}} />}
          {activeTab === "live" && <LiveTab isAdmin={isAdmin} />}
          {activeTab === "sermons" && <SermonsTab isAdmin={isAdmin} />}
          {activeTab === "bible" && <BibleTab />}
          {activeTab === "more" && !moreView && <MoreGrid onOpen={openMore} t={t} />}
          {activeTab === "more" && moreView === "notes" && <NotesTab />}
          {activeTab === "more" && moreView === "testimonies" && <TestimoniesTab />}
          {activeTab === "more" && moreView === "prayer" && <PrayerTab />}
          {activeTab === "more" && moreView === "events" && <EventsTab isAdmin={isAdmin} />}
          {activeTab === "more" && moreView === "giving" && <GivingTab />}
          {activeTab === "more" && moreView === "groups" && <GroupsTab isAdmin={isAdmin} />}
          {activeTab === "more" && moreView === "offline" && <OfflineTab />}
          {activeTab === "more" && moreView === "notifications" && <NotificationsTab isAdmin={isAdmin} />}
          {activeTab === "more" && moreView === "language" && <LanguageTab lang={lang} setLang={setLang} />}
          {activeTab === "admin" && (
            <AdminDashboard
              goTo={(id) => {
                if (id === "live" || id === "sermons") switchTab(id);
                else { setActiveTab("more"); setMoreView(id); }
              }}
            />
          )}
        </div>

        <div style={{ display: "flex", borderTop: `1px solid ${COLORS.border}`, background: COLORS.surface, position: "sticky", bottom: 0 }}>
          {PRIMARY_TABS.map((tb) => {
            const Icon = tb.icon;
            const active = activeTab === tb.id;
            return (
              <div key={tb.id} onClick={() => switchTab(tb.id)} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 4px 12px", cursor: "pointer",
              }}>
                <Icon size={18} color={active ? COLORS.gold : COLORS.inkMuted} />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: active ? COLORS.gold : COLORS.inkMuted }}>{tb.label}</span>
              </div>
            );
          })}
        </div>

        {showAdminGate && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <Card style={{ width: "100%", maxWidth: 320, background: COLORS.surfaceRaised }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, color: COLORS.ink }}>Admin access</span>
                <X size={16} color={COLORS.inkMuted} style={{ cursor: "pointer" }} onClick={() => setShowAdminGate(false)} />
              </div>
              {isAdmin ? (
                <PrimaryButton onClick={() => { setIsAdmin(false); setShowAdminGate(false); }}>Exit admin mode</PrimaryButton>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <TextField value={pin} onChange={setPin} placeholder="Enter admin PIN (demo: 1234)" />
                  <PrimaryButton onClick={tryAdmin}>Enter</PrimaryButton>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
