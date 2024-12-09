import React from "react";
import SideNav from "../../components/admin/Sidenav";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <SideNav />

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;