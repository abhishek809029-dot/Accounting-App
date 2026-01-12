import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  Search, 
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

const TopControl = () => {
  const [lastAction, setLastAction] = useState('');

  const handleAction = (action) => {
    setLastAction(action);
    console.log(`Action triggered: ${action}`);
    setTimeout(() => setLastAction(''), 3000);
  };

  const controls = [
    { id: 'add', label: 'Add New', icon: <Plus size={16} />, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
    { id: 'edit', label: 'Edit', icon: <Edit3 size={16} />, color: '#d97706', bg: '#fffbeb', border: '#fef3c7' },
    { id: 'delete', label: 'Delete', icon: <Trash2 size={16} />, color: '#dc2626', bg: '#fef2f2', border: '#fee2e2' },
    { id: 'save', label: 'Save', icon: <Save size={16} />, color: '#16a34a', bg: '#f0fdf4', border: '#dcfce7' },
    { id: 'find', label: 'Search', icon: <Search size={16} />, color: '#7c3aed', bg: '#f5f3ff', border: '#ede9fe' },
    { id: 'refresh', label: 'Refresh', icon: <RefreshCw size={16} />, color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' },
  ];

  return (
    <div className="toolbar-container sticky-top">
      <div className="container-fluid px-2 px-md-4 py-2 bg-white border-bottom shadow-sm">
        {/* Responsiveness Strategy:
            - d-flex flex-nowrap: Keeps buttons in a single line.
            - overflow-x-auto: Allows swiping on mobile.
            - justify-content-md-start / justify-content-between: Spacing adapts to screen width.
        */}
        <div className="d-flex flex-nowrap align-items-center justify-content-start gap-2 overflow-x-auto no-scrollbar pb-1 pb-md-0">
          {controls.map((item) => (
            <button
              key={item.id}
              onClick={() => handleAction(item.label)}
              className="btn-colorful-action d-flex align-items-center gap-2 px-2 px-md-3 py-2 transition-all flex-shrink-0"
              style={{ 
                '--icon-color': item.color, 
                '--bg-soft': item.bg,
                '--border-color': item.border
              }}
            >
              <span className="icon-box d-flex align-items-center justify-content-center">
                {item.icon}
              </span>
              {/* Labels show on Tablet (md) and up, hide on Mobile (sm) */}
              <span className="label-text d-none d-md-inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Modern Toast Notification */}
      {lastAction && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1060 }}>
          <div className="toast show align-items-center text-white bg-dark border-0 shadow-lg" role="alert">
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center gap-2">
                <CheckCircle2 size={18} className="text-success" />
                <span>{lastAction} triggered</span>
              </div>
              <button 
                type="button" 
                className="btn-close btn-close-white me-2 m-auto" 
                onClick={() => setLastAction('')}
              ></button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        
        .toolbar-container {
          font-family: 'Inter', sans-serif;
        }

        /* Hide scrollbar but keep functionality */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { 
          -ms-overflow-style: none; 
          scrollbar-width: none; 
          -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
        }

        .btn-colorful-action {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .icon-box {
          color: var(--icon-color);
          background: var(--bg-soft);
          padding: 8px; /* Slightly larger for touch */
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        @media (max-width: 768px) {
           .btn-colorful-action {
              padding: 6px !important;
              border-radius: 12px;
           }
           .icon-box {
              padding: 10px; /* Larger hit area for mobile fingers */
           }
        }

        .btn-colorful-action:hover {
          background: var(--bg-soft);
          border-color: var(--border-color);
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .btn-colorful-action:hover .icon-box {
          background: #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .btn-colorful-action:active {
          transform: translateY(0);
          filter: brightness(0.95);
        }

        .label-text {
          color: #475569;
        }
      `}</style>
    </div>
  );
};

const TopControl1 = () => {
  return (
    <div className="min-vh-100 bg-light">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      />
      
      <TopControl />
      
      <main className="p-3 p-md-4 container">
        <div className="card border-0 shadow-sm p-4 p-md-5 bg-white" style={{ borderRadius: '20px' }}>
          <div className="d-flex flex-column align-items-center text-center">
            <h2 className="fw-bold text-dark mb-3">Responsive Dashboard</h2>
            <p className="text-muted" style={{ maxWidth: '500px' }}>
              Resize your browser or check on mobile. The toolbar labels hide on small screens to save space, 
              and the row becomes a swappable "carousel" if the screen is too narrow.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TopControl1;