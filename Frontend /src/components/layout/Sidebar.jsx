import { NavLink } from "react-router-dom";

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/customers", label: "Customers" },
  { path: "/items", label: "Items" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 text-gray-800 border-r border-gray-300 flex flex-col">
      {/* <div className="p-6 text-2xl font-bold text-center text-blue-700">
        My SaaS
      </div> */}

      <nav className="flex-1 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-6 py-3 mb-2 rounded-lg transition-colors hover:bg-blue-100 hover:text-blue-700 ${
                isActive ? "bg-blue-100 text-blue-700 font-semibold" : ""
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
