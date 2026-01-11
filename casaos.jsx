// CasaOS System Monitor Widget for Übersicht
// https://github.com/trackmystories/casaos-widget

export const refreshFrequency = 6000; // 6 seconds

// Get widget directory path dynamically
const widgetPath = `/Users/Andrii/Library/Application\\ Support/Übersicht/widgets/casaos.widget`;
export const command = `${widgetPath}/fetch-stats.sh`;

export const className = `
  top: 20px;
  left: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  color: #fff;

  .widget {
    background: linear-gradient(145deg, rgba(12, 12, 28, 0.96), rgba(20, 20, 45, 0.96));
    border-radius: 20px;
    width: 300px;
    backdrop-filter: blur(30px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
    border: 1px solid rgba(255,255,255,0.06);
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
    justify-content: space-between;
    align-items: center;
    padding: 9px 0;
    border-bottom: 1px solid rgba(255,255,255,0.03);
  }

  .app-item:last-child { border-bottom: none; }

  .app-name {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
  }

  .app-icon { font-size: 15px; width: 20px; text-align: center; }

  .app-stat {
    font-size: 12px;
    font-weight: 500;
    min-width: 80px;
    text-align: right;
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
`;

export const initialState = { activeTab: 'ram', output: '', collapsed: false };

export const updateState = (event, prev) => {
  if (event.type === 'UB/COMMAND_RAN') return { ...prev, output: event.output };
  if (event.type === 'TAB_CLICK') return { ...prev, activeTab: event.tab };
  if (event.type === 'TOGGLE_COLLAPSE') return { ...prev, collapsed: !prev.collapsed };
  return prev;
};

const icons = {
  jellyfin: '🎬', qbittorrent: '📥', adguard: '🛡️', tailscale: '🔗',
  plex: '🎬', nginx: '🌐', portainer: '🐳', homeassistant: '🏠',
  sonarr: '📺', radarr: '🎥', prowlarr: '🔍', transmission: '📥',
  nextcloud: '☁️', pihole: '🛡️', grafana: '📊', prometheus: '📈'
};

const getIcon = (n) => {
  const l = (n || '').toLowerCase();
  for (const [k, v] of Object.entries(icons)) if (l.includes(k)) return v;
  return '📦';
};

const fmtName = (n) => n.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
// Use decimal (SI) units like CasaOS: 1 GB = 1000^3 bytes
const fmtBytes = (b) => b >= 1000000000 ? `${(b/1000000000).toFixed(2)} GB` : `${Math.round(b/1000000)} MB`;

