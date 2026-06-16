import React from "react";
import { motion } from "framer-motion";
import { RiRobot3Fill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { IoSparklesSharp } from "react-icons/io5";
import { auth, provider } from "../utils/firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../Redux/userSlice";

const Auth = () => {
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
    <div className="h-screen w-full flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className="flex flex-col items-center gap-4 p-8 rounded-2xl shadow-lg w-[400px]"
      >
        <div className="flex justify-center items-center gap-2">
          <RiRobot3Fill className="text-white bg-black p-2 rounded-full text-4xl" />

          <h1 className="text-sm font-medium">InterviewIQ.AI</h1>
        </div>

        <h1 className="text-gray-600">Continue with</h1>

        <div className="flex items-center gap-2">
          <IoSparklesSharp className="text-yellow-500 text-2xl" />

          <h1 className="text-3xl font-bold text-center">AI Smart Interview</h1>
        </div>

        <p className="text-center text-gray-600 text-sm">
          Sign in to start AI-powered mock interviews, track your progress, and
          unlock detailed performance insights.
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className="flex justify-center items-center gap-3 bg-black rounded-full shadow-md text-white py-3 w-full"
          onClick={handleLogin}
        >
          <FcGoogle size={20} />
          Continue with Google
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Auth;
