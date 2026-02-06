import React from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  Search,
  RefreshCw,
  XCircle,
} from "lucide-react";

const TopControl = ({ enabledButtons, onAction }) => {
  const handleButtonClick = (item) => {
    if (onAction) onAction(item.id);
  };

  const controls = [
    {
      id: "add",
      label: "Add",
      icon: <Plus size={14} />,
      color: "#2563eb",
      bg: "#eff6ff",
      border: "#bfdbfe",
    },
    {
      id: "edit",
      label: "Edit",
      icon: <Edit3 size={14} />,
      color: "#d97706",
      bg: "#fffbeb",
      border: "#fef3c7",
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 size={14} />,
      color: "#dc2626",
      bg: "#fef2f2",
      border: "#fee2e2",
    },
    {
      id: "save",
      label: "Save",
      icon: <Save size={14} />,
      color: "#16a34a",
      bg: "#f0fdf4",
      border: "#dcfce7",
    },
    {
      id: "find",
      label: "Search",
      icon: <Search size={14} />,
      color: "#7c3aed",
      bg: "#f5f3ff",
      border: "#ede9fe",
    },
    {
      id: "cancel",
      label: "Cancel",
      icon: <XCircle size={14} />,
      color: "#64748b",
      bg: "#f8fafc",
      border: "#e2e8f0",
    },
    {
      id: "refresh",
      label: "Refresh",
      icon: <RefreshCw size={14} />,
      color: "#475569",
      bg: "#f1f5f9",
      border: "#e2e8f0",
    },
  ];

  return (
    <div
      className="toolbar-container sticky-top"
      style={{ backgroundColor: "#f5f5f5 !important" }}
    >
      <div className="container-fluid px-2 py-1 border-bottom shadow-sm">
        <div className="d-flex flex-nowrap align-items-center justify-content-start gap-2 overflow-x-auto no-scrollbar">
          {controls.map((item) => {
            const isEnabled = enabledButtons.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => isEnabled && handleButtonClick(item)}
                disabled={!isEnabled}
                className={`btn-colorful-action d-flex align-items-center gap-2 px-2 px-md-3 py-1 transition-all flex-shrink-0 ${!isEnabled ? "disabled-btn" : ""}`}
                style={{
                  "--icon-color": item.color,
                  "--bg-soft": item.bg,
                  "--border-color": item.border,
                }}
              >
                <span className="icon-box d-flex align-items-center justify-content-center">
                  {item.icon}
                </span>
                <span className="label-text d-none d-md-inline">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .btn-colorful-action {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
        }

        .disabled-btn {
          opacity: 0.3;
          cursor: not-allowed !important;
          filter: grayscale(1);
          pointer-events: none;
        }

        .icon-box {
          color: var(--icon-color);
          background: var(--bg-soft);
          padding: 4px;
          border-radius: 6px;
        }

        .btn-colorful-action:not(.disabled-btn):hover {
          background: var(--bg-soft);
          border-color: var(--border-color);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default TopControl;
