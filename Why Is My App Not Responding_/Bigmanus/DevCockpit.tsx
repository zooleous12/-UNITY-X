import React, { useState } from "react";

type UserSummary = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string;
  status: "active" | "inactive" | "banned";
};

type FunctionStatus = {
  name: string;
  status: "Working" | "In Development" | "Planned";
  quality: "Excellent" | "Good" | "Fair" | "Poor" | "-";
  suggestion: string;
};

type FeatureFlag = {
  key: string;
  enabled: boolean;
  description?: string;
};

type DevCockpitProps = {
  users?: UserSummary[];
  onRefreshUsers?: () => void;
  onPromoteUserToAdmin?: (userId: string) => void;
  onDeactivateUser?: (userId: string) => void;

  featureFlags?: FeatureFlag[];
  onToggleFlag?: (key: string) => void;

  config?: Record<string, unknown>;
  onConfigUpdate?: (nextConfig: Record<string, unknown>) => void;

  onRunMaintenanceJob?: (jobName: string) => void;
};

type PanelKey =
  | "users"
  | "site"
  | "functions"
  | "network"
  | "security"
  | "flags"
  | "config"
  | "maintenance"
  | null;

const defaultFunctions: FunctionStatus[] = [
  {
    name: "AI Pipeline (Whisper + GPT-4)",
    status: "Working",
    quality: "Good",
    suggestion: "Add fallback provider + caching layer"
  },
  {
    name: "Spaced Repetition (SM-2)",
    status: "Working",
    quality: "Excellent",
    suggestion: "Expose per-course stats in UI"
  },
  {
    name: "Q&A Chat",
    status: "Working",
    quality: "Good",
    suggestion: "Add streaming responses + typing indicator"
  },
  {
    name: "Mobile / PWA Offline",
    status: "In Development",
    quality: "-",
    suggestion: "Prioritize flashcard offline first"
  },
  {
    name: "LMS Integrations (Canvas/Blackboard)",
    status: "Planned",
    quality: "-",
    suggestion: "Design API contracts early"
  }
];

