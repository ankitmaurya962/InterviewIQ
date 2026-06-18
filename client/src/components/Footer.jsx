import React from "react";
import { IoSparklesSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Logo */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <IoSparklesSharp className="text-green-500 text-2xl" />

              <h2 className="text-3xl font-bold text-gray-900">
                Interview<span className="text-green-500">IQ</span>
              </h2>
            </div>

            <p className="text-gray-500 leading-relaxed">
              Practice AI-powered interviews with adaptive questions,
              real-time feedback, and detailed performance analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="text-gray-500 hover:text-green-500 transition"
              >
                Home
              </Link>

              <Link
                to="/interview"
                className="text-gray-500 hover:text-green-500 transition"
              >
                Interviews
              </Link>

              <Link
                to="/history"
                className="text-gray-500 hover:text-green-500 transition"
              >
                History
              </Link>

              <Link
                to="/about"
                className="text-gray-500 hover:text-green-500 transition"
              >
                About
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact
            </h3>

            <div className="space-y-3 text-gray-500">
              <p>support@interviewiq.ai</p>
              <p>AI-Powered Interview Preparation Platform</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} InterviewIQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;