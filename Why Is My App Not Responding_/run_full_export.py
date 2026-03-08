#!/usr/bin/env python3
"""Full sandbox artifact export - one clean pass."""
import sqlite3, json, shutil, os, glob, subprocess

OUT = "/home/ubuntu/full_export"

# ============================================================
# 1. BASH HISTORY
# ============================================================
print("=== 1. BASH HISTORY ===")
shutil.copy2(os.path.expanduser("~/.bash_history"), f"{OUT}/bash_history.txt")
with open(f"{OUT}/bash_history.txt") as f:
    print(f"  {sum(1 for _ in f)} lines")

# ============================================================
# 2. GIT LOG + FULL DIFFS
# ============================================================
print("=== 2. GIT LOG + DIFFS ===")
os.chdir("/home/ubuntu/lecture-me-pro")
with open(f"{OUT}/git_log_oneline.txt", "w") as f:
    subprocess.run(["git", "log", "--all", "--oneline"], stdout=f, stderr=f)
with open(f"{OUT}/git_log_full_diffs.txt", "w") as f:
    subprocess.run(["git", "log", "--all", "--stat", "--patch"], stdout=f, stderr=f)
for name in ["git_log_oneline.txt", "git_log_full_diffs.txt"]:
    with open(f"{OUT}/{name}") as f:
        print(f"  {name}: {sum(1 for _ in f)} lines")

# ============================================================
# 3. MANUS-LOGS
# ============================================================
print("=== 3. MANUS-LOGS ===")
log_dir = "/home/ubuntu/lecture-me-pro/.manus-logs"
for fname in os.listdir(log_dir):
    src = os.path.join(log_dir, fname)
    dst = os.path.join(OUT, "manus-logs", fname)
    shutil.copy2(src, dst)
    print(f"  {fname}: {os.path.getsize(dst)} bytes")

# ============================================================
# 4. BROWSER DATA (History, Cookies, localStorage, Downloads)
# ============================================================
print("=== 4. BROWSER DATA ===")
browser_dir = "/home/ubuntu/.browser_data_dir/Default"

# 4a. History
try:
    shutil.copy2(f"{browser_dir}/History", f"{OUT}/browser/chromium_history.sqlite")
    conn = sqlite3.connect(f"{OUT}/browser/chromium_history.sqlite")
    c = conn.cursor()
    c.execute("SELECT id, url, title, visit_count, last_visit_time FROM urls ORDER BY last_visit_time DESC")
    cols = [d[0] for d in c.description]
    rows = [dict(zip(cols, row)) for row in c.fetchall()]
    with open(f"{OUT}/browser/history.json", "w") as f:
        json.dump(rows, f, indent=2)
    print(f"  history.json: {len(rows)} URLs")
    
    c.execute("SELECT id, url, visit_time, from_visit, transition FROM visits ORDER BY visit_time DESC")
    cols = [d[0] for d in c.description]
    rows = [dict(zip(cols, row)) for row in c.fetchall()]
    with open(f"{OUT}/browser/visits.json", "w") as f:
        json.dump(rows, f, indent=2)
    print(f"  visits.json: {len(rows)} visits")
    conn.close()
except Exception as e:
    print(f"  History ERROR: {e}")

# 4b. Cookies
try:
    conn = sqlite3.connect(f"{browser_dir}/Cookies")
    c = conn.cursor()
    c.execute("""SELECT host_key, name, path, expires_utc, is_httponly, is_secure, 
                 samesite, creation_utc, last_access_utc, has_expires, is_persistent, 
                 priority, source_scheme FROM cookies ORDER BY host_key""")
    cols = [d[0] for d in c.description]
    rows = [dict(zip(cols, row)) for row in c.fetchall()]
    with open(f"{OUT}/browser/cookies.json", "w") as f:
        json.dump(rows, f, indent=2)
    print(f"  cookies.json: {len(rows)} cookies")
    conn.close()
except Exception as e:
    print(f"  Cookies ERROR: {e}")

