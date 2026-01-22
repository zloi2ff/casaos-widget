// CasaOS System Monitor Widget for Übersicht
// https://github.com/trackmystories/casaos-widget

export const refreshFrequency = 6000; // 6 seconds

// Configuration - UPDATE THESE PATHS AND IP FOR YOUR SETUP
const SERVER_IP = '192.168.31.73'; // Your CasaOS server IP
const TAILSCALE_IP = '100.112.200.121'; // Your Tailscale IP (shown when server offline)
const TAILSCALE_HOSTNAME = 'wyse5070'; // Your Tailscale hostname
export const command = `/Users/Andrii/Library/Application\\ Support/Übersicht/widgets/fetch-stats.sh`;
const actionScript = `/Users/Andrii/Library/Application\\ Support/Übersicht/widgets/docker-action.sh`;
const openScript = `/tmp/open-app.sh`;


// Theme definitions
const themes = {
  dark: {
    bg: 'linear-gradient(145deg, rgba(12, 12, 28, 0.96), rgba(20, 20, 45, 0.96))',
    text: '#fff',
    textMuted: 'rgba(255,255,255,0.5)',
    border: 'rgba(255,255,255,0.06)',
    cardBg: 'rgba(255,255,255,0.025)',
    sectionBg: 'rgba(0,0,0,0.25)',
    btnBg: 'rgba(255,255,255,0.05)',
    btnHover: 'rgba(255,255,255,0.15)',
    shadow: 'rgba(0,0,0,0.6)'
  },
  light: {
    bg: 'linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(245, 245, 250, 0.96))',
    text: '#1a1a2e',
    textMuted: 'rgba(26,26,46,0.5)',
    border: 'rgba(0,0,0,0.08)',
    cardBg: 'rgba(0,0,0,0.03)',
    sectionBg: 'rgba(0,0,0,0.05)',
    btnBg: 'rgba(0,0,0,0.05)',
    btnHover: 'rgba(0,0,0,0.1)',
    shadow: 'rgba(0,0,0,0.15)'
  }
};

// Detect system theme
const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
};

