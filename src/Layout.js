import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Avatar,
  Button,
  Tab,
  Tabs,
  Divider,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashIcon,
  BarChart as ChartIcon,
  Inventory as BoxIcon,
  Warehouse as BuildingIcon,
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

// --- Menu Configuration Array ---
const menuConfig = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <DashIcon />,
  },
  {
    id: "reports",
    title: "Reports",
    icon: <ChartIcon />,
    children: [
      {
        id: "sales",
        title: "Sales Report",
        icon: <ChartIcon />,
      },
      {
        id: "inventory",
        title: "Inventory",
        icon: <BoxIcon />,
        children: [
          {
            id: "stock",
            title: "Stock Levels",
            icon: <BoxIcon />,
          },
          {
            id: "warehouse",
            title: "Warehouse",
            icon: <BuildingIcon />,
            children: [
              {
                id: "north",
                title: "North Wing",
                icon: <BuildingIcon />,
              },
            ],
          },
        ],
      },
    ],
  },
];

const theme = createTheme({
  palette: {
    primary: { main: "#3b82f6" },
    background: { default: "#f8fafc" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 8 },
      },
    },
  },
});

const drawerWidth = 280;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [openPages, setOpenPages] = useState([]);
  const [activeTab, setActiveTab] = useState(false);

  const handleToggleMenu = (menuId) => {
    setOpenMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  const handleOpenPage = (id, title, icon) => {
    if (!openPages.find((p) => p.id === id)) {
      setOpenPages([...openPages, { id, title, icon }]);
    }
    setActiveTab(id);
    setMobileOpen(false);
  };

  const handleCloseTab = (e, id) => {
    e.stopPropagation();
    const newPages = openPages.filter((p) => p.id !== id);
    setOpenPages(newPages);
    if (activeTab === id) {
      setActiveTab(newPages.length > 0 ? newPages[newPages.length - 1].id : false);
    }
  };

  const renderMenuItems = (items, level = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openMenus[item.id];

      return (
        <React.Fragment key={item.id}>
          <ListItemButton
            selected={activeTab === item.id}
            onClick={() => {
              if (hasChildren) {
                handleToggleMenu(item.id);
              } else {
                handleOpenPage(item.id, item.title, item.icon);
              }
            }}
            sx={{
              pl: level * 2 + 2,
              mx: 1,
              mb: 0.5,
              borderRadius: 1,
              "&.Mui-selected": {
                bgcolor: "#3b82f6",
                color: "white",
                "& .MuiListItemIcon-root": { color: "white" },
              },
              "&:hover": {
                bgcolor: activeTab === item.id ? "#3b82f6" : "#334155",
                color: "white",
                "& .MuiListItemIcon-root": { color: "white" },
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.title} />
            {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>

          {hasChildren && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderMenuItems(item.children, level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  const drawerContent = (
    <Box sx={{ bgcolor: "#1e293b", color: "#94a3b8", height: "100%" }}>
      <Toolbar sx={{ bgcolor: "rgba(0,0,0,0.1)", mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <DashIcon sx={{ color: "#3b82f6" }} /> ABHISHEK TIWARI
        </Typography>
      </Toolbar>

      <List component="nav">
        {renderMenuItems(menuConfig)}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{
            width: { lg: `calc(100% - ${drawerWidth}px)` },
            ml: { lg: `${drawerWidth}px` },
            bgcolor: "white",
            color: "text.primary",
            boxShadow: "none",
            borderBottom: "1px solid #e2e8f0",
            // Correcting Z-Index: Header stays below mobile drawer but above desktop background
            zIndex: (theme) => theme.zIndex.drawer - 1,
            // Exception: On desktop, the header must be above the permanent drawer
            // but we usually want the Drawer to be the top-most layer on mobile.
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", position: "relative" }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 2, display: { lg: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                letterSpacing: 1.2,
                color: "#64748b",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              ACCOUNTING APPLICATION
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: "auto" }}>
              <Box sx={{ textAlign: "right", display: { xs: "none", md: "block" } }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Abhishek
                </Typography>
              </Box>
              <Avatar
                src="https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff"
                sx={{ width: 36, height: 36, border: "2px solid #e2e8f0" }}
              />
              <Divider orientation="vertical" flexItem sx={{ my: 1.5 }} />
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<LogoutIcon />}
                sx={{ borderColor: "#e2e8f0" }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>

          <Box sx={{ bgcolor: "#f1f5f9", px: 2, pt: 1 }}>
            <Tabs
              value={activeTab}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 40,
                "& .MuiTabs-indicator": { display: "none" },
                "& .MuiTab-root": {
                  minHeight: 40,
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                },
              }}
            >
              {openPages.map((page) => (
                <Tab
                  key={page.id}
                  value={page.id}
                  onClick={() => setActiveTab(page.id)}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {page.title}
                      <Box
                        component="span"
                        onClick={(e) => handleCloseTab(e, page.id)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          p: 0.5,
                          ml: 0.5,
                          borderRadius: "50%",
                          color: activeTab === page.id ? "#3b82f6" : "#94a3b8",
                          "&:hover": { color: "#ef4444", bgcolor: "rgba(0,0,0,0.04)" },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </Box>
                    </Box>
                  }
                  sx={{
                    bgcolor: activeTab === page.id ? "white" : "#e2e8f0",
                    color: activeTab === page.id ? "#1e293b !important" : "#64748b",
                    borderRadius: "8px 8px 0 0",
                    mr: 0.5,
                    border: "1px solid",
                    borderColor: activeTab === page.id ? "#e2e8f0" : "transparent",
                    borderBottom: "none",
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </Tabs>
          </Box>
        </AppBar>

        <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
          {/* Mobile Drawer: Needs a higher z-index (default is usually 1200) */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", lg: "none" },
              "& .MuiDrawer-paper": { 
                width: drawerWidth, 
                border: "none",
                zIndex: (theme) => theme.zIndex.drawer + 2 
              },
            }}
          >
            {drawerContent}
          </Drawer>
          {/* Permanent Drawer for Desktop */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", lg: "block" },
              "& .MuiDrawer-paper": { 
                width: drawerWidth, 
                border: "none",
                boxSizing: 'border-box'
              },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        </Box>

        <Box component="main" sx={{ flexGrow: 1, p: 4, mt: "115px", minHeight: "100vh", bgcolor: "#f8fafc" }}>
          {openPages.length === 0 ? (
            <Box sx={{ height: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
              <BoxIcon sx={{ fontSize: 80, mb: 2, opacity: 0.2 }} />
              <Typography variant="body1">Select a menu item from the sidebar to start your session.</Typography>
            </Box>
          ) : (
            openPages.map((page) => (
              <Box key={page.id} sx={{ display: activeTab === page.id ? "block" : "none" }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: "#1e293b" }}>
                    {page.title}
                  </Typography>
                  <Divider />
                </Box>
                <Box sx={{ bgcolor: "white", p: 4, borderRadius: 3, boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" }}>
                  <Typography variant="body1" color="text.secondary">
                    This is the dynamic workspace for <strong>{page.title}</strong>.
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;