import { useState, useRef } from "react";
import { FaMicrophone } from "react-icons/fa";
import { motion } from "framer-motion";
import Timer from "./Timer";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import { useEffect } from "react";
import { serverURL } from "../App";
import { BsArrowRight } from "react-icons/bs";
import axios from "axios";
import maleVideo from "../assets/Videos/male-ai.mp4";

const Step2Interview = ({ interviewData, onFinish }) => {
  const { interviewId, questions = [], userName } = interviewData || {};
  const speechRecognitionSupported =
    typeof window !== "undefined" &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(speechRecognitionSupported);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");

  const recognitionRef = useRef(null);
  const micEnabledRef = useRef(speechRecognitionSupported);
  const micPausedRef = useRef(false);
  const isAIPlayingRef = useRef(false);
  const restartTimeoutRef = useRef(null);
  const videoRef = useRef(null);

  function startMic() {
    if (recognitionRef.current && !isAIPlayingRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Unable to start microphone:", error);
        }
      }
    }
  }

  function stopMic() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }

  const currentQuestion = questions[currentIndex];

  const [timeLeft, setTimeLeft] = useState(currentQuestion?.timeLimit || 60);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      if (!voices.length) return;

      // Try known female voices first
      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female"),
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      // Try male voices
      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male"),
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      // Fallback
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const videoSource = voiceGender == "male" ? maleVideo : femaleVideo;

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      // Add natural pauses after commas and periods
      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;

      // Human-like pacing
      utterance.rate = 0.92; // slightly slower than normal
      utterance.pitch = 1.05; // small warmth
      utterance.volume = 1;

      utterance.onstart = () => {
        isAIPlayingRef.current = true;
        micPausedRef.current = true;
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
        isAIPlayingRef.current = false;
        micPausedRef.current = false;
        setIsAIPlaying(false);

        if (micEnabledRef.current) {
          startMic();
        }

        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  //for intro
  useEffect(() => {
    if (!selectedVoice) {
      return;
    }

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`,
        );

        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin.",
        );

        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 800));

        //if last question (hard level)
        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }
        await speakText(currentQuestion.question);
      }
    };
    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  //question timer
  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex, isSubmitting]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => prev + " " + transcript);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        micEnabledRef.current = false;
        setIsMicOn(false);
      }
    };
    recognition.onend = () => {
      if (
        micEnabledRef.current &&
        !micPausedRef.current &&
        !isAIPlayingRef.current
      ) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = setTimeout(() => {
          startMic();
        }, 250);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      clearTimeout(restartTimeoutRef.current);
      recognition.onend = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    setTimeLeft(currentQuestion?.timeLimit || 60);
  }, [currentIndex]);

  const toggleMic = () => {
    if (isMicOn) {
      micEnabledRef.current = false;
      clearTimeout(restartTimeoutRef.current);
      stopMic();
      setIsMicOn(false);
    } else {
      micEnabledRef.current = true;
      setIsMicOn(true);
      startMic();
    }
  };

  const submitAnswer = async () => {
    if (isSubmitting) return;
    micPausedRef.current = true;
    stopMic();
    setIsSubmitting(true);
    try {
      const result = await axios.post(
        serverURL + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        },
        { withCredentials: true },
      );

      setFeedback(result.data.feedback);
      speakText(result.data.feedback);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      micPausedRef.current = false;
      if (micEnabledRef.current) startMic();
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");

    setCurrentIndex(currentIndex + 1);

    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);
  };

  const finishInterview = async () => {
    micEnabledRef.current = false;
    stopMic();
    setIsMicOn(false);

    try {
      const result = await axios.post(
        serverURL + "/api/interview/finish",
        {
          interviewId,
        },
        { withCredentials: true },
      );
      console.log(result.data);
      onFinish(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-6xl mx-auto bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="w-full min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col lg:flex-row"
      >
        {/* LEFT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-[35%] bg-white border-r border-gray-200 p-5 flex flex-col"
        >
          {/* AI VIDEO */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl overflow-hidden shadow-lg"
          >
            <video
              ref={videoRef}
              src={videoSource}
              key={videoSource}
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
            />
          </motion.div>
          {/* subtitle */}

          {subtitle && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl z-20">
              <p className="bg-black/70 backdrop-blur-md text-white text-center px-6 py-4 rounded-2xl border border-gray-700 shadow-xl text-lg font-medium leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}

          {/* STATUS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -3 }}
            className="mt-5 bg-white border border-gray-200 rounded-2xl shadow-sm p-5"
          >
            <div className="flex justify-between text-sm text-gray-500 mb-5">
              <span>Interview Status</span>

              <span className="text-green-600 font-semibold">
                {isAIPlaying
                  ? "AI Speaking"
                  : isMicOn
                    ? "Listening"
                    : "Mic Off"}
              </span>
            </div>

            <div className="flex justify-center py-4">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit || 60}
              />
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-around">
              <div className="text-center">
                <h4 className="text-green-600 font-bold text-xl">
                  {currentIndex + 1}
                </h4>

                <p className="text-xs text-gray-500">Current Question</p>
              </div>

              <div className="text-center">
                <h4 className="text-green-600 font-bold text-xl">
                  {questions.length}
                </h4>

                <p className="text-xs text-gray-500">Total Questions</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-1 p-5 flex flex-col"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-green-700 mb-4"
          >
            AI Smart Interview
          </motion.h2>

          {/* QUESTION CARD */}
          {!isIntroPhase && (
            <motion.div
              key={currentQuestion?.question}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="border border-gray-200 rounded-2xl p-4 mb-4 bg-gray-50"
            >
              <p className="text-xs text-gray-400 mb-2">
                Question {currentIndex + 1} of {questions.length}
              </p>

              <h3 className="font-semibold text-gray-800 text-lg">
                {currentQuestion?.question || "Loading Question..."}
              </h3>
            </motion.div>
          )}

          {/* ANSWER AREA */}
          <motion.textarea
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="flex-1 border border-gray-200 rounded-2xl p-4 resize-none outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* CONTROLS */}
          {feedback ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm"
            >
              <p className="text-emerald-700 font-medium mb-4">{feedback}</p>

              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1"
              >
                Next Question <BsArrowRight size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-3 mt-4"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMic}
                className={`w-12 h-12 rounded-full text-white flex items-center justify-center ${
                  isMicOn ? "bg-black" : "bg-red-500"
                }`}
              >
                <FaMicrophone />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                disabled={isSubmitting}
                onClick={submitAnswer}
                className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl py-3 disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Step2Interview;
