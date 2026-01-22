# CasaOS Widget for Übersicht

A beautiful macOS desktop widget that displays real-time system statistics from your CasaOS server.

| Dark Theme | Light Theme |
|:---:|:---:|
| ![Dark](screenshot.png) | ![Light](screenshot-light.png) |

---

**[English](#english)** | **[Українська](#українська)**

---

## English

### Features

- **System Monitoring** - CPU, RAM usage with temperature display
- **Docker Containers** - Running containers with CPU/RAM stats (normalized to 100%)
- **Top Consumer Highlight** - Most resource-intensive container highlighted with ⚡
- **Clickable Apps** - Click container icon to open web UI (auto-detects port)
- **Storage** - Auto-detected disks with usage and temperature (click 🖥️ to open CasaOS)
- **Tailscale** - Connection status, IP and hostname (visible even when offline)
- **Themes** - Light, Dark, and Auto (follows macOS)
- **Collapsible** - Minimize widget or apps section
- **Localization** - 20 languages supported
- **Live Updates** - Refreshes every 6 seconds

### Requirements

- macOS with [Übersicht](http://tracesof.net/uebersicht/)
- CasaOS server accessible via SSH
- SSH key authentication configured

### Quick Start

```bash
# 1. Clone to widgets folder
cd ~/Library/Application\ Support/Übersicht/widgets/
git clone https://github.com/zloi2ff/casaos-widget.git casaos.widget

# 2. Set up SSH key
ssh-keygen -t ed25519
ssh-copy-id username@your-server-ip

# 3. Configure
cd casaos.widget
cp config.example.sh config.sh
# Edit config.sh with your server details

# 4. Make executable
chmod +x fetch-stats.sh
```

Edit `casaos.jsx` and update `SERVER_IP` with your server IP, then refresh Übersicht.

### Configuration

Edit `config.sh`:

```bash
SERVER_HOST="192.168.1.100"      # Your CasaOS server IP
SERVER_USER="your_username"      # SSH username
SUDO_PASS="your_password"        # For docker stats (optional)
```

### Features in Detail

#### Clickable App Icons
- Click any container icon to open its web UI
- Ports auto-detected via `docker port`
- Priority: 8080 → 8xxx-9xxx → 3xxx → 80/443

#### Themes
Click theme icon to cycle: Auto (◐) → Dark (🌙) → Light (☀️)

#### Tailscale Status
- Works with native Tailscale and Docker container
- Shows online/offline, IP, hostname
- IP visible even when server is offline

### Customization

Widget position in `casaos.jsx`:
```css
top: 20px;
left: 20px;
```

Refresh rate:
```javascript
export const refreshFrequency = 6000; // milliseconds
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Server unavailable | Check SSH: `ssh user@server-ip` |
| CPU shows 0% | Install sysstat: `sudo apt install sysstat` |
| No disk temperature | Install smartmontools: `sudo apt install smartmontools` |

---

## Українська

### Можливості

- **Моніторинг системи** - CPU, RAM з відображенням температури
- **Docker контейнери** - Запущені контейнери зі статистикою CPU/RAM (нормалізовано до 100%)
- **Підсвітка топ-споживача** - Найактивніший контейнер підсвічується ⚡
- **Клікабельні застосунки** - Клік на іконку відкриває веб-інтерфейс (автовизначення порту)
- **Сховище** - Автовизначення дисків з використанням та температурою (🖥️ відкриває CasaOS)
- **Tailscale** - Статус підключення, IP та hostname (видно навіть офлайн)
- **Теми** - Світла, Темна та Авто (слідує за macOS)
- **Згортання** - Мінімізація віджета або секції застосунків
- **Локалізація** - Підтримка 20 мов
- **Оновлення** - Оновлюється кожні 6 секунд

### Вимоги

- macOS з [Übersicht](http://tracesof.net/uebersicht/)
- CasaOS сервер доступний через SSH
- Налаштована SSH-автентифікація за ключем

### Швидкий старт

```bash
# 1. Клонувати в папку віджетів
cd ~/Library/Application\ Support/Übersicht/widgets/
git clone https://github.com/zloi2ff/casaos-widget.git casaos.widget

# 2. Налаштувати SSH ключ
ssh-keygen -t ed25519
ssh-copy-id username@ip-вашого-сервера

# 3. Налаштувати
cd casaos.widget
cp config.example.sh config.sh
# Відредагуйте config.sh з даними вашого сервера

# 4. Зробити виконуваним
chmod +x fetch-stats.sh
```

Відредагуйте `casaos.jsx` та оновіть `SERVER_IP` на IP вашого сервера, потім оновіть Übersicht.

### Налаштування

Редагуйте `config.sh`:

```bash
SERVER_HOST="192.168.1.100"      # IP вашого CasaOS сервера
SERVER_USER="your_username"      # SSH користувач
SUDO_PASS="your_password"        # Для docker stats (опціонально)
```

### Детальніше про функції

#### Клікабельні іконки застосунків
- Клік на іконку контейнера відкриває веб-інтерфейс
- Порти визначаються автоматично через `docker port`
- Пріоритет: 8080 → 8xxx-9xxx → 3xxx → 80/443

#### Теми
Клік на іконку теми перемикає: Авто (◐) → Темна (🌙) → Світла (☀️)

#### Статус Tailscale
- Працює з нативним Tailscale та Docker контейнером
- Показує онлайн/офлайн, IP, hostname
- IP видно навіть коли сервер офлайн

### Кастомізація

Позиція віджета в `casaos.jsx`:
```css
top: 20px;
left: 20px;
```

Частота оновлення:
```javascript
export const refreshFrequency = 6000; // мілісекунди
```

### Вирішення проблем

| Проблема | Рішення |
|----------|---------|
| Сервер недоступний | Перевірте SSH: `ssh user@server-ip` |
| CPU показує 0% | Встановіть sysstat: `sudo apt install sysstat` |
| Немає температури диска | Встановіть smartmontools: `sudo apt install smartmontools` |

---

## License / Ліцензія

MIT License

## Credits / Подяки

Created for [CasaOS](https://casaos.io/) and [Übersicht](http://tracesof.net/uebersicht/)
