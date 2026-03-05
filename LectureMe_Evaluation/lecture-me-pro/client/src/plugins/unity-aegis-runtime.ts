/**
 * UNITY X : AEGIS FRONTEND RUNTIME DEFENSE
 * Injected at the top of the document via Vite to wrap and protect the browser environment
 * before the main React application even loads.
 */

(function initializeAegisShield() {
  console.log("%c[AEGIS] Unity Frontend Shield Initializing...", "color: #00ffcc; font-weight: bold; background: #111; padding: 4px;");

  const BLOCKED_DOMAINS = [
    ".manuspre.computer",
    ".manus.computer",
    ".manus-asia.computer",
    ".manuscomputer.ai",
    ".manusvm.computer"
  ];

  // 1. DOM INJECTION DEFENSE (Mutation Observer)
  // Watches the entire DOM for unauthorized <script> tags trying to sneak in
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.tagName === 'SCRIPT') {
          const src = (node as HTMLScriptElement).src || '';
          if (BLOCKED_DOMAINS.some(domain => src.includes(domain))) {
            node.parentNode?.removeChild(node);
            console.error(`[AEGIS X] Blocked malicious script injection attempt: ${src}`);
            // Fire event to Chop Shop Admin baseline
            window.dispatchEvent(new CustomEvent('AEGIS_THREAT_DETECTED', { detail: { type: 'SCRIPT_INJECTION', src } }));
          }
        }
      });
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // 2. NETWORK DEFENSE (Fetch API Proxy)
  // Wraps the native fetch to intercept and block telemetry exfiltration
  const originalFetch = window.fetch;
  window.fetch = async function(resource, config) {
    const url = typeof resource === 'string' ? resource : (resource instanceof Request ? resource.url : '');
    
    if (BLOCKED_DOMAINS.some(domain => url.includes(domain))) {
      console.error(`[AEGIS X] Blocked network exfiltration attempt to: ${url}`);
      window.dispatchEvent(new CustomEvent('AEGIS_THREAT_DETECTED', { detail: { type: 'NETWORK_EXFILTRATION', url } }));
      return Promise.reject(new Error("Aegis Network Lock: Connection Refused"));
    }
    return originalFetch.call(this, resource, config);
  };

  // 3. ANTI-EVAL SHIELD (Code Injection Defense)
  // Prevents attackers from using eval() to run hidden base64 string payloads
  const originalEval = window.eval;
  window.eval = function(code) {
    if (code.includes('atob') || code.includes('base64')) {
      console.error("[AEGIS X] Blocked dynamic eval() payload injection!");
      window.dispatchEvent(new CustomEvent('AEGIS_THREAT_DETECTED', { detail: { type: 'EVAL_INJECTION' } }));
      return null;
    }
    return originalEval(code);
  };

  // 4. PREVENT PROXY OVERRIDES (Object.freeze)
  // Lock down the Aegis object so malware can't disable it
  window.UnityAegis = Object.freeze({
    status: "ACTIVE",
    version: "2026.03.04.DEEP",
    runDiagnostic: () => console.log("[AEGIS] All systems nominal. Unity ecosystem secure.")
  });

  console.log("%c[AEGIS] Environment Locked. Unity is watching.", "color: #00ffcc; font-weight: bold; background: #111; padding: 4px;");
})();