export const className = `
  top: 20px;
  left: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;

  .widget {
    border-radius: 20px;
    width: 300px;
    backdrop-filter: blur(30px);
    overflow: hidden;
  }

  .header {
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    font-weight: 600;
  }

  .section { padding: 20px; }

  .circles {
    display: flex;
    justify-content: space-around;
    padding: 10px 0 15px;
  }

  .circle-item { text-align: center; }

  .circle-wrapper {
    position: relative;
    width: 85px;
    height: 85px;
  }

  .circle-wrapper svg { transform: rotate(-90deg); }

  .circle-bg {
    fill: none;
    stroke: rgba(255,255,255,0.08);
    stroke-width: 6;
  }

  .circle-progress {
    fill: none;
    stroke-width: 6;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.6s;
  }

  .circle-text {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .circle-percent { font-size: 18px; font-weight: 600; }
  .circle-label { font-size: 11px; opacity: 0.6; margin-top: 3px; }
  .circle-sub { font-size: 9px; opacity: 0.4; margin-top: 2px; }

  .apps-section {
    border-top: 1px solid rgba(255,255,255,0.05);
    padding: 15px 20px;
  }

  .tabs {
    display: flex;
    gap: 18px;
    margin-bottom: 12px;
  }

  .tab {
    font-size: 11px;
    font-weight: 500;
    padding-bottom: 6px;
    opacity: 0.5;
    border-bottom: 2px solid transparent;
    cursor: pointer;
  }

  .tab:hover { opacity: 0.8; }
  .tab.active { opacity: 1; border-bottom-color: #4ade80; }
  .tab.cpu-active { border-bottom-color: #22d3ee; }

  .app-item {
    display: flex;
    align-items: center;
    padding: 9px 0;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    gap: 8px;
  }

  .app-item:last-child { border-bottom: none; }

  .app-name {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    flex: 1;
    min-width: 0;
  }

  .app-name span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .app-icon { font-size: 15px; width: 20px; text-align: center; flex-shrink: 0; }

  .app-stat {
    font-size: 12px;
    font-weight: 500;
    width: 70px;
    text-align: right;
    flex-shrink: 0;
  }

  .app-stat.cpu { color: #22d3ee; }
  .app-stat.ram { color: #4ade80; }

  .storage-section {
    background: rgba(0,0,0,0.25);
    padding: 15px 20px;
  }

  .section-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
  }

  .disk-item {
    background: rgba(255,255,255,0.025);
    border-radius: 12px;
    padding: 12px 14px;
    margin-bottom: 10px;
  }

  .disk-item:last-child { margin-bottom: 0; }

  .disk-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }

  .disk-icon { font-size: 20px; }
  .disk-info { flex: 1; }
  .disk-name { font-size: 13px; font-weight: 500; margin-bottom: 2px; }
  .disk-usage { font-size: 11px; opacity: 0.5; }

  .progress-bar {
    width: 100%;
    height: 5px;
    background: rgba(255,255,255,0.08);
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.5s;
  }

  .offline {
    padding: 30px 20px;
    text-align: center;
    opacity: 0.5;
    font-size: 13px;
  }

  .error {
    padding: 20px;
    text-align: center;
    color: #ff6b6b;
    font-size: 12px;
  }

  .tailscale-section {
    padding: 12px 20px;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ts-icon {
    font-size: 18px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.05);
    border-radius: 8px;
  }

  .ts-info { flex: 1; }
  .ts-title { font-size: 12px; font-weight: 500; margin-bottom: 2px; display: flex; align-items: center; gap: 6px; }
  .ts-detail { font-size: 11px; opacity: 0.5; }

  .ts-status {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }

  .ts-status.online { background: #4ade80; box-shadow: 0 0 6px #4ade80; }
  .ts-status.offline { background: #ff6b6b; box-shadow: 0 0 6px #ff6b6b; }

  .action-btn {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: rgba(255,255,255,0.1);
    border: none;
    cursor: pointer;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.6;
    transition: opacity 0.2s, background 0.2s;
    flex-shrink: 0;
    color: inherit;
  }

  .app-item:hover .action-btn { opacity: 0.9; }
  .action-btn:hover { opacity: 1; background: rgba(34, 211, 238, 0.3); }
`;

