import React from "react";
import { motion } from "framer-motion";
import { RiRobot3Fill } from "react-icons/ri";
import { FcFullBattery, FcGoogle } from "react-icons/fc";
import { IoSparklesSharp } from "react-icons/io5";
import { auth, provider } from "../utils/firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../Redux/userSlice";

const Auth = ({ isModel = false }) => {
  const serverURL = "http://localhost:8000";
  const dispatch = useDispatch();
  const handleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      const name = res.user.displayName;
      const email = res.user.email;
      const result = await axios.post(
        serverURL + "/api/auth/google",
        { name, email },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
    } catch (err) {
      console.log(err);
      dispatch(setUserData(null));
    }
  };

  return (
    <div
      className={`w-full ${
        isModel
          ? "py-4"
          : "min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-6"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className={`w-full ${
          isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-10 rounded-3xl"
        } bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100`}
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-black">
            <RiRobot3Fill className="text-white text-3xl" />
          </div>

          <h1 className="text-lg font-semibold text-gray-900">
            InterviewIQ.AI
          </h1>
        </div>

        <div className="space-y-3 mb-8">
          <p className="text-center text-sm font-medium text-gray-500">
            Continue with
          </p>

          <div className="flex items-center justify-center gap-2">
            <IoSparklesSharp className="text-yellow-500 text-2xl" />

            <h1 className="text-3xl font-bold text-gray-900">
              AI Smart Interview
            </h1>
          </div>

          <p className="text-center text-gray-500 text-sm leading-relaxed">
            Sign in to start AI-powered mock interviews, track your progress,
            and unlock detailed performance insights.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-black text-white font-medium shadow-lg hover:bg-gray-900 transition-all duration-300"
          onClick={handleLogin}
        >
          <FcGoogle size={22} />
          Continue with Google
        </motion.button>

        <p className="text-center text-xs text-gray-400 mt-6">
          Secure authentication powered by Google
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