# 4c. localStorage (LevelDB - dump what we can)
ls_dir = f"{browser_dir}/Local Storage/leveldb"
if os.path.isdir(ls_dir):
    ls_out = f"{OUT}/browser/localStorage_raw"
    shutil.copytree(ls_dir, ls_out)
    # Also try to extract readable strings
    # Extract readable strings using python
    all_strings = []
    for pattern in ["*.log", "*.ldb"]:
        for fpath in glob.glob(f"{ls_dir}/{pattern}"):
            try:
                with open(fpath, 'rb') as bf:
                    data = bf.read()
                    # Extract printable ASCII sequences
                    import re as _re
                    found = _re.findall(b'[\x20-\x7e]{4,}', data)
                    all_strings.extend([s.decode('ascii', errors='ignore') for s in found])
            except: pass
    with open(f"{OUT}/browser/localStorage_strings.txt", "w") as f:
        f.write("\n".join(all_strings))
    print(f"  localStorage_strings.txt: {len(all_strings)} strings")

# 4d. Downloads
dl_dir = "/home/ubuntu/Downloads"
if os.path.isdir(dl_dir):
    files = os.listdir(dl_dir)
    with open(f"{OUT}/browser/downloads_listing.txt", "w") as f:
        for fname in files:
            fpath = os.path.join(dl_dir, fname)
            f.write(f"{fname}\t{os.path.getsize(fpath)}\t{os.path.getmtime(fpath)}\n")
    print(f"  downloads_listing.txt: {len(files)} files")

# ============================================================
# 5. CONSOLE OUTPUTS
# ============================================================
print("=== 5. CONSOLE OUTPUTS ===")
co_dir = "/home/ubuntu/console_outputs"
if os.path.isdir(co_dir):
    for fname in sorted(os.listdir(co_dir)):
        shutil.copy2(os.path.join(co_dir, fname), os.path.join(OUT, "console_outputs", fname))
    print(f"  {len(os.listdir(co_dir))} files copied")

# ============================================================
# 6. SCREENSHOTS
# ============================================================
print("=== 6. SCREENSHOTS ===")
ss_dir = "/home/ubuntu/screenshots"
if os.path.isdir(ss_dir):
    for fname in sorted(os.listdir(ss_dir)):
        shutil.copy2(os.path.join(ss_dir, fname), os.path.join(OUT, "screenshots", fname))
    print(f"  {len(os.listdir(ss_dir))} files copied")

# ============================================================
# 7. PAGE TEXTS
# ============================================================
print("=== 7. PAGE TEXTS ===")
pt_dir = "/home/ubuntu/page_texts"
if os.path.isdir(pt_dir):
    for fname in sorted(os.listdir(pt_dir)):
        shutil.copy2(os.path.join(pt_dir, fname), os.path.join(OUT, "page_texts", fname))
    print(f"  {len(os.listdir(pt_dir))} files copied")

# ============================================================
# 8. SKILLS
# ============================================================
print("=== 8. SKILLS ===")
sk_dir = "/home/ubuntu/skills"
if os.path.isdir(sk_dir):
    shutil.copytree(sk_dir, f"{OUT}/skills", dirs_exist_ok=True)
    count = sum(len(files) for _, _, files in os.walk(sk_dir))
    print(f"  {count} files copied")
else:
    print("  No skills directory")

