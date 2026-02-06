import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, Database, X } from "lucide-react";

export default function Find({ data = [], title = "", onClose, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => searchInputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = useMemo(() => {
    const low = searchTerm.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(low),
      ),
    );
  }, [data, searchTerm]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    if (filteredData.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredData.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (prev) => (prev - 1 + filteredData.length) % filteredData.length,
      );
    } else if (e.key === "Enter") {
      onSelect(filteredData[activeIndex]);
    }
  };

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter((key) => key.toLowerCase() !== "code");
  }, [data]);

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div
          className="modal-content shadow-lg border-0"
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="modal-header bg-light">
            <h5 className="modal-title d-flex align-items-center gap-2 fw-bold text-secondary">
              <Database size={20} className="text-primary" /> {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          {/* Search Bar */}
          <div className="modal-body border-bottom p-3">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Search size={18} className="text-muted" />
              </span>
              <input
                ref={searchInputRef}
                type="text"
                className="form-control bg-light border-start-0 shadow-none"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setActiveIndex(0);
                }}
              />
            </div>
          </div>

          {/* Table Area */}
          <div
            className="modal-body p-0"
            style={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            <table className="table table-hover mb-0">
              <thead className="table-light sticky-top">
                <tr>
                  {columns.map((c) => (
                    <th
                      key={c}
                      className="text-uppercase small fw-bold text-muted px-4 py-3"
                      style={{ fontSize: "0.75rem", letterSpacing: "0.05rem" }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onSelect(item)}
                    className={`align-middle cursor-pointer ${idx === activeIndex ? "table-primary" : ""}`}
                    style={{ cursor: "pointer" }}
                  >
                    {columns.map((c) => (
                      <td key={c} className="px-4 py-3 text-secondary">
                        {/* {c === "name" ? (
                          <strong className="text-dark">{item[c]}</strong>
                        ) : (
                          item[c]
                        )} */}
                        {item[c]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length === 0 && (
              <div className="p-5 text-center text-muted">
                No records found.
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Backdrop click to close */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ zIndex: -1 }}
        onClick={onClose}
      />
    </div>
  );
}