// Theme modes: 'auto', 'dark', 'light'
// Load cached Tailscale from localStorage
const getSavedTailscale = () => {
  try {
    const saved = localStorage.getItem('casaos_tailscale');
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
};
export const initialState = { activeTab: 'ram', output: '', collapsed: false, themeMode: 'auto', appsCollapsed: false, lastTailscale: getSavedTailscale() };

export const updateState = (event, prev) => {
  if (event.type === 'UB/COMMAND_RAN') {
    // Cache Tailscale info from output
    let lastTailscale = prev.lastTailscale;
    if (event.output) {
      const tsLine = event.output.split('\n').find(l => l.startsWith('TAILSCALE:'));
      if (tsLine) {
        const p = tsLine.split(':');
        if (p.length >= 4 && p[2] !== '--') {
          lastTailscale = { online: p[1] === 'true', ip: p[2], hostname: p[3] };
          // Save to localStorage for persistence
          try { localStorage.setItem('casaos_tailscale', JSON.stringify(lastTailscale)); } catch {}
        }
      }
    }
    return { ...prev, output: event.output, lastTailscale };
  }
  if (event.type === 'TAB_CLICK') return { ...prev, activeTab: event.tab };
  if (event.type === 'TOGGLE_COLLAPSE') return { ...prev, collapsed: !prev.collapsed };
  if (event.type === 'TOGGLE_APPS') return { ...prev, appsCollapsed: !prev.appsCollapsed };
  if (event.type === 'CYCLE_THEME') {
    const modes = ['auto', 'dark', 'light'];
    const idx = modes.indexOf(prev.themeMode);
    return { ...prev, themeMode: modes[(idx + 1) % 3] };
  }
  return prev;
};

const icons = {
  jellyfin: '🎬', qbittorrent: '📥', adguard: '🛡️', tailscale: '🔗',
  plex: '🎬', nginx: '🌐', portainer: '🐳', homeassistant: '🏠',
  sonarr: '📺', radarr: '🎥', prowlarr: '🔍', transmission: '📥',
  nextcloud: '☁️', pihole: '🛡️', grafana: '📊', prometheus: '📈'
};

// App ports - customize for your setup
const appPorts = {
  jellyfin: 8097, qbittorrent: 8181, adguard: 8080, 'adguard-home': 8080,
  plex: 32400, portainer: 9000, homeassistant: 8123, 'home-assistant': 8123,
  sonarr: 8989, radarr: 7878, prowlarr: 9696, transmission: 9091,
  nextcloud: 443, pihole: 80, grafana: 3000, prometheus: 9090,
  nginx: 80, traefik: 8080, syncthing: 8384, vaultwarden: 80,
  filebrowser: 8080, duplicati: 8200, gitea: 3000, code: 8443
};

const getIcon = (n) => {
  const l = (n || '').toLowerCase();
  for (const [k, v] of Object.entries(icons)) if (l.includes(k)) return v;
  return '📦';
};

const getAppUrl = (name, serverIp) => {
  const l = (name || '').toLowerCase();
  for (const [k, port] of Object.entries(appPorts)) {
    if (l.includes(k)) return `http://${serverIp}:${port}`;
  }
  return null;
};


const fmtName = (n) => n.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
// Use decimal (SI) units like CasaOS: 1 GB = 1000^3 bytes
const fmtBytes = (b) => b >= 1000000000 ? `${(b/1000000000).toFixed(2)} GB` : `${Math.round(b/1000000)} MB`;

// Localization
const lang = (typeof window !== 'undefined' && navigator.language || 'en').slice(0, 2);
const i18n = {
  en: {
    systemStatus: 'System Status',
    serverUnavailable: 'Server unavailable',
    loading: 'Loading...',
    storage: 'Storage',
    systemDisk: 'System Disk',
    used: 'Used',
    total: 'Total'
  },
  uk: {
    systemStatus: 'Стан системи',
    serverUnavailable: 'Сервер недоступний',
    loading: 'Завантаження...',
    storage: 'Сховище',
    systemDisk: 'Системний диск',
    used: 'Використано',
    total: 'Усього'
  },
  de: {
    systemStatus: 'Systemstatus',
    serverUnavailable: 'Server nicht erreichbar',
    loading: 'Laden...',
    storage: 'Speicher',
    systemDisk: 'Systemfestplatte',
    used: 'Belegt',
    total: 'Gesamt'
  },
  fr: {
    systemStatus: 'État du système',
    serverUnavailable: 'Serveur indisponible',
    loading: 'Chargement...',
    storage: 'Stockage',
    systemDisk: 'Disque système',
    used: 'Utilisé',
    total: 'Total'
  },
  es: {
    systemStatus: 'Estado del sistema',
    serverUnavailable: 'Servidor no disponible',
    loading: 'Cargando...',
    storage: 'Almacenamiento',
    systemDisk: 'Disco del sistema',
    used: 'Usado',
    total: 'Total'
  },
  it: {
    systemStatus: 'Stato del sistema',
    serverUnavailable: 'Server non disponibile',
    loading: 'Caricamento...',
    storage: 'Archiviazione',
    systemDisk: 'Disco di sistema',
    used: 'Usato',
    total: 'Totale'
  },
  pl: {
    systemStatus: 'Stan systemu',
    serverUnavailable: 'Serwer niedostępny',
    loading: 'Ładowanie...',
    storage: 'Pamięć',
    systemDisk: 'Dysk systemowy',
    used: 'Użyte',
    total: 'Razem'
  },
  pt: {
    systemStatus: 'Estado do sistema',
    serverUnavailable: 'Servidor indisponível',
    loading: 'Carregando...',
    storage: 'Armazenamento',
    systemDisk: 'Disco do sistema',
    used: 'Usado',
    total: 'Total'
  },
  nl: {
    systemStatus: 'Systeemstatus',
    serverUnavailable: 'Server niet beschikbaar',
    loading: 'Laden...',
    storage: 'Opslag',
    systemDisk: 'Systeemschijf',
    used: 'Gebruikt',
    total: 'Totaal'
  },
  zh: {
    systemStatus: '系统状态',
    serverUnavailable: '服务器不可用',
    loading: '加载中...',
    storage: '存储',
    systemDisk: '系统磁盘',
    used: '已用',
    total: '总计'
  },
  ja: {
    systemStatus: 'システム状態',
    serverUnavailable: 'サーバー利用不可',
    loading: '読み込み中...',
    storage: 'ストレージ',
    systemDisk: 'システムディスク',
    used: '使用済み',
    total: '合計'
  },
  ko: {
    systemStatus: '시스템 상태',
    serverUnavailable: '서버 사용 불가',
    loading: '로딩 중...',
    storage: '저장소',
    systemDisk: '시스템 디스크',
    used: '사용됨',
    total: '전체'
  },
  tr: {
    systemStatus: 'Sistem Durumu',
    serverUnavailable: 'Sunucu kullanılamıyor',
    loading: 'Yükleniyor...',
    storage: 'Depolama',
    systemDisk: 'Sistem Diski',
    used: 'Kullanılan',
    total: 'Toplam'
  },
  hi: {
    systemStatus: 'सिस्टम स्थिति',
    serverUnavailable: 'सर्वर उपलब्ध नहीं',
    loading: 'लोड हो रहा है...',
    storage: 'भंडारण',
    systemDisk: 'सिस्टम डिस्क',
    used: 'उपयोग किया गया',
    total: 'कुल'
  },
  ar: {
    systemStatus: 'حالة النظام',
    serverUnavailable: 'الخادم غير متاح',
    loading: 'جار التحميل...',
    storage: 'التخزين',
    systemDisk: 'قرص النظام',
    used: 'مستخدم',
    total: 'الإجمالي'
  },
  id: {
    systemStatus: 'Status Sistem',
    serverUnavailable: 'Server tidak tersedia',
    loading: 'Memuat...',
    storage: 'Penyimpanan',
    systemDisk: 'Disk Sistem',
    used: 'Terpakai',
    total: 'Total'
  },
  vi: {
    systemStatus: 'Trạng thái hệ thống',
    serverUnavailable: 'Máy chủ không khả dụng',
    loading: 'Đang tải...',
    storage: 'Lưu trữ',
    systemDisk: 'Đĩa hệ thống',
    used: 'Đã dùng',
    total: 'Tổng'
  },
  th: {
    systemStatus: 'สถานะระบบ',
    serverUnavailable: 'เซิร์ฟเวอร์ไม่พร้อมใช้งาน',
    loading: 'กำลังโหลด...',
    storage: 'ที่เก็บข้อมูล',
    systemDisk: 'ดิสก์ระบบ',
    used: 'ใช้แล้ว',
    total: 'ทั้งหมด'
  },
  sv: {
    systemStatus: 'Systemstatus',
    serverUnavailable: 'Server otillgänglig',
    loading: 'Laddar...',
    storage: 'Lagring',
    systemDisk: 'Systemdisk',
    used: 'Använt',
    total: 'Totalt'
  },
  cs: {
    systemStatus: 'Stav systému',
    serverUnavailable: 'Server nedostupný',
    loading: 'Načítání...',
    storage: 'Úložiště',
    systemDisk: 'Systémový disk',
    used: 'Použito',
    total: 'Celkem'
  },
  ru: {
    systemStatus: 'Состояние системы',
    serverUnavailable: 'Сервер недоступен',
    loading: 'Загрузка...',
    storage: 'Хранилище',
    systemDisk: 'Системный диск',
    used: 'Использовано',
    total: 'Всего'
  }
};
const t = i18n[lang] || i18n.en;

const parse = (out) => {
  const d = {
    cpu: 0, ram: 0, ramUsed: '0', ramTotal: '0',
    temp: 0, power: '--',
    topProc: { name: '--', cpu: 0 },
    disks: [],
    containers: [], error: null,
    tailscale: { online: false, ip: '--', hostname: '--' }
  };
  if (!out) return d;

  // Check for config errors
  if (out.startsWith('ERROR:')) {
    d.error = out.replace('ERROR:', '').trim();
    return d;
  }

  for (const line of out.trim().split('\n')) {
    if (line.startsWith('CPU:')) d.cpu = parseInt(line.split(':')[1]) || 0;
    else if (line.startsWith('RAM:') && !line.startsWith('RAM_')) d.ram = parseInt(line.split(':')[1]) || 0;
    else if (line.startsWith('RAM_USED:')) d.ramUsed = line.split(':')[1] || '0';
    else if (line.startsWith('RAM_TOTAL:')) d.ramTotal = line.split(':')[1] || '0';
    else if (line.startsWith('TEMP:')) d.temp = parseInt(line.split(':')[1]) || 0;
    else if (line.startsWith('POWER:')) d.power = line.split(':')[1] || '--';
    else if (line.startsWith('TOP_PROC:')) {
      const p = line.split(':');
      if (p.length >= 3) {
        d.topProc = { name: p[1] || '--', cpu: parseFloat(p[2]) || 0 };
      }
    }
    else if (line.startsWith('DISK:')) {
      const parts = line.split(':');
      if (parts.length >= 5) {
        const [, name, mount, info, temp] = parts;
        const [u, t, p] = (info || '').split(' ');
        d.disks.push({
          name: name || 'Disk',
          mount: mount || '/',
          used: parseInt(u) || 0,
          total: parseInt(t) || 0,
          percent: parseInt(p) || 0,
          temp: temp || '--',
          isSystem: mount === '/'
        });
      }
    }
    else if (line.startsWith('TAILSCALE:')) {
      const p = line.split(':');
      if (p.length >= 4) {
        d.tailscale = {
          online: p[1] === 'true',
          ip: p[2] || '--',
          hostname: p[3] || '--'
        };
      }
    }
    else if (line.startsWith('CONTAINER:')) {
      const p = line.split(':');
      if (p.length >= 4) {
        d.containers.push({
          name: p[1],
          cpu: p[2],
          mem: p[3].split('/')[0].trim(),
          port: p[4] && p[4] !== '--' ? p[4] : null
        });
      }
    }
  }

  d.containers.sort((a, b) => {
    const ps = (s) => { const n = parseFloat(s)||0; return s.includes('GiB') ? n*1024 : n; };
    return ps(b.mem) - ps(a.mem);
  });

  return d;
};

const Circle = ({ pct, color, label, sub, theme }) => {
  const r = 34, c = 2 * Math.PI * r, o = c - (Math.min(pct,100)/100) * c;
  const isLight = theme === 'light';
  const bgStroke = isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)';
  return (
    <div className="circle-item">
      <div className="circle-wrapper">
        <svg width="85" height="85">
          <circle cx="42.5" cy="42.5" r={r} className="circle-bg" style={{stroke: bgStroke, strokeWidth: isLight ? 7 : 6}} />
          <circle cx="42.5" cy="42.5" r={r} className="circle-progress"
            style={{ stroke: color, strokeDasharray: c, strokeDashoffset: o, strokeWidth: isLight ? 7 : 6 }} />
        </svg>
        <div className="circle-text">
          <div className="circle-percent">{Math.round(pct)}%</div>
          <div className="circle-label">{label}</div>
          {sub && <div className="circle-sub">{sub}</div>}
        </div>
      </div>
    </div>
  );
};

