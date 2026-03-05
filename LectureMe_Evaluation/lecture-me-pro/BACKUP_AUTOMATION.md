# Google Drive Backup Automation

**Copyright (c) 2026 Charles Kendrick. All Rights Reserved.**

## 📦 Backup Configuration

**Destination:** Google Drive - LectureMePro_Backups folder  
**Account:** zooleous1@gmail.com  
**Shareable Link:** https://drive.google.com/open?id=1JMyJ-cC2V5LhJUnL_Wh36aoxKr4-bC-u

---

## 🔄 Manual Backup

Run anytime to create a timestamped backup:

```bash
cd /home/ubuntu/lecture-me-pro
./backup-to-drive.sh
```

This creates a snapshot like: `lecture-me-pro_20260103_140530`

---

## ⏰ Automatic Daily Backup

### Option 1: Cron (Linux/Mac Production Servers)

```bash
# Setup daily backup at 2:00 AM
/home/ubuntu/setup-daily-backup.sh

# Verify cron job
crontab -l

# View backup logs
tail -f /home/ubuntu/backup.log
```

### Option 2: Systemd Timer (Modern Linux)

```bash
# Create systemd service
sudo cp /home/ubuntu/lecture-me-pro/backup-service/lectureme-backup.service /etc/systemd/system/
sudo cp /home/ubuntu/lecture-me-pro/backup-service/lectureme-backup.timer /etc/systemd/system/

# Enable and start timer
sudo systemctl enable lectureme-backup.timer
sudo systemctl start lectureme-backup.timer

# Check status
sudo systemctl status lectureme-backup.timer
```

### Option 3: GitHub Actions (Cloud-Based)

Add to `.github/workflows/backup.yml`:

```yaml
name: Daily Backup to Google Drive
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily
  workflow_dispatch:  # Manual trigger

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Backup to Google Drive
        run: ./backup-to-drive.sh
```

---

## 📊 What Gets Backed Up

**Included:**
- All source code
- Database schemas
- Configuration files
- Documentation
- Marketing materials
- Logos and assets

**Excluded:**
- `node_modules/` (dependencies)
- `.git/` (version control)
- `dist/` (build artifacts)
- `.next/` (Next.js cache)

---

## 🛡️ Why This Matters

1. **Copyright Evidence:** Timestamped backups prove creation dates
2. **Disaster Recovery:** Restore from any backup if local files are lost
3. **Version History:** Track evolution of the codebase
4. **IP Protection:** External storage creates independent evidence trail
5. **Peace of Mind:** Automatic protection without manual intervention

---

## 🔍 Verify Backups

```bash
# List all backups
rclone lsd manus_google_drive:LectureMePro_Backups --config /home/ubuntu/.gdrive-rclone.ini

# Check backup size
rclone size manus_google_drive:LectureMePro_Backups/lecture-me-pro_20260103_140530 --config /home/ubuntu/.gdrive-rclone.ini

# Download a backup
rclone copy manus_google_drive:LectureMePro_Backups/lecture-me-pro_20260103_140530 /home/ubuntu/restored/ --config /home/ubuntu/.gdrive-rclone.ini
```

---

## 📅 Backup Schedule

**Current:** Manual execution  
**Recommended:** Daily at 2:00 AM (low-traffic time)  
**Retention:** Keep all backups (no automatic deletion)

---

## 🚨 Troubleshooting

**"Permission denied"**
```bash
chmod +x /home/ubuntu/lecture-me-pro/backup-to-drive.sh
```

**"rclone not found"**
```bash
# Rclone is pre-configured in Manus sandbox
# For production servers, install: https://rclone.org/install/
```

**"Backup failed"**
```bash
# Check logs
cat /home/ubuntu/backup.log

# Test rclone connection
rclone lsd manus_google_drive: --config /home/ubuntu/.gdrive-rclone.ini
```

---

**Last Updated:** January 3, 2026  
**Maintained by:** Charles Kendrick
