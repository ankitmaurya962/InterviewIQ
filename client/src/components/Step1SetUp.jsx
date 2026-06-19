import React, { useState } from "react";
import { FaUserTie, FaMicrophoneAlt, FaFileUpload } from "react-icons/fa";
import { TbDeviceAnalytics } from "react-icons/tb";
import { motion } from "framer-motion";
import axios from "axios";
import { serverURL } from "../App";

const Step1SetUp = ({ onStart }) => {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);

    const formdata = new FormData();
    formdata.append("resume", resumeFile);

    try {
      const result = await axios.post(
        serverURL + "/api/interview/resume",
        formdata,
        { withCredentials: true },
      );
      console.log(result.data);
      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
      setAnalyzing(false);
    } catch (error) {
      console.log(error);
      console.log(error.response?.data);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row"
    >
      {/* Left Section */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="lg:w-1/2 w-full p-8 bg-gradient-to-br from-green-50 to-green-100 flex flex-col gap-6"
      >
        <h2 className="text-3xl font-bold text-gray-800">
          Start Your AI Interview
        </h2>

        <p className="text-gray-600 leading-relaxed">
          Practice real interview scenarios powered by AI. Improve your
          communication, technical skills, and confidence with personalized
          feedback.
        </p>

        <div className="flex flex-col gap-4">
          {[
            {
              icon: <FaUserTie />,
              desc: "Choose Role & Experience",
            },
            {
              icon: <FaMicrophoneAlt />,
              desc: "Smart Voice Interview",
            },
            {
              icon: <TbDeviceAnalytics />,
              desc: "Performance Analytics",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.5 + index * 0.15,
              }}
              whileHover={{
                scale: 1.03,
                y: -4,
              }}
              className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-green-100"
            >
              <div className="text-green-600 text-2xl">{item.icon}</div>

              <p className="font-medium text-gray-700">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right Section */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="lg:w-1/2 w-full p-8 flex flex-col gap-5"
      >
        <h2 className="text-3xl font-bold text-gray-800">Interview Setup</h2>
        {/* Role */}
        <div className="relative">
          <FaUserTie className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Enter Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
          />
        </div>
        {/* Experience */}
        <div className="relative">
          <FaUserTie className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Experience (e.g. 2 years)"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
          />
        </div>
        {/* Interview Type */}
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500"
        >
          <option value="Technical">Technical Interview</option>
          <option value="HR">HR Interview</option>
        </select>
        {/* Resume Upload */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => document.getElementById("resumeUpload").click()}
          className="border-2 border-dashed border-green-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer bg-green-50"
        >
          <FaFileUpload className="text-4xl text-green-600" />

          <input
            type="file"
            accept="application/pdf"
            id="resumeUpload"
            className="hidden"
            onChange={(e) => setResumeFile(e.target.files[0])}
          />

          <p className="text-center text-gray-600">
            {resumeFile ? resumeFile.name : "Click to upload resume (Optional)"}
          </p>

          {resumeFile && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleUploadResume();
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-all"
            >
              {analyzing ? "Analyzing..." : "Analyze Resume"}
            </motion.button>
          )}
        </motion.div>
        {/* Resume Analysis Result */}
        {analysisDone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Resume Analysis Result
            </h3>

            {/* Projects */}
            {projects.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Projects:</h4>

                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  {projects.map((project, index) => (
                    <li key={index}>{project}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Skills:</h4>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
        {/* Start Interview */}
        <motion.button
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.95,
          }}
          className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold"
        >
          Start Interview
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Step1SetUp;
