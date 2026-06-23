import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Auth from "./pages/Auth";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "./Redux/userSlice";
import InterviewPage from "./pages/interviewPage";
import InterviewHistory from "./pages/InterviewHistory";
import Pricing from "./pages/Pricing";
import InterviewReport from "./pages/InterviewReport";

export const serverURL = "http://localhost:8000";
const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await axios.get(serverURL + "/api/user/current-user", {
          withCredentials: true,
        });
        dispatch(setUserData(user.data));
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      }
    };
    getUser();
  }, [dispatch]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/interview" element={<InterviewPage/>} />
        <Route path="/history" element={<InterviewHistory/>} />
        <Route path="/pricing" element={<Pricing/>} />
        <Route path="/report/:id" element={<InterviewReport/>} />
      </Routes>
    </div>
  );
};

export default App;
