# CasaOS Widget for Übersicht

A beautiful macOS desktop widget that displays real-time system statistics from your CasaOS server.

![Widget Screenshot](screenshot.png)

## Features

- **CPU Usage** - Real-time CPU percentage with temperature
- **RAM Usage** - Memory usage matching CasaOS calculations
- **Docker Containers** - Dynamic list of running containers with CPU/RAM usage
- **Storage** - Auto-detected disks with usage and temperature
- **Collapsible** - Click arrow to collapse/expand widget
- **Localization** - Auto-detects system language (10 languages supported)
- **Live Updates** - Refreshes every 6 seconds, containers appear/disappear automatically

## Requirements

- macOS with [Übersicht](http://tracesof.net/uebersicht/) installed
- CasaOS server accessible via SSH
- SSH key authentication configured

## Installation

### 1. Install Übersicht

Download and install [Übersicht](http://tracesof.net/uebersicht/)

### 2. Clone or download this widget

```bash
cd ~/Library/Application\ Support/Übersicht/widgets/
git clone https://github.com/zloi2ff/casaos-widget.git casaos.widget
```

### 3. Set up SSH key authentication

```bash
# Generate SSH key if you don't have one
ssh-keygen -t ed25519

# Copy key to your CasaOS server
ssh-copy-id username@your-server-ip
```

### 4. Configure the widget

```bash
cd ~/Library/Application\ Support/Übersicht/widgets/casaos.widget
cp config.example.sh config.sh
```

Edit `config.sh` with your server details:

```bash
SERVER_HOST="192.168.1.100"      # Your CasaOS server IP
SERVER_USER="your_username"      # SSH username
SUDO_PASS="your_password"        # For docker stats (optional)
```

### 5. Make script executable

```bash
chmod +x fetch-stats.sh
```

### 6. Update widget path

Edit `casaos.jsx` and update the `widgetPath` variable to match your username:

```javascript
const widgetPath = `/Users/YOUR_USERNAME/Library/Application\\ Support/Übersicht/widgets/casaos.widget`;
```

### 7. Refresh Übersicht

Click the Übersicht menu bar icon and select "Refresh All Widgets"

## Configuration Options

| Option | Description |
|--------|-------------|
| `SERVER_HOST` | IP address or hostname of your CasaOS server |
| `SERVER_USER` | SSH username |
| `SUDO_PASS` | Password for sudo (needed for docker stats and disk temp) |

## Features in Detail

### Auto-detected Disks
The widget automatically detects all mounted disks on your server and displays:
- Usage percentage with color-coded progress bar
- Used/Total space
- Temperature (if available via SMART)

### Dynamic Container List
- Only shows currently running containers
- Containers appear when started, disappear when stopped
- Switch between CPU and RAM view with tabs
- Sorted by memory usage

### Collapsible Widget
Click the arrow (▼/▶) in the header to collapse or expand the widget.

### Localization
The widget automatically detects your macOS system language and displays text in:
- English (en) - default
- Ukrainian (uk)
- German (de)
- French (fr)
- Spanish (es)
- Italian (it)
- Polish (pl)
- Portuguese (pt)
- Dutch (nl)
- Chinese (zh)
- Japanese (ja)

## Customization

### Widget Position

Edit the `className` in `casaos.jsx`:

```css
top: 20px;   /* Distance from top */
left: 20px;  /* Distance from left */
```

### Refresh Rate

Change `refreshFrequency` in `casaos.jsx` (milliseconds):

```javascript
export const refreshFrequency = 6000; // 6 seconds
```

### Add More Languages

Edit the `i18n` object in `casaos.jsx`:

```javascript
const i18n = {
  en: { ... },
  uk: { ... },
  de: {
    systemStatus: 'Systemstatus',
    // ... add translations
  }
};
```

## Troubleshooting

### Widget shows "Server unavailable"

1. Check SSH connection: `ssh username@server-ip`
2. Verify SSH key is set up correctly
3. Check server IP in config.sh

### Widget shows configuration error

1. Make sure you copied `config.example.sh` to `config.sh`
2. Verify all required fields are filled in

### CPU shows 0%

The server might need `sysstat` package installed:
```bash
sudo apt install sysstat
```

### Disks not showing temperature

Install smartmontools on your server:
```bash
sudo apt install smartmontools
```

## License

MIT License

## Credits

Created for use with [CasaOS](https://casaos.io/) and [Übersicht](http://tracesof.net/uebersicht/)