export const DevCockpit: React.FC<DevCockpitProps> = ({
  users,
  onRefreshUsers,
  onPromoteUserToAdmin,
  onDeactivateUser,
  featureFlags,
  onToggleFlag,
  config,
  onConfigUpdate,
  onRunMaintenanceJob
}) => {
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<PanelKey>(null);
  const [configDraft, setConfigDraft] = useState(
    config ? JSON.stringify(config, null, 2) : "{\n\n}"
  );
  const [configError, setConfigError] = useState<string | null>(null);

  const siteInfo = {
    url: window.location.href,
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled
  };

  const networkInfo = {
    online: navigator.onLine,
    connection:
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection ||
      null
  };

  const securityInfo = {
    https: window.location.protocol === "https:",
    secureContext: window.isSecureContext,
    referrer: document.referrer || "None",
    visibility: document.visibilityState
  };

  const handleConfigSave = () => {
    if (!onConfigUpdate) return;
    try {
      const parsed = JSON.parse(configDraft);
      onConfigUpdate(parsed);
      setConfigError(null);
    } catch (err: any) {
      setConfigError(err?.message ?? "Invalid JSON");
    }
  };

  const renderUsersPanel = () => (
    <div>
      <h3 style={styles.subHeader}>Users</h3>
      <div style={styles.toolbarRow}>
        <button
          style={styles.smallButton}
          onClick={onRefreshUsers}
          disabled={!onRefreshUsers}
        >
          Refresh
        </button>
        {!onRefreshUsers && (
          <span style={styles.hint}>
            Wire <code>onRefreshUsers</code> to a tRPC query.
          </span>
        )}
      </div>
      {users && users.length > 0 ? (
        users.map((u) => (
          <div key={u.id} style={styles.item}>
            <div>
              <strong>{u.email}</strong> ({u.role}) — {u.status}
            </div>
            <div>Created: {u.createdAt}</div>
            {u.lastLoginAt && <div>Last Login: {u.lastLoginAt}</div>}
            <div style={styles.userActions}>
              <button
                style={styles.smallButton}
                onClick={() => onPromoteUserToAdmin?.(u.id)}
                disabled={!onPromoteUserToAdmin}
              >
                Make Admin
              </button>
              <button
                style={styles.smallButtonDanger}
                onClick={() => onDeactivateUser?.(u.id)}
                disabled={!onDeactivateUser}
              >
                Deactivate
              </button>
            </div>
          </div>
        ))
      ) : (
        <div style={styles.empty}>
          No users loaded. Pass <code>users</code> + hooks from your tRPC layer.
        </div>
      )}
    </div>
  );

  const renderSitePanel = () => (
    <div>
      <h3 style={styles.subHeader}>Site Information</h3>
      {Object.entries(siteInfo).map(([k, v]) => (
        <div key={k} style={styles.item}>
          <strong>{k}:</strong> {String(v)}
        </div>
      ))}
    </div>
  );

  const renderFunctionsPanel = () => (
    <div>
      <h3 style={styles.subHeader}>Function Status</h3>
      {defaultFunctions.map((f) => (
        <div key={f.name} style={styles.item}>
          <strong>{f.name}</strong>
          <br />
          Status: {f.status}
          <br />
          Quality: {f.quality}
          <br />
          Suggestion: {f.suggestion}
        </div>
      ))}
    </div>
  );

  const renderNetworkPanel = () => (
    <div>
      <h3 style={styles.subHeader}>Network Diagnostics</h3>
      <div style={styles.item}>
        <strong>Online:</strong> {String(networkInfo.online)}
      </div>
      <div style={styles.item}>
        <strong>Connection:</strong>{" "}
        {networkInfo.connection
          ? JSON.stringify(
              {
                type: networkInfo.connection.effectiveType,
                downlink: networkInfo.connection.downlink,
                rtt: networkInfo.connection.rtt
              },
              null,
              2
            )
          : "Not supported by this browser"}
      </div>
    </div>
  );

  const renderSecurityPanel = () => (
    <div>
      <h3 style={styles.subHeader}>Security / Context</h3>
      {Object.entries(securityInfo).map(([k, v]) => (
        <div key={k} style={styles.item}>
          <strong>{k}:</strong> {String(v)}
        </div>
      ))}
      <div style={styles.hint}>
        Browser‑level only. Anything deeper belongs in backend monitoring.
      </div>
    </div>
  );

  const renderFlagsPanel = () => (
    <div>
      <h3 style={styles.subHeader}>Feature Flags</h3>
      {featureFlags && featureFlags.length > 0 ? (
        featureFlags.map((f) => (
          <div key={f.key} style={styles.item}>
            <div>
              <strong>{f.key}</strong> — {f.enabled ? "ENABLED" : "DISABLED"}
            </div>
            {f.description && <div>{f.description}</div>}
            <button
              style={styles.smallButton}
              onClick={() => onToggleFlag?.(f.key)}
              disabled={!onToggleFlag}
            >
              Toggle
            </button>
          </div>
        ))
      ) : (
        <div style={styles.empty}>
          No flags passed. Wire <code>featureFlags</code> +{" "}
          <code>onToggleFlag</code> to your config store / DB.
        </div>
      )}
    </div>
  );

  const renderConfigPanel = () => (
    <div>
      <h3 style={styles.subHeader}>Config Editor</h3>
      <div style={styles.hint}>
        This edits whatever <code>config</code> object you pass in. Use carefully.
      </div>
      <textarea
        style={styles.textarea}
        value={configDraft}
        onChange={(e) => setConfigDraft(e.target.value)}
      />
      {configError && <div style={styles.error}>Error: {configError}</div>}
      <button
        style={styles.smallButton}
        onClick={handleConfigSave}
        disabled={!onConfigUpdate}
      >
        Save Config
      </button>
      {!onConfigUpdate && (
        <span style={styles.hint}>
          Wire <code>onConfigUpdate</code> to a tRPC mutation / config store.
        </span>
      )}
    </div>
  );

  const renderMaintenancePanel = () => (
    <div>
      <h3 style={styles.subHeader}>Maintenance / Jobs</h3>
      <div style={styles.hint}>
        These are labels. Wire them to real tRPC mutations / job triggers.
      </div>
      <div style={styles.maintenanceRow}>
        <button
          style={styles.smallButton}
          onClick={() => onRunMaintenanceJob?.("rebuild-search-index")}
          disabled={!onRunMaintenanceJob}
        >
          Rebuild Search Index
        </button>
        <button
          style={styles.smallButton}
          onClick={() =>
            onRunMaintenanceJob?.("recalculate-spaced-repetition")
          }
          disabled={!onRunMaintenanceJob}
        >
          Recalculate SM-2 Schedules
        </button>
        <button
          style={styles.smallButton}
          onClick={() => onRunMaintenanceJob?.("cleanup-orphaned-materials")}
          disabled={!onRunMaintenanceJob}
        >
          Cleanup Orphaned Materials
        </button>
      </div>
    </div>
  );

  const renderPanel = () => {
    switch (panel) {
      case "users":
        return renderUsersPanel();
      case "site":
        return renderSitePanel();
      case "functions":
        return renderFunctionsPanel();
      case "network":
        return renderNetworkPanel();
      case "security":
        return renderSecurityPanel();
      case "flags":
        return renderFlagsPanel();
      case "config":
        return renderConfigPanel();
      case "maintenance":
        return renderMaintenancePanel();
      default:
        return <div>Select a panel.</div>;
    }
  };

  return (
    <div style={styles.wrapper}>
      <button style={styles.toggle} onClick={() => setOpen(!open)}>
        {open ? "Close Dev Cockpit" : "Open Dev Cockpit"}
      </button>

      {open && (
        <div style={styles.panel}>
          <h2 style={styles.header}>Dev Cockpit</h2>

          <div style={styles.buttonRow}>
            <button style={styles.button} onClick={() => setPanel("users")}>
              Users
            </button>
            <button style={styles.button} onClick={() => setPanel("site")}>
              Site
            </button>
            <button style={styles.button} onClick={() => setPanel("functions")}>
              Functions
            </button>
            <button style={styles.button} onClick={() => setPanel("network")}>
              Network
            </button>
            <button style={styles.button} onClick={() => setPanel("security")}>
              Security
            </button>
            <button style={styles.button} onClick={() => setPanel("flags")}>
              Flags
            </button>
            <button style={styles.button} onClick={() => setPanel("config")}>
              Config
            </button>
            <button
              style={styles.button}
              onClick={() => setPanel("maintenance")}
            >
              Maintenance
            </button>
          </div>

          <div style={styles.output}>{renderPanel()}</div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, any> = {
  wrapper: {
    position: "fixed",
    bottom: 20,
    right: 20,
    zIndex: 9999,
    fontFamily: "monospace"
  },
  toggle: {
    padding: "10px 16px",
    background: "#222",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: 6,
    cursor: "pointer"
  },
  panel: {
    marginTop: 10,
    width: 420,
    background: "#111",
    color: "#eee",
    padding: 16,
    borderRadius: 8,
    border: "1px solid #333",
    boxShadow: "0 0 12px rgba(0,0,0,0.5)"
  },
  header: {
    margin: 0,
    marginBottom: 12,
    fontSize: 18,
    borderBottom: "1px solid #333",
    paddingBottom: 6
  },
  subHeader: {
    marginTop: 0,
    marginBottom: 8,
    fontSize: 16
  },
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12
  },
  button: {
    flex: "1 1 45%",
    padding: "8px 10px",
    background: "#333",
    color: "#fff",
    border: "1px solid #555",
    borderRadius: 4,
    cursor: "pointer"
  },
  output: {
    background: "#000",
    padding: 10,
    borderRadius: 6,
    minHeight: 180,
    border: "1px solid #333",
    overflowY: "auto",
    maxHeight: 360
  },
  item: {
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: "1px solid #222"
  },
  empty: {
    color: "#777",
    fontStyle: "italic"
  },
  hint: {
    marginLeft: 8,
    fontSize: 11,
    color: "#888"
  },
  toolbarRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8
  },
  userActions: {
    marginTop: 6,
    display: "flex",
    gap: 6
  },
  smallButton: {
    padding: "4px 8px",
    fontSize: 11,
    background: "#444",
    color: "#fff",
    border: "1px solid #666",
    borderRadius: 4,
    cursor: "pointer"
  },
  smallButtonDanger: {
    padding: "4px 8px",
    fontSize: 11,
    background: "#661111",
    color: "#fff",
    border: "1px solid #aa3333",
    borderRadius: 4,
    cursor: "pointer"
  },
  textarea: {
    width: "100%",
    minHeight: 140,
    background: "#000",
    color: "#eee",
    borderRadius: 4,
    border: "1px solid #333",
    fontFamily: "monospace",
    fontSize: 12,
    padding: 8,
    marginBottom: 8
  },
  error: {
    color: "#ff5555",
    fontSize: 12,
    marginBottom: 6
  },
  maintenanceRow: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginTop: 8
  }
};
