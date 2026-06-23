import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { IoSparklesSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthModel from "../components/AuthModel";
import { BsRobot, BsMic, BsClock } from "react-icons/bs";
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import { BsBarChart, BsFileEarmarkText } from "react-icons/bs";
import Footer from "../components/Footer";

function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f8f9fb]">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center pt-8 pb-20 px-6 text-center">
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-md mb-8">
            <IoSparklesSharp className="text-black" />
            <p className="text-sm font-medium text-gray-600">
              AI Powered Smart Interview Platform
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-3"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900">
              Practice Interviews
            </h1>

            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="text-black">With AI</span>{" "}
              <span className="text-green-600">Intelligence</span>
            </h1>
          </motion.div>

          <p className="max-w-2xl text-gray-500 mt-8 text-lg leading-relaxed">
            Role-based interviews with smart follow-ups, adaptive difficulty,
            real-time performance evaluation, and personalized feedback powered
            by AI.
          </p>

          <div className="flex gap-4 mt-10">
            <motion.button
              className="px-7 py-3 bg-black text-white rounded-xl font-medium shadow-lg hover:bg-gray-800 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate("/interview");
              }}
            >
              Start Interview
            </motion.button>

            <motion.button
              className="px-7 py-3 bg-white text-gray-800 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate("/history");
              }}
            >
              View History
            </motion.button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-14">
            {[
              {
                icon: <BsRobot />,
                step: "Step 1",
                title: "Role and Experience Selection",
                desc: "AI adjusts difficulty based on selected job role.",
              },
              {
                icon: <BsMic />,
                step: "Step 2",
                title: "Smart Voice Interview",
                desc: "Dynamic follow-up questions based on your answers.",
              },
              {
                icon: <BsClock />,
                step: "Step 3",
                title: "Timer Based Simulation",
                desc: "Real interview pressure with time tracking.",
              },
            ].map((moveItem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.2,
                }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                }}
                className={`relative w-[320px] pt-12 bg-white rounded-3xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border border-green-500
        ${
          index === 0
            ? "-rotate-6 hover:rotate-0"
            : index === 1
              ? "rotate-0"
              : "rotate-6 hover:rotate-0"
        }
      `}
              >
                <div className="absolute -top-7 left-1/2 w-14 h-14 rounded-2xl bg-white border border-green-500 text-green-500 flex items-center justify-center text-2xl mb-6">
                  {moveItem.icon}
                </div>

                <p className="text-sm font-semibold text-gray-500 mb-2">
                  {moveItem.step}
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {moveItem.title}
                </h3>

                <p className="text-gray-500 leading-relaxed">{moveItem.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="w-full mt-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-bold text-center mb-6 text-gray-900"
            >
              Advanced AI <span className="text-green-600">Capabilities</span>
            </motion.h2>

            <p className="text-lg text-gray-500 max-w-2xl mx-auto text-center mb-16">
              Powerful AI features designed to simulate real interviews,
              evaluate responses, and accelerate your preparation.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  image: evalImg,
                  icon: <BsBarChart size={22} />,
                  title: "AI Answer Evaluation",
                  desc: "Scores communication, technical accuracy and confidence.",
                },
                {
                  image: resumeImg,
                  icon: <BsFileEarmarkText size={22} />,
                  title: "Resume Based Interview",
                  desc: "Project-specific questions based on uploaded resume.",
                },
                {
                  image: pdfImg,
                  icon: <BsFileEarmarkText size={22} />,
                  title: "Downloadable PDF Report",
                  desc: "Detailed strengths, weaknesses and improvement insights.",
                },
                {
                  image: analyticsImg,
                  icon: <BsBarChart size={22} />,
                  title: "History & Analytics",
                  desc: "Track progress with performance graphs and topic analysis.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                  className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-40 h-40 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="text-left">
                      <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
                        {item.icon}
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {item.title}
                      </h3>

                      <p className="text-gray-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl font-bold text-center mb-16 mt-32"
          >
            Multiple Interview <span className="text-green-500">Modes</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                image: hrImg,
                title: "HR Interview Mode",
                desc: "Behavioral and communication based evaluation.",
              },
              {
                image: techImg,
                title: "Technical Mode",
                desc: "Deep technical questioning based on selected role.",
              },
              {
                image: confidenceImg,
                title: "Confidence Detection",
                desc: "Basic tone and voice analysis insights.",
              },
              {
                image: creditImg,
                title: "Credits System",
                desc: "Unlock premium interview sessions easily.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                }}
                whileHover={{
                  y: -4,
                }}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 px-6 py-5"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left max-w-[65%]">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      </div>
      <Footer />
    </div>
  );
}

export default Home;
