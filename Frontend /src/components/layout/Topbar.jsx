import { useAuth } from "../../context/AuthContext";

export default function Topbar({ openLogoutModal, toggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 shadow px-4 md:px-6 py-3 flex justify-between items-center w-full">
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <button
          className="md:hidden bg-blue-300 p-2 rounded-md"
          onClick={toggleSidebar}
        >
          ☰
        </button>
        <span className="font-bold text-lg text-blue-700">Tenant Switcher</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-700">{user?.email}</span>
        <button
          onClick={openLogoutModal}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
