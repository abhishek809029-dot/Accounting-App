import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../GlobalCSS/Layout.css";
import CategoryMaster from "../Accounts/CategoryMaster";
import ReasonMaster from "../Accounts/ReasonMaster";
import PaymentTypeMaster from "../Accounts/PaymentTypeMaster";
import AccountEntry from "../Accounts/AccountEntry";
import Dashboard from "../Accounts/Dashboard";
import ExcelImport from "../Accounts/ExcelImport";
import SundryDebtor from "../Accounts/SundryDebtor";
import BalanceSheet from "../Accounts/BalanceSheet";
import RemoveMonthData from "../Accounts/RemoveMonthData";

const menuConfig = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "bi-house-door",
    component: <Dashboard />,
  },
  {
    id: "balanceSheet",
    title: "Balance Sheet",
    icon: "bi-house-door",
    component: <BalanceSheet />,
  },
  {
    id: "sundryDebtor",
    title: "Sundry Debtor",
    icon: "bi-house-door",
    component: <SundryDebtor />,
  },
  {
    id: "accountEntry",
    title: "Account Entry",
    icon: "bi-house-door",
    component: <AccountEntry />,
  },
  {
    id: "excelImport",
    title: "Excel Import",
    icon: "bi-house-door",
    component: <ExcelImport />,
  },
  {
    id: "removeMonthData",
    title: "Remove Month Data",
    icon: "bi-house-door",
    component: <RemoveMonthData />,
  },
  {
    id: "categoryMaster",
    title: "Category Master",
    icon: "bi-house-door",
    component: <CategoryMaster />,
  },
  {
    id: "reasonMaster",
    title: "Reason Master",
    icon: "bi-house-door",
    component: <ReasonMaster />,
  },
  {
    id: "paymentTypeMaster",
    title: "Payment Type Master",
    icon: "bi-house-door",
    component: <PaymentTypeMaster />,
  },
];

const Layout = () => {
  const [openPages, setOpenPages] = useState([]);
  const [activePageId, setActivePageId] = useState(null);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [UserName,setUserName] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  let uname = sessionStorage.getItem("UserName");
  if(uname)
  {
setUserName(uname);
  }
  else
  {
    navigate("/");
  }
},[]);

  const findMenuItem = (id, items = menuConfig) => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.submenu) {
        const found = findMenuItem(id, item.submenu);
        if (found) return found;
      }
      if (item.subChild) {
        const found = findMenuItem(id, item.subChild);
        if (found) return found;
      }
    }
    return null;
  };

  const toggleSubmenu = (menuId, e) => {
    e.stopPropagation();
    setExpandedMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  const openPage = (id, title, icon) => {
    if (!openPages.find((p) => p.id === id)) {
      setOpenPages([...openPages, { id, title, icon }]);
    }
    setActivePageId(id);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const closePage = (id, e) => {
    e.stopPropagation();
    const updatedPages = openPages.filter((p) => p.id !== id);
    setOpenPages(updatedPages);
    if (activePageId === id) {
      setActivePageId(
        updatedPages.length > 0
          ? updatedPages[updatedPages.length - 1].id
          : null,
      );
    }
  };

  const activeMenuObj = findMenuItem(activePageId);

  return (
    <div
      className={`admin-wrapper ${isSidebarOpen ? "sidebar-mobile-open" : ""}`}
    >
      {isSidebarOpen && (
        <div
          className="sidebar-overlay d-md-none"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <nav id="sidebar" className={isSidebarOpen ? "show" : ""}>
        <div className="sidebar-header">
          <i className="bi bi-grid-1x2-fill text-primary"></i>
          <span className="ms-2">ACCOUNTING</span>
        </div>

        <div className="sidebar-menu-list">
          {menuConfig.map((menu) => (
            <div key={menu.id}>
              <button
                className={`menu-item ${
                  activePageId === menu.id ? "active-link" : ""
                } justify-content-between`}
                onClick={(e) =>
                  menu.submenu
                    ? toggleSubmenu(menu.id, e)
                    : openPage(menu.id, menu.title, menu.icon)
                }
              >
                <div className="d-flex align-items-center gap-3">
                  <i className={`bi ${menu.icon}`}></i>
                  <span>{menu.title}</span>
                </div>
                {menu.submenu && (
                  <i
                    className={`bi bi-chevron-right arrow ${
                      expandedMenus[menu.id] ? "rotate" : ""
                    }`}
                  ></i>
                )}
              </button>

              {menu.submenu && expandedMenus[menu.id] && (
                <div className="submenu">
                  {menu.submenu.map((sub) => (
                    <div key={sub.id}>
                      <button
                        className={`menu-item ps-4 ${
                          activePageId === sub.id ? "active-link" : ""
                        } justify-content-between`}
                        onClick={(e) =>
                          sub.subChild
                            ? toggleSubmenu(sub.id, e)
                            : openPage(sub.id, sub.title, sub.icon)
                        }
                      >
                        <div className="d-flex align-items-center gap-3">
                          <i className={`bi ${sub.icon}`}></i>
                          <span>{sub.title}</span>
                        </div>
                        {sub.subChild && (
                          <i
                            className={`bi bi-chevron-right arrow ${
                              expandedMenus[sub.id] ? "rotate" : ""
                            }`}
                          ></i>
                        )}
                      </button>

                      {sub.subChild && expandedMenus[sub.id] && (
                        <div className="submenu sub-child">
                          {sub.subChild.map((child) => (
                            <button
                              key={child.id}
                              className={`menu-item ps-5 ${
                                activePageId === child.id ? "active-link" : ""
                              }`}
                              onClick={() =>
                                openPage(child.id, child.title, child.icon)
                              }
                            >
                              <span>{child.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main id="main-content">
        <header className="top-navbar">
          <div className="header-left">
            <button
              className="mobile-toggle d-md-none"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
          <div className="header-center">
            {/* <div className="header-title">MANAGEMENT CONSOLE</div> */}
          </div>
          <div className="header-right">
            <div className="user-info">
              {/* <div
                class="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center"
                style={{ width: "26px", height: "26px" }}
              >
                AT
              </div> */}
              <img
                src={`https://ui-avatars.com/api/?name=${sessionStorage.getItem("ShortName")}&background=3b82f6&color=fff`}
                alt="user"
              />
              <span className="user-name">{UserName}</span>
            </div>
            <button className="logout-btn" onClick={() => {navigate("/");sessionStorage.setItem("UserName", "");}}>
              <i className="bi bi-box-arrow-right logout-icon"></i>
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </header>

        <div className="tabs-bar">
          {openPages.map((page) => (
            <div
              key={page.id}
              className={`tab-item ${activePageId === page.id ? "active" : ""}`}
              onClick={() => setActivePageId(page.id)}
            >
              <span>{page.title}</span>
              <i
                className="bi bi-x ms-2"
                onClick={(e) => closePage(page.id, e)}
              ></i>
            </div>
          ))}
        </div>

        <div className="content-body">
          {activePageId && activeMenuObj ? (
            <div className="active-page-content">
              {/* This dynamically renders the component assigned in menuConfig */}
              {activeMenuObj.component}
            </div>
          ) : (
            <div className="empty-state text-center mt-5">
              <i className="bi bi-files fs-1 text-muted"></i>
              {/* <h4>Welcome to Nexus</h4> */}
              <p>Select a menu item from the sidebar to open a page.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Layout;
