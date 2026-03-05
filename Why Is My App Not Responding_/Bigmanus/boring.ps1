# Silent Service Monitor
# Runs every 15 minutes via Task Scheduler
# Logs service status changes to specified location

param(
    [string]$LogPath = "C:\Users\$env:USERNAME\.system_logs"
)

# Services to monitor
$ServicesToMonitor = @(
    "InventorySvc",
    "TrkWks", 
    "PcaSvc",
    "DiagTrack",
    "dmwappushservice",
    "WSearch"
)

# Create log directory if it doesn't exist
if (-not (Test-Path $LogPath)) {
    New-Item -ItemType Directory -Path $LogPath -Force | Out-Null
}

# Log file with date
$LogFile = Join-Path $LogPath "service_monitor_$(Get-Date -Format 'yyyy-MM').log"
$SnapshotFile = Join-Path $LogPath "snapshot_$(Get-Date -Format 'yyyyMMdd_HHmmss').json"

# Get current service status
$CurrentStatus = @{}
foreach ($service in $ServicesToMonitor) {
    try {
        $svc = Get-Service -Name $service -ErrorAction SilentlyContinue
        if ($svc) {
            $CurrentStatus[$service] = @{
                Status = $svc.Status.ToString()
                StartType = $svc.StartType.ToString()
                DisplayName = $svc.DisplayName
                Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
            }
        } else {
            $CurrentStatus[$service] = @{
                Status = "NotFound"
                StartType = "N/A"
                DisplayName = "N/A"
                Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
            }
        }
    } catch {
        $CurrentStatus[$service] = @{
            Status = "Error"
            StartType = "N/A"
            DisplayName = "Error: $($_.Exception.Message)"
            Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        }
    }
}

# Save snapshot as JSON
$CurrentStatus | ConvertTo-Json -Depth 3 | Out-File -FilePath $SnapshotFile -Encoding UTF8

# Check for changes from last snapshot
$LastSnapshotFile = Get-ChildItem -Path $LogPath -Filter "snapshot_*.json" | 
                    Sort-Object LastWriteTime -Descending | 
                    Select-Object -Skip 1 -First 1

if ($LastSnapshotFile) {
    $LastStatus = Get-Content $LastSnapshotFile.FullName | ConvertFrom-Json
    
    # Compare and log changes
    foreach ($service in $ServicesToMonitor) {
        $current = $CurrentStatus[$service]
        $last = $LastStatus.$service
        
        if ($last -and ($current.Status -ne $last.Status -or $current.StartType -ne $last.StartType)) {
            $logEntry = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] CHANGE DETECTED: $service"
            $logEntry += "`n  Previous: Status=$($last.Status), StartType=$($last.StartType)"
            $logEntry += "`n  Current:  Status=$($current.Status), StartType=$($current.StartType)"
            $logEntry += "`n"
            
            Add-Content -Path $LogFile -Value $logEntry
        }
    }
} else {
    # First run
    $logEntry = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] INITIAL SNAPSHOT"
    $logEntry += "`n  Monitoring started for: $($ServicesToMonitor -join ', ')"
    $logEntry += "`n"
    Add-Content -Path $LogFile -Value $logEntry
}

# Clean up old snapshots (keep last 100)
Get-ChildItem -Path $LogPath -Filter "snapshot_*.json" | 
    Sort-Object LastWriteTime -Descending | 
    Select-Object -Skip 100 | 
    Remove-Item -Force

# Exit silently
Exit 0
