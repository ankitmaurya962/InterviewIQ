import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Auth from "./pages/Auth";
import axios from "axios";

const App = () => {
  const serverURL = "http://localhost:8000";
  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await axios.get(serverURL + "/api/user/current-user", {
          withCredentials: true,
        });
        console.log(user);
      } catch (error) {
        console.log(error);
        console.log(error.response?.status);
        console.log(error.response?.data);
      }
    };
    getUser();
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>
  );
};

export default App;
