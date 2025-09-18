import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomerTimeline() {
  const { id } = useParams();
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    setTimeline([
      {
        id: 1,
        event_type: "created",
        content: "Customer created",
        date: "2025-09-18",
      },
      {
        id: 2,
        event_type: "updated",
        content: "Email updated",
        date: "2025-09-19",
      },
      {
        id: 3,
        event_type: "note",
        content: "Follow-up scheduled",
        date: "2025-09-20",
      },
    ]);
  }, [id]);

  return (
    <motion.div
      className="p-8 bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-extrabold text-blue-700 mb-8">
        Timeline for Customer #{id}
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <ul className="relative border-l-4 border-blue-600">
          {timeline.map((event, idx) => (
            <motion.li
              key={event.id}
              className="mb-10 ml-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full ring-4 ring-white"></span>
              <p className="text-sm text-gray-500">{event.date}</p>
              <p className="font-semibold capitalize">{event.event_type}</p>
              <p className="text-gray-700">{event.content}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
