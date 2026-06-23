import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";
import { MdTrendingUp } from "react-icons/md";
import { BsChatDotsFill } from "react-icons/bs";
import { FaAward } from "react-icons/fa";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const Step3Report = ({ report }) => {
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading Report...</p>
      </div>
    );
  }

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0,
  }));
  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities";
    shortTagline = "Excellent clarity and structured responses.";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews";
    shortTagline = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required";
    shortTagline = "Work on clarity and confidence.";
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;

  const downloadPDF = () => {
    // ==================================================
    // PDF INITIALIZATION
    // ==================================================
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let currentY = 25;

    // ==================================================
    // REPORT TITLE
    // ==================================================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94);

    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 5;

    doc.setDrawColor(34, 197, 94);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

    // ==================================================
    // FINAL SCORE SECTION
    // ==================================================
    currentY += 15;

    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);

    doc.text(`Final Score: ${finalScore}/10`, pageWidth / 2, currentY + 12, {
      align: "center",
    });

    // ==================================================
    // PERFORMANCE METRICS
    // ==================================================
    currentY += 30;

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");

    doc.setFontSize(12);

    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);

    // ==================================================
    // PROFESSIONAL ADVICE GENERATION
    // ==================================================
    currentY += 45;

    let advice = "";

    if (finalScore >= 8) {
      advice =
        "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
    } else if (finalScore >= 5) {
      advice =
        "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    } else {
      advice =
        "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud.";
    }

    // ==================================================
    // PROFESSIONAL ADVICE SECTION
    // ==================================================
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220);
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    doc.text("Professional Advice", margin + 10, currentY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);

    doc.text(splitAdvice, margin + 10, currentY + 20);

    currentY += 50;

    // ==================================================
    // QUESTION-WISE PERFORMANCE TABLE
    // ==================================================
    autoTable(doc, {
      startY: currentY,
      margin: {
        left: margin,
        right: margin,
      },

      head: [["#", "Question", "Score", "Feedback"]],

      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question,
        `${q.score}/10`,
        q.feedback,
      ]),

      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: "top",
      },

      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        halign: "center",
      },

      columnStyles: {
        0: {
          cellWidth: 10,
          halign: "center",
        },

        1: {
          cellWidth: 55,
        },

        2: {
          cellWidth: 20,
          halign: "center",
        },

        3: {
          cellWidth: "auto",
        },
      },

      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });

    // ==================================================
    // DOWNLOAD PDF
    // ==================================================
    doc.save("AI_Interview_Report.pdf");
  };
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between mb-10"
      >
        <div>
          <div className="flex items-center gap-3">
            <button
              className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
              onClick={() => navigate("/history")}
            >
              <IoArrowBack size={18} />
            </button>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Interview Analytics Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                AI-powered performance insights
              </p>
            </div>
          </div>
        </div>

        <button
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow-md transition"
          onClick={downloadPDF}
        >
          <FiDownload size={18} />
          Download PDF
        </button>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left */}
        <div className="space-y-6">
          {/* Overall Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-md p-6 text-center"
          >
            <h3 className="text-gray-600 font-semibold mb-6">
              Overall Performance
            </h3>

            <div className="w-24 h-24 mx-auto">
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                styles={buildStyles({
                  pathColor: "#22c55e",
                  trailColor: "#e5e7eb",
                  textColor: "#ef4444",
                  textSize: "16px",
                })}
              />
            </div>

            <p className="text-gray-400 text-sm mt-4">Out of 10</p>

            <h4 className="font-semibold text-gray-800 mt-4">
              {performanceText}
            </h4>

            <p className="text-gray-500 text-sm mt-2">{shortTagline}</p>
          </motion.div>

          {/* Skill Evaluation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-3xl shadow-md p-6"
          >
            <h3 className="font-semibold text-gray-700 mb-6">
              Skill Evaluation
            </h3>

            <div className="space-y-5">
              {skills.map((skill) => (
                <div key={skill.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">{skill.label}</span>

                    <span className="font-semibold text-green-600">
                      {skill.value}
                    </span>
                  </div>

                  <div className="w-full h-3 bg-gray-200 rounded-full">
                    <div
                      className="h-3 bg-green-500 rounded-full"
                      style={{
                        width: `${skill.value * 10}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        {/* Right */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-md p-6 h-full"
          >
            <h3 className="font-semibold text-gray-700 mb-5">
              Performance Trend
            </h3>

            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="score"
                    fill="#bbf7d0"
                    stroke="#22c55e"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-md p-6"
      >
        <h3 className="font-semibold text-gray-700 mb-6">Question Breakdown</h3>

        <div className="space-y-6">
          {questionWiseScore.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-5 border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-gray-400">Question {index + 1}</p>

                  <h4 className="font-semibold text-gray-800 mt-1">
                    {item.question}
                  </h4>
                </div>

                <div className="bg-green-100 text-green-600 font-bold px-3 py-1 rounded-lg">
                  {item.score || 0}/10
                </div>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <p className="text-green-600 font-semibold text-sm mb-2">
                  AI Feedback
                </p>

                <p className="text-gray-600 text-sm">
                  {item.feedback || "No feedback available for this question."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Step3Report;