const parse = (out) => {
  const d = {
    cpu: 0, ram: 0, ramUsed: '0', ramTotal: '0',
    temp: 0, power: '--', hddTemp: '--',
    diskRoot: {u:0,t:0,p:0}, diskData: {u:0,t:0,p:0},
    containers: [], error: null
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
    else if (line.startsWith('HDD_TEMP:')) d.hddTemp = line.split(':')[1] || '--';
    else if (line.startsWith('DISK_ROOT:')) {
      const [u, t, p] = line.replace('DISK_ROOT:', '').trim().split(' ');
      d.diskRoot = { u: parseInt(u)||0, t: parseInt(t)||0, p: parseInt(p)||0 };
    }
    else if (line.startsWith('DISK_DATA:')) {
      const [u, t, p] = line.replace('DISK_DATA:', '').trim().split(' ');
      d.diskData = { u: parseInt(u)||0, t: parseInt(t)||0, p: parseInt(p)||0 };
    }
    else if (line.startsWith('CONTAINER:')) {
      const p = line.split(':');
      if (p.length >= 4) {
        d.containers.push({
          name: p[1],
          cpu: p[2],
          mem: p[3].split('/')[0].trim()
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

const Circle = ({ pct, color, label, sub }) => {
  const r = 34, c = 2 * Math.PI * r, o = c - (Math.min(pct,100)/100) * c;
  return (
    <div className="circle-item">
      <div className="circle-wrapper">
        <svg width="85" height="85">
          <circle cx="42.5" cy="42.5" r={r} className="circle-bg" />
          <circle cx="42.5" cy="42.5" r={r} className="circle-progress"
            style={{ stroke: color, strokeDasharray: c, strokeDashoffset: o }} />
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

export const render = ({ output, activeTab, collapsed }, dispatch) => {
  if (!output || !output.trim()) {
    return <div className="widget"><div className="offline">🔌 Server unavailable</div></div>;
  }

  const d = parse(output);

  if (d.error) {
    return <div className="widget"><div className="error">⚠️ {d.error}</div></div>;
  }

  const rootP = d.diskRoot.p || (d.diskRoot.t > 0 ? (d.diskRoot.u / d.diskRoot.t) * 100 : 0);
  const dataP = d.diskData.p || (d.diskData.t > 0 ? (d.diskData.u / d.diskData.t) * 100 : 0);
  const isCpu = activeTab === 'cpu';

  const cpuSub = d.power !== '--' ? `${d.power}W / ${d.temp}°C` : `${d.temp}°C`;

  if (collapsed) {
    return (
      <div className="widget">
        <div className="header" style={{borderBottom:'none'}}>
          <span>System Status</span>
          <span
            style={{opacity:0.6,fontSize:12,cursor:'pointer',padding:'4px'}}
            onClick={() => dispatch({type:'TOGGLE_COLLAPSE'})}>▶</span>
        </div>
      </div>
    );
  }

  return (
    <div className="widget">
      <div className="header">
        <span>System Status</span>
        <span
          style={{opacity:0.4,fontSize:12,cursor:'pointer',padding:'4px'}}
          onClick={() => dispatch({type:'TOGGLE_COLLAPSE'})}>▼</span>
      </div>

      <div className="section">
        <div className="circles">
          <Circle pct={d.cpu} color={cpuCol(d.cpu)} label="CPU" sub={cpuSub} />
          <Circle pct={d.ram} color={ramCol(d.ram)} label="RAM" sub={`${d.ramUsed} GB`} />
        </div>
      </div>

      <div className="apps-section">
        <div className="tabs">
          <span className={`tab ${isCpu ? 'active cpu-active' : ''}`}
            onClick={() => dispatch({type:'TAB_CLICK',tab:'cpu'})}>CPU</span>
          <span className={`tab ${!isCpu ? 'active' : ''}`}
            onClick={() => dispatch({type:'TAB_CLICK',tab:'ram'})}>RAM</span>
        </div>
        {d.containers.length > 0 ? d.containers.map((c, i) => (
          <div key={i} className="app-item">
            <div className="app-name">
              <span className="app-icon">{getIcon(c.name)}</span>
              <span>{fmtName(c.name)}</span>
            </div>
            <span className={`app-stat ${isCpu ? 'cpu' : 'ram'}`}>
              {isCpu ? c.cpu : c.mem}
            </span>
          </div>
        )) : <div style={{opacity:0.4,fontSize:12,padding:'10px 0',textAlign:'center'}}>Loading...</div>}
      </div>

      <div className="storage-section">
        <div className="section-title">
          <span>Storage</span>
          <span style={{opacity:0.4}}>⚙️</span>
        </div>
        <div className="disk-item">
          <div className="disk-header">
            <span className="disk-icon">💾</span>
            <div className="disk-info">
              <div className="disk-name">System Disk</div>
              <div className="disk-usage">Used: {fmtBytes(d.diskRoot.u)} / Total: {fmtBytes(d.diskRoot.t)}</div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width:`${rootP}%`,backgroundColor:diskCol(rootP)}} />
          </div>
        </div>

        {d.diskData.t > 0 && (
          <div className="disk-item">
            <div className="disk-header">
              <span className="disk-icon">💿</span>
              <div className="disk-info">
                <div className="disk-name">External Disk {d.hddTemp !== '--' && <span style={{opacity:0.5,fontSize:11,marginLeft:6}}>{d.hddTemp}°C</span>}</div>
                <div className="disk-usage">Used: {fmtBytes(d.diskData.u)} / Total: {fmtBytes(d.diskData.t)}</div>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{width:`${dataP}%`,backgroundColor:diskCol(dataP)}} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
