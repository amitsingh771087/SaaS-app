import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import LogoutModal from "./LogoutModal";

export default function Layout() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex flex-col h-screen">
      {/* Topbar */}
      <Topbar openLogoutModal={openLogoutModal} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50 h-full">
          <Outlet />
        </main>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && <LogoutModal onClose={closeLogoutModal} />}
    </div>
  );
}
