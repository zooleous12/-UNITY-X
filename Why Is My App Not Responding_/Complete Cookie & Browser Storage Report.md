# Complete Cookie & Browser Storage Report
## Lecture Me Application

---

## COOKIES SET BY YOUR APP

Your Lecture Me application sets exactly **2 cookies**:

### 1. `app_session_id` (Server-Side Session Cookie)

| Property | Value |
|----------|-------|
| **Name** | `app_session_id` |
| **Set by** | Server (`server/_core/oauth.ts`, line 45) |
| **Purpose** | Stores your encrypted JWT session token after OAuth login |
| **When set** | After successful Manus OAuth login at `/api/oauth/callback` |
| **When deleted** | On logout (`server/routers.ts`, line 41) — sets `maxAge: -1` (immediate deletion) |
| **maxAge** | 365 days (31,536,000,000 ms) while logged in |
| **httpOnly** | `true` — JavaScript on the page CANNOT read this cookie |
| **secure** | `true` on HTTPS, `false` on HTTP (localhost dev) |
| **sameSite** | `"none"` — required for cross-origin OAuth flow |
| **path** | `"/"` — applies to all pages |
| **domain** | Not explicitly set (defaults to the exact domain serving the page) |
| **Contains** | A JWT token signed with `JWT_SECRET`, containing your `openId` and `name` |

### 2. `sidebar_state` (Client-Side UI Preference Cookie)

| Property | Value |
|----------|-------|
| **Name** | `sidebar_state` |
| **Set by** | Client JavaScript (`client/src/components/ui/sidebar.tsx`, line 85) |
| **Purpose** | Remembers whether the dashboard sidebar is open or closed |
| **When set** | When you toggle the sidebar open/closed |
| **maxAge** | 7 days (604,800 seconds) |
| **httpOnly** | `false` (set via `document.cookie`) |
| **secure** | Not specified (defaults to `false`) |
| **sameSite** | Not specified (defaults to browser default, typically `Lax`) |
| **path** | `"/"` |
| **Contains** | `"true"` or `"false"` (sidebar open state) |

---

## localStorage ITEMS SET BY YOUR APP

Your app stores these items in the browser's localStorage:

| Key | Purpose | Set By | Contains |
|-----|---------|--------|----------|
| `manus-runtime-user-info` | Caches current user info for quick access | `client/src/_core/hooks/useAuth.ts` | JSON of user object (name, email, role, etc.) or `null` |
| `sidebar_width` | Remembers dashboard sidebar width preference | `client/src/components/DashboardLayout.tsx` | Number (pixel width) |
| `theme` | Stores dark/light theme preference | `client/src/contexts/ThemeContext.tsx` | `"dark"` or `"light"` |
| `pwa-install-dismissed` | Tracks if user dismissed PWA install prompt | `client/src/components/InstallPWA.tsx` / `PWAInstallPrompt.tsx` | Timestamp (milliseconds) |
| `unity_core_port` | Stores Unity Core service port for local analytics | `client/src/services/unityCore.ts` | Port number |
| `studySessions` | Local backup of study session data | `client/src/services/unityCore.ts` | JSON array of session objects |

---

## sessionStorage ITEMS

**None.** Your app does not use sessionStorage.

---

## COOKIES FROM OTHER SITES IN THIS BROWSER

The sandbox browser (used for development/testing) also has cookies from other domains that are **NOT related to your Lecture Me app**. These are from previous browsing sessions in this shared sandbox environment:

| Domain | Cookies | Notes |
|--------|---------|-------|
| manus.computer | 1 cookie | Dev server proxy — likely your `app_session_id` for dev testing |
| 127.0.0.1 | 1 cookie | Localhost dev server — likely your `app_session_id` for local testing |
| manus.im | 3 cookies | Manus platform OAuth cookies (not set by your app) |
| cloudflare.com | 1 cookie | CDN/infrastructure cookie (not set by your app) |
| avpress.com | 2 cookies | Unrelated to your app |
| cnn.com | 16 cookies | Unrelated to your app |
| google.com | 4 cookies | Unrelated to your app |
| pornhub.com | 5 cookies | Unrelated to your app |
| stripe.com | 2 cookies | Stripe dashboard cookies (not set by your app) |

**Important:** These third-party cookies exist in the **sandbox development browser** only. They have nothing to do with your Lecture Me application. Your actual users' browsers will only have the 2 cookies your app sets (`app_session_id` and `sidebar_state`).

---

## WHAT YOUR USERS' BROWSERS WILL HAVE

When a real user visits lecturmepro-mezkjjof.manus.space (or lectureme.org once bound):

**Before login:**
- `sidebar_state` cookie (only if they toggle the sidebar)
- `theme` in localStorage (if they change theme)
- That's it.

**After login:**
- `app_session_id` cookie (encrypted JWT, httpOnly, secure, 1 year expiry)
- `sidebar_state` cookie (if they use sidebar)
- `manus-runtime-user-info` in localStorage (cached user profile)
- `theme` in localStorage
- `pwa-install-dismissed` in localStorage (if they dismiss PWA prompt)
- `studySessions` in localStorage (local study session backup)

**After logout:**
- `app_session_id` is deleted immediately (maxAge: -1)
- `manus-runtime-user-info` set to `null`
- Other localStorage items persist (theme preference, sidebar width, etc.)

---

## THIRD-PARTY COOKIES/TRACKING

Your Lecture Me app does **NOT** include:
- Google Analytics
- Facebook Pixel
- Any ad tracking scripts
- Any third-party analytics SDKs

The only external service integration is:
- **Manus OAuth** (for login) — sets its own cookies on `manus.im` domain
- **Manus Analytics** (via `VITE_ANALYTICS_*` env vars) — platform-level, not your code
- **Stripe.js** (loaded but not processing payments) — may set its own cookies when loaded

---

*Report generated from source code analysis of the Lecture Me codebase at `/home/ubuntu/lecture-me-pro/`*
*Date: February 26, 2026*