const cpuCol = (p) => p > 80 ? '#ff6b6b' : p > 50 ? '#fbbf24' : '#22d3ee';
const ramCol = (p) => p > 80 ? '#ff6b6b' : p > 60 ? '#fbbf24' : '#4ade80';
const diskCol = (p) => p > 85 ? '#ff6b6b' : p > 70 ? '#fbbf24' : '#4ade80';

export const render = ({ output, activeTab, collapsed, themeMode, appsCollapsed, lastTailscale }, dispatch) => {
  // Resolve theme
  const currentTheme = themeMode === 'auto' ? getSystemTheme() : themeMode;
  const th = themes[currentTheme];
  const themeIcon = themeMode === 'auto' ? '◐' : themeMode === 'dark' ? '🌙' : '☀️';

  const widgetStyle = {
    background: th.bg,
    color: th.text,
    boxShadow: `0 20px 60px ${th.shadow}`,
    border: `1px solid ${th.border}`
  };

  if (!output || !output.trim()) {
    return (
      <div className="widget" style={widgetStyle}>
        <div className="header" style={{borderColor: th.border}}>
          <span>{t.systemStatus}</span>
          <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
            <span style={{opacity:0.5,fontSize:12,cursor:'pointer',padding:'4px'}}
              onClick={() => dispatch({type:'CYCLE_THEME'})} title={`Theme: ${themeMode}`}>{themeIcon}</span>
          </div>
        </div>
        <div style={{padding:'15px 20px', textAlign:'center', opacity:0.6, fontSize:13}}>🔌 {t.serverUnavailable}</div>
        {(lastTailscale || TAILSCALE_IP) && (
          <div className="tailscale-section" style={{borderColor: th.border, borderTop: `1px solid ${th.border}`}}>
            <div className="ts-icon" style={{background: th.btnBg}}>🔗</div>
            <div className="ts-info">
              <div className="ts-title">
                <span style={{width:8,height:8,borderRadius:'50%',background:'#888',display:'inline-block',marginRight:6}}></span>
                Tailscale
              </div>
              <div className="ts-detail" style={{color: th.textMuted}}>
                {lastTailscale ? lastTailscale.ip : TAILSCALE_IP} • {lastTailscale ? lastTailscale.hostname : TAILSCALE_HOSTNAME}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const d = parse(output);

  if (d.error) {
    return <div className="widget" style={widgetStyle}><div className="error">⚠️ {d.error}</div></div>;
  }

  const isCpu = activeTab === 'cpu';
  const cpuSub = d.power !== '--' ? `${d.power}W / ${d.temp}°C` : `${d.temp}°C`;

  if (collapsed) {
    return (
      <div className="widget" style={widgetStyle}>
        <div className="header" style={{borderBottom:'none', borderColor: th.border}}>
          <span>{t.systemStatus}</span>
          <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
            <span style={{opacity:0.6,fontSize:12,cursor:'pointer',padding:'4px'}}
              onClick={() => dispatch({type:'CYCLE_THEME'})}>{themeIcon}</span>
            <span style={{opacity:0.6,fontSize:12,cursor:'pointer',padding:'4px'}}
              onClick={() => dispatch({type:'TOGGLE_COLLAPSE'})}>▶</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="widget" style={widgetStyle}>
      <div className="header" style={{borderColor: th.border}}>
        <span>{t.systemStatus}</span>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <span style={{opacity:0.5,fontSize:12,cursor:'pointer',padding:'4px'}}
            onClick={() => dispatch({type:'CYCLE_THEME'})} title={`Theme: ${themeMode}`}>{themeIcon}</span>
          <span style={{opacity:0.4,fontSize:12,cursor:'pointer',padding:'4px'}}
            onClick={() => dispatch({type:'TOGGLE_COLLAPSE'})}>▼</span>
        </div>
      </div>

      <div className="section">
        <div className="circles">
          <Circle pct={d.cpu} color={cpuCol(d.cpu)} label="CPU" sub={cpuSub} theme={currentTheme} />
          <Circle pct={d.ram} color={ramCol(d.ram)} label="RAM" sub={`${d.ramUsed} GB`} theme={currentTheme} />
        </div>
      </div>

      <div className="tailscale-section" style={{borderColor: th.border}}>
        <div className="ts-icon" style={{background: th.btnBg}}>🔗</div>
        <div className="ts-info">
          <div className="ts-title">
            <span className={`ts-status ${d.tailscale.online ? 'online' : 'offline'}`}></span>
            Tailscale
          </div>
          <div className="ts-detail" style={{color: th.textMuted}}>{d.tailscale.ip} • {d.tailscale.hostname}</div>
        </div>
      </div>

      <div className="apps-section" style={{borderColor: th.border, padding: appsCollapsed ? '10px 20px' : '15px 20px'}}>
        <div className="tabs" style={{marginBottom: appsCollapsed ? 0 : 12, justifyContent: appsCollapsed ? 'center' : 'flex-start'}}>
          {!appsCollapsed && <span className={`tab ${isCpu ? 'active cpu-active' : ''}`}
              onClick={() => dispatch({type:'TAB_CLICK',tab:'cpu'})}>CPU</span>}
          {!appsCollapsed && <span className={`tab ${!isCpu ? 'active' : ''}`}
              onClick={() => dispatch({type:'TAB_CLICK',tab:'ram'})}>RAM</span>}
          <span style={{marginLeft: appsCollapsed ? 0 : 'auto', opacity:0.4, cursor:'pointer', fontSize: appsCollapsed ? 12 : 10}}
            onClick={() => dispatch({type:'TOGGLE_APPS'})}>{appsCollapsed ? '▶ Apps' : '▼'}</span>
        </div>
        {!appsCollapsed && (d.containers.length > 0 ? (() => {
          // Find container with highest CPU
          const maxCpuIdx = d.containers.reduce((maxI, c, i, arr) =>
            parseFloat(c.cpu) > parseFloat(arr[maxI].cpu) ? i : maxI, 0);
          const maxCpu = parseFloat(d.containers[maxCpuIdx]?.cpu) || 0;
          // Find container with highest RAM
          const parseMem = (s) => { const n = parseFloat(s)||0; return s.includes('GiB') ? n*1024 : n; };
          const maxRamIdx = d.containers.reduce((maxI, c, i, arr) =>
            parseMem(c.mem) > parseMem(arr[maxI].mem) ? i : maxI, 0);
          const maxRam = parseMem(d.containers[maxRamIdx]?.mem) || 0;
          return d.containers.map((c, i) => {
            const isTopCpu = isCpu && i === maxCpuIdx && maxCpu > 1;
            const isTopRam = !isCpu && i === maxRamIdx && maxRam > 10;
            const isTop = isTopCpu || isTopRam;
            const bgColor = isTopCpu ? 'rgba(34,211,238,0.08)' : isTopRam ? 'rgba(74,222,128,0.08)' : 'transparent';
            return (
              <div key={i} className="app-item" style={{borderColor: th.border, background: bgColor}}>
                <div className="app-name">
                  {c.port ? (
                    <a href={`http://${SERVER_IP}:${c.port}`}
                       className="app-icon"
                       style={{textDecoration:'none', cursor:'pointer'}}
                       title={`Open :${c.port}`}>{getIcon(c.name)}</a>
                  ) : (
                    <span className="app-icon">{getIcon(c.name)}</span>
                  )}
                  <span>{fmtName(c.name)}{isTop && ' ⚡'}</span>
                </div>
                <span className={`app-stat ${isCpu ? 'cpu' : 'ram'}`}>
                  {isCpu ? c.cpu : c.mem}
                </span>
              </div>
            );
          });
        })() : <div style={{opacity:0.4,fontSize:12,padding:'10px 0',textAlign:'center'}}>{t.loading}</div>)}
      </div>

      <div className="storage-section" style={{background: th.sectionBg}}>
        <div className="section-title">
          <span>{t.storage}</span>
          <span style={{opacity:0.4}}>⚙️</span>
        </div>
        {d.disks.map((disk, i) => (
          <div key={i} className="disk-item" style={{background: th.cardBg}}>
            <div className="disk-header">
              <span className="disk-icon">{disk.isSystem ? '💾' : '💿'}</span>
              <div className="disk-info">
                <div className="disk-name" style={{color: th.text}}>
                  {disk.isSystem ? t.systemDisk : disk.name}
                  {disk.temp !== '--' && <span style={{opacity:0.7,fontSize:11,marginLeft:6}}>{disk.temp}°C</span>}
                </div>
                <div className="disk-usage" style={{color: th.text, opacity: 0.7}}>{t.used}: {fmtBytes(disk.used)} / {t.total}: {fmtBytes(disk.total)}</div>
              </div>
            </div>
            <div className="progress-bar" style={{background: th.btnBg}}>
              <div className="progress-fill" style={{width:`${disk.percent}%`,backgroundColor:diskCol(disk.percent)}} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
