import React, { useState } from "react";
import { motion } from "framer-motion";
import { RiRobot3Fill } from "react-icons/ri";
import { BsCoin } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserData } from "../Redux/userSlice";
import { serverURL } from "../App";
import AuthModel from "./AuthModel";

const Navbar = () => {
  const { userData } = useSelector((state) => state.user);
  const [creditPopUp, setCreditPopUp] = useState(false);
  const [showUserPopUp, setShowUserPopUp] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.get(serverURL + "/api/auth/logout", {
        withCredentials: true,
      });

      dispatch(setUserData(null));
      setShowUserPopUp(false);
      setCreditPopUp(false);

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className="flex justify-between items-center bg-white mx-[15vw] my-6 rounded-2xl px-8 py-4 shadow-lg"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <RiRobot3Fill className="text-white bg-black p-2 rounded-full text-4xl" />

          <h1 className="text-lg font-semibold text-gray-900">
            InterviewIQ.AI
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Credits */}
          <div className="relative">
            <button
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all text-sm font-medium text-gray-800"
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }

                setCreditPopUp(!creditPopUp);
                setShowUserPopUp(false);
              }}
            >
              <BsCoin />
              <p>{userData?.credits || 0}</p>
            </button>

            {creditPopUp && (
              <div className="absolute right-0 top-14 bg-white rounded-xl shadow-xl p-4 min-w-[230px] flex flex-col gap-3 z-50">
                <p className="text-sm text-gray-600">
                  Need more credits to continue interviews?
                </p>

                <button
                  className="bg-black text-white rounded-lg py-2 text-sm hover:bg-gray-800 transition-all"
                  onClick={() => navigate("/pricing")}
                >
                  Buy More Credits
                </button>
              </div>
            )}
          </div>

          {/* User */}
          <div className="relative">
            <button
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center"
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }

                setShowUserPopUp(!showUserPopUp);
                setCreditPopUp(false);
              }}
            >
              <span className="text-sm font-semibold">
                {userData ? (
                  userData.name.slice(0, 1).toUpperCase()
                ) : (
                  <RiRobot3Fill />
                )}
              </span>
            </button>

            {showUserPopUp && (
              <div className="absolute right-0 top-14 bg-white rounded-xl shadow-xl p-4 min-w-[190px] flex flex-col gap-3 z-50">
                <p className="text-sm font-semibold text-gray-900">
                  {userData?.name}
                </p>

                <button
                  className="text-sm text-gray-700 hover:text-black text-left"
                  onClick={() => navigate("/history")}
                >
                  Interview History
                </button>

                <button
                  className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
                  onClick={handleLogout}
                >
                  <IoIosLogOut />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {showAuth && (
        <AuthModel onClose={() => setShowAuth(false)} />
      )}
    </div>
  );
};

export default Navbar;