import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../App";
import { IoArrowBack } from "react-icons/io5";

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getInterviews = async () => {
      try {
        const result = await axios.get(
          serverURL + "/api/interview/get-interview",
          {
            withCredentials: true,
          },
        );

        setInterviews(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    getInterviews();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#eef8f5] px-4 md:px-8 py-10"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <button
            onClick={() => navigate("/interview")}
            className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50 transition"
          >
            <IoArrowBack size={18} />
          </button>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Interview History
            </h1>

            <p className="text-gray-500 mt-1">
              View all your completed interviews and reports
            </p>
          </div>
        </motion.div>

        {interviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <h2 className="text-2xl font-semibold text-gray-700">
              No Interviews Found
            </h2>

            <p className="text-gray-500 mt-2">
              Start your first interview to see history here.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {interviews.map((interview, index) => (
              <motion.div
                key={interview._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                }}
                whileHover={{
                  scale: 1.015,
                  y: -4,
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/report/${interview._id}`)}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  {/* Left Section */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 capitalize">
                      {interview.role}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      {interview.experience} • {interview.mode}
                    </p>

                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <motion.h3
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 180,
                          delay: index * 0.08 + 0.2,
                        }}
                        className="text-3xl font-bold text-emerald-500"
                      >
                        {interview.finalScore || 0}/10
                      </motion.h3>

                      <p className="text-xs text-gray-400">Overall Score</p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        interview.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {interview.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default InterviewHistory;
