import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { serverURL } from "../App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const plans = [
  {
    id: "free",
    name: "Free",
    amount: 0,
    credits: 100,
    badge: "Default",
    description: "Perfect for beginners starting interview preparation.",
    features: [
      "100 AI Interview Credits",
      "Basic Performance Report",
      "Voice Interview Access",
      "Limited History Tracking",
    ],
  },

  {
    id: "basic",
    name: "Starter Pack",
    amount: 100,
    credits: 150,
    description: "Great for focused practice and skill improvement.",
    features: [
      "150 AI Interview Credits",
      "Detailed Feedback",
      "Performance Analytics",
      "Full Interview History",
    ],
  },

  {
    id: "pro",
    name: "Pro Pack",
    amount: 500,
    credits: 650,
    badge: "Best Value",
    description: "Best value for serious job preparation.",
    features: [
      "650 AI Interview Credits",
      "Advanced AI Feedback",
      "Skill Trend Analysis",
      "Priority AI Processing",
    ],
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("Starter Pack");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch();

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id);

      const amount = plan.id === "basic" ? 100 : plan.id === "pro" ? 500 : 0;

      const result = await axios.post(
        serverURL + "/api/payment/order",
        {
          planId: plan.id,
          amount: amount,
          credits: plan.credits,
        },
        { withCredentials: true },
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "InterviewIQ.AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,

        handler: async function (response) {
          try {
            const verifypay = await axios.post(
              serverURL + "/api/payment/verify",
              response,
              { withCredentials: true },
            );
            dispatch(setUserData(verifypay.data.user));
            alert("Payment Successful 🎉 Credits Added!");
            navigate("/");
          } catch (error) {
            console.log(error);
            alert("Payment verification failed");
          }
        },

        theme: {
          color: "#10b981",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoadingPlan(null);
    } catch (error) {
      console.log(error);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4fbf8] px-4 md:px-6 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-11 h-11 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:scale-105 transition"
          onClick={() => navigate("/")}
        >
          <IoArrowBack size={20} />
        </motion.button>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mt-3"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Choose Your Plan
          </h1>

          <p className="text-gray-500 mt-2 text-base">
            Flexible pricing to match your interview preparation goals.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5 mt-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              onClick={() => plan.name !== "Free" && setSelectedPlan(plan.name)}
              key={plan.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
              }}
              whileHover={{
                y: -8,
              }}
              className={`relative bg-white rounded-3xl p-6 border cursor-pointer transition-all duration-300 ${
                selectedPlan === plan.name
                  ? "border-green-500 shadow-xl scale-[1.03]"
                  : "border-gray-100 shadow-md"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <span
                  className={`absolute top-4 right-4 text-xs font-medium px-3 py-1 rounded-full ${
                    plan.badge === "Best Value"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {plan.badge}
                </span>
              )}

              <h2 className="text-xl font-semibold text-gray-800">
                {plan.name}
              </h2>

              <div className="mt-4">
                <h3 className="text-4xl font-bold text-green-600">
                  ₹{plan.amount}
                </h3>

                <p className="text-gray-500 mt-1 text-sm">
                  {plan.credits} Credits
                </p>
              </div>

              <p className="text-gray-500 mt-4 text-sm leading-relaxed">
                {plan.description}
              </p>

              <div className="mt-6 space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 text-base" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full mt-6 py-3 rounded-xl font-semibold transition ${
                  plan.name === "Free"
                    ? "bg-gray-100 text-gray-700"
                    : selectedPlan === plan.name
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (plan.id === "free") return;

                  if (selectedPlan !== plan.name) {
                    setSelectedPlan(plan.name);
                  } else {
                    handlePayment(plan);
                  }
                }}
              >
                {plan.name === "Free"
                  ? "Current Plan"
                  : selectedPlan === plan.name
                    ? "Proceed to Pay"
                    : "Select Plan"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