# ============================================================
# 9. UNITY / INJECTION search across entire sandbox
# ============================================================
print("=== 9. UNITY / INJECTION SEARCH ===")
search_dirs = ["/home/ubuntu/lecture-me-pro", "/home/ubuntu"]
for term in ["unity", "injection", "inject"]:
    result = subprocess.run(
        ["grep", "-r", "-i", "-l", term, "/home/ubuntu/lecture-me-pro"],
        capture_output=True, text=True
    )
    files_found = [f for f in result.stdout.strip().split("\n") if f and "node_modules" not in f and ".git/" not in f]
    if files_found:
        with open(f"{OUT}/unity_injection_matches/{term}_files.txt", "w") as f:
            f.write("\n".join(files_found))
        # Get the actual matching lines
        result2 = subprocess.run(
            ["grep", "-r", "-i", "-n", term, "/home/ubuntu/lecture-me-pro",
             "--include=*.ts", "--include=*.tsx", "--include=*.js", "--include=*.json",
             "--include=*.md", "--include=*.css", "--include=*.html"],
            capture_output=True, text=True
        )
        lines = [l for l in result2.stdout.strip().split("\n") if l and "node_modules" not in l and ".git/" not in l]
        with open(f"{OUT}/unity_injection_matches/{term}_matches.txt", "w") as f:
            f.write("\n".join(lines))
        print(f"  '{term}': {len(files_found)} files, {len(lines)} matching lines")
    else:
        print(f"  '{term}': 0 matches")

# Also search outside the project
for term in ["unity", "injection", "inject"]:
    result = subprocess.run(
        ["grep", "-r", "-i", "-l", term, "/home/ubuntu"],
        capture_output=True, text=True
    )
    files_found = [f for f in result.stdout.strip().split("\n") 
                   if f and "node_modules" not in f and ".git/" not in f 
                   and "full_export" not in f and ".browser_data_dir" not in f]
    if files_found:
        with open(f"{OUT}/unity_injection_matches/{term}_all_sandbox_files.txt", "w") as f:
            f.write("\n".join(files_found))
        print(f"  '{term}' (all sandbox): {len(files_found)} files")

# ============================================================
# 10. DATABASE EXPORT
# ============================================================
print("=== 10. DATABASE ===")
try:
    # Read DATABASE_URL from .env or env
    db_url = None
    env_file = "/home/ubuntu/lecture-me-pro/.env"
    if os.path.isfile(env_file):
        with open(env_file) as f:
            for line in f:
                if line.startswith("DATABASE_URL="):
                    db_url = line.strip().split("=", 1)[1]
                    break
    if db_url:
        print(f"  DATABASE_URL found (redacted credentials)")
        with open(f"{OUT}/database_url_redacted.txt", "w") as f:
            # Redact password
            import re
            redacted = re.sub(r'://([^:]+):([^@]+)@', r'://\1:***REDACTED***@', db_url)
            f.write(redacted)
    else:
        print("  No DATABASE_URL found in .env")
except Exception as e:
    print(f"  Database config error: {e}")

# ============================================================
# 11. S3 / STORAGE INFO
# ============================================================
print("=== 11. S3 / STORAGE INFO ===")
storage_files = glob.glob("/home/ubuntu/lecture-me-pro/server/storage.*") + \
                glob.glob("/home/ubuntu/lecture-me-pro/storage/*")
for sf in storage_files:
    shutil.copy2(sf, f"{OUT}/{os.path.basename(sf)}")
    print(f"  Copied {sf}")

# Also grab env.ts for all env var references
env_ts = "/home/ubuntu/lecture-me-pro/server/_core/env.ts"
if os.path.isfile(env_ts):
    shutil.copy2(env_ts, f"{OUT}/env_ts_reference.ts")
    print(f"  Copied env.ts")

# ============================================================
# 12. OTHER FILES in home dir (not in project, not in standard dirs)
# ============================================================
print("=== 12. OTHER HOME DIR FILES ===")
other_files = []
for item in os.listdir("/home/ubuntu"):
    if item.startswith(".") or item in ["lecture-me-pro", "full_export", "Downloads", 
                                         "screenshots", "page_texts", "console_outputs",
                                         "skills", "node_modules"]:
        continue
    path = os.path.join("/home/ubuntu", item)
    if os.path.isfile(path):
        other_files.append(item)
        shutil.copy2(path, f"{OUT}/{item}")
with open(f"{OUT}/other_home_files_listing.txt", "w") as f:
    for item in other_files:
        f.write(f"{item}\n")
print(f"  {len(other_files)} other files in home dir")

print("\n=== EXPORT COMPLETE ===")
