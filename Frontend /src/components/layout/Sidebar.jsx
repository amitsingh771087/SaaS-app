import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaBox } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/", label: "Dashboard", icon: <FaTachometerAlt /> },
  { path: "/customers", label: "Customers", icon: <FaUsers /> },
  { path: "/items", label: "Items", icon: <FaBox /> },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 text-gray-800 border-r border-gray-300 flex-col">
        <nav className="flex-1 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 mb-2 rounded-lg transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 ${
                  isActive ? "bg-blue-100 text-blue-700 font-semibold" : ""
                }`
              }
            >
              <span className="mr-3">{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed z-40 w-64 h-full bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 text-gray-800 border-r border-gray-300 flex flex-col md:hidden shadow-lg"
          >
            <nav className="flex-1 mt-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={toggleSidebar} // close sidebar on click
                  className={({ isActive }) =>
                    `flex items-center px-6 py-3 mb-2 rounded-lg transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 ${
                      isActive ? "bg-blue-100 text-blue-700 font-semibold" : ""
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span> {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
