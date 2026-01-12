import React, { useState, useEffect } from 'react';

/**
 * TopControl Component
 * A responsive toolbar featuring Add, Edit, Delete, Save, Find, and Refresh actions.
 * Built with React, Bootstrap 5, and Material Icons.
 */

const ToolbarButton = ({ icon, label, colorClass, statusClass, onClick }) => (
  <button 
    className="btn d-flex flex-column align-items-center justify-content-center border-0 rounded-3 p-2 mx-1 transition-all"
    style={{ minWidth: '70px', backgroundColor: 'transparent' }}
    onClick={() => onClick(label, statusClass)}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
  >
    {/* Material Icon element */}
    <span className={`material-icons ${colorClass}`} style={{ fontSize: '1.8rem' }}>
      {icon}
    </span>
    <span className="fw-bold text-uppercase mt-1" style={{ fontSize: '0.7rem', letterSpacing: '-0.01em', color: '#495057' }}>
      {label}
    </span>
  </button>
);

const TopControl = () => {
  const [status, setStatus] = useState({ 
    text: 'Ready', 
    className: 'text-secondary' 
  });

  // Inject Bootstrap 5 and Google Material Icons via CDN
  useEffect(() => {
    // Bootstrap CSS
    const bootstrapLink = document.createElement('link');
    bootstrapLink.rel = 'stylesheet';
    bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';
    document.head.appendChild(bootstrapLink);

    // Material Icons
    const materialLink = document.createElement('link');
    materialLink.rel = 'stylesheet';
    materialLink.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    document.head.appendChild(materialLink);

    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      .color-add { color: #2e7d32 !important; }      /* Material Green */
      .color-edit { color: #ed6c02 !important; }     /* Material Orange */
      .color-delete { color: #d32f2f !important; }   /* Material Red */
      .color-save { color: #1976d2 !important; }     /* Material Blue */
      .color-find { color: #9c27b0 !important; }     /* Material Purple */
      .color-refresh { color: #00897b !important; }  /* Material Teal */
      
      .material-icons {
        transition: transform 0.2s ease;
      }
      .btn:hover .material-icons {
        transform: scale(1.1);
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(bootstrapLink);
      document.head.removeChild(materialLink);
      document.head.removeChild(styleTag);
    };
  }, []);

  const handleAction = (action, colorClass) => {
    setStatus({ 
      text: `Active Command: ${action}`, 
      className: colorClass 
    });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-center">
        <div className="bg-white border rounded-4 p-2 d-inline-flex align-items-center shadow-sm flex-wrap">
          
          <ToolbarButton 
            icon="add_circle" 
            label="Add" 
            colorClass="color-add" 
            statusClass="text-success"
            onClick={handleAction} 
          />
          
          <ToolbarButton 
            icon="edit" 
            label="Edit" 
            colorClass="color-edit" 
            statusClass="text-warning"
            onClick={handleAction} 
          />
          
          <ToolbarButton 
            icon="delete_forever" 
            label="Delete" 
            colorClass="color-delete" 
            statusClass="text-danger"
            onClick={handleAction} 
          />

          {/* Vertical Divider */}
          <div className="vr mx-2 my-auto" style={{ height: '40px', opacity: 0.2 }}></div>

          <ToolbarButton 
            icon="save" 
            label="Save" 
            colorClass="color-save" 
            statusClass="text-primary"
            onClick={handleAction} 
          />

          <ToolbarButton 
            icon="search" 
            label="Find" 
            colorClass="color-find" 
            statusClass="text-dark"
            onClick={handleAction} 
          />

          <ToolbarButton 
            icon="refresh" 
            label="Refresh" 
            colorClass="color-refresh" 
            statusClass="text-success"
            onClick={handleAction} 
          />

        </div>
      </div>

      {/* Action Feedback Area */}
      <div className="mt-4 p-5 bg-white rounded-4 border shadow-sm text-center">
        <h2 className={`fw-bold ${status.className}`}>
          {status.text}
        </h2>
        <p className="text-muted small mb-0">React TopControl Component with Material Icons</p>
      </div>
    </div>
  );
};

export default TopControl;