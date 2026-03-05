#!/bin/bash
# Automatic Google Drive Backup Script
# Copyright (c) 2026 Charles Kendrick

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PROJECT_DIR="/home/ubuntu/lecture-me-pro"
BACKUP_NAME="lecture-me-pro_${TIMESTAMP}"

echo "🔄 Starting backup to Google Drive..."
echo "📁 Backup name: ${BACKUP_NAME}"

rclone sync "${PROJECT_DIR}/" "manus_google_drive:LectureMePro_Backups/${BACKUP_NAME}" \
  --config /home/ubuntu/.gdrive-rclone.ini \
  --exclude "node_modules/**" \
  --exclude ".git/**" \
  --exclude "dist/**" \
  --exclude ".next/**" \
  --progress

if [ $? -eq 0 ]; then
  echo "✅ Backup complete: ${BACKUP_NAME}"
  echo "📊 $(rclone size manus_google_drive:LectureMePro_Backups/${BACKUP_NAME} --config /home/ubuntu/.gdrive-rclone.ini)"
else
  echo "❌ Backup failed"
  exit 1
fi
