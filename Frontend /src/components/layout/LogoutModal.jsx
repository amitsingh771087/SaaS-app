import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function LogoutModal({ onClose }) {
  const { logout } = useAuth();

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-2xl bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-xl p-6 w-80 shadow-lg text-center"
      >
        <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
        <p className="mb-6">Are you sure you want to logout?</p>
        <div className="flex justify-around gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}
