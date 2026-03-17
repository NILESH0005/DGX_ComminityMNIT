import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import images from "../../public/images.js";
import { FaEye } from "react-icons/fa";
import { FaEyeLowVision } from "react-icons/fa6";
import Cookies from "js-cookie";
import ApiContext from "../context/ApiContext.jsx";
import LoadPage from "./LoadPage.jsx";
import { validateRequired } from "../utils/formValidation.js";
import { motion } from "framer-motion";

const SignIn = () => {
  const { fetchData, logIn, userToken } = useContext(ApiContext);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });

  // ✅ CAPTCHA STATE
  const [robotChecked, setRobotChecked] = useState(false);
  const [robotVerified, setRobotVerified] = useState(false);
  const [robotLoading, setRobotLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    if (id === "username") {
      setUserID(value);
      if (errors.email) setErrors({ ...errors, email: "" });
    }
    if (id === "password") {
      setPassword(value);
      if (errors.password) setErrors({ ...errors, password: "" });
    }
    if (message.text) setMessage({ type: "", text: "" });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!userID.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(userID)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // ✅ CAPTCHA VERIFY FUNCTION
  const handleRobotCheck = () => {
    setRobotLoading(true);

    setTimeout(() => {
      setRobotChecked(true);
      setRobotVerified(true);
      setRobotLoading(false);
    }, 1200);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    // ✅ CAPTCHA VALIDATION
    if (!robotVerified) {
      showMessage("error", "Please verify you are not a robot");
      return;
    }

    const endpoint = "user/login";
    const method = "POST";
    const body = { email: userID, password };

    setLoading(true);
    try {
      const data = await fetchData(endpoint, method, body);
      if (!data.success) {
        setLoading(false);
        showMessage("error", data.message);
      } else {
        logIn(data.data.authtoken);
        setLoading(false);
        if (data.data.flag === 0) navigate("/ChangePassword");
        else if (data.data.isAdmin == 1) navigate("/AdminDashboard");
        else if (data.data.isAdmin == 4) navigate("/StudentRegisteration");
        else navigate("/LearningPath");
      }
    } catch (error) {
      setLoading(false);
      showMessage("error", "Something went wrong. Please try again later.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    if (userToken) navigate("/");
  }, [userToken, navigate]);

  if (loading) return <LoadPage />;

  return (
    <div className="flex flex-col min-h-[500px] bg-gray-50 overflow-auto">
      <div className="bg-gradient-to-r from-DGXgreen to-DGXblue text-white text-center py-2 text-sm font-semibold tracking-wide">
        MPIT AI Centre of Excellence | Students AI Awareness Mission | Launch:
        14 April 2026
      </div>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 bg-DGXblue rounded-2xl overflow-hidden shadow-xl min-h-[600px]"
          >
            <motion.div
              className="hidden lg:flex bg-gradient-to-br from-DGXgreen to-DGXblue p-8 md:p-12 h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="flex flex-col justify-center h-full">
                <motion.h2
                  className="text-4xl font-bold text-white mb-6 leading-tight"
                  initial={{ x: -50 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  MPIT AI Centre of Excellence
                </motion.h2>

                <motion.p
                  className="text-xl text-blue-100 mb-6"
                  initial={{ x: -50 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  Join the Student AI Awareness Program powered by NVIDIA DGX
                  H200 infrastructure.
                </motion.p>

                <motion.p
                  className="text-md text-blue-200"
                  initial={{ x: -50 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  Learn • Assess • Get Certified
                </motion.p>
                <motion.p
                  className="text-xl text-blue-100 mb-8"
                  initial={{ x: -50 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  Sign in to access your our Community account and explore all
                  the features.
                </motion.p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="flex justify-center"
                >
                  <img
                    src={images.secure}
                    alt="Secure Login"
                    className="max-w-full h-auto object-contain"
                  />
                </motion.div>
              </div>
            </motion.div>
            <div className="bg-white flex items-center justify-center h-full p-6 sm:p-8 md:p-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="w-full max-w-md mx-auto"
              >
                <motion.div
                  className="text-center mb-6"
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h1 className="text-3xl font-bold text-DGXblue mb-2">
                    Sign In
                  </h1>
                  <p className="text-gray-600">
                    Welcome to{" "}
                    <span className="text-DGXgreen font-semibold">
                      AI Awareness Program
                    </span>
                  </p>
                </motion.div>

                {/* Message Display */}
                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 p-3 rounded-lg text-center ${
                      message.type === "error"
                        ? "bg-red-100 text-red-700 border border-red-300"
                        : "bg-green-100 text-green-700 border border-green-300"
                    }`}
                  >
                    {message.text}
                  </motion.div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-DGXblue mb-1"
                    >
                      Email address
                    </label>
                    <input
                      id="username"
                      type="text"
                      className={`w-full px-4 py-2 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-DGXgreen focus:border-transparent transition-all`}
                      onChange={handleInputChange}
                      value={userID}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="relative"
                  >
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-DGXblue mb-1"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type={passwordVisible ? "text" : "password"}
                      className={`w-full px-4 py-2 border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-DGXgreen focus:border-transparent transition-all`}
                      onChange={handleInputChange}
                      value={password}
                      placeholder="Enter your password"
                    />
                    {errors.password && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-8 text-DGXgreen hover:text-DGXblue transition-colors"
                    >
                      {passwordVisible ? <FaEye /> : <FaEyeLowVision />}
                    </button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex justify-end"
                  >
                    <Link
                      to="/ForgotPassword"
                      className="text-sm font-medium text-DGXgreen hover:text-DGXblue transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </motion.div>
                

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    <div className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
                      {/* Left side */}
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={robotChecked}
                          onChange={handleRobotCheck}
                          disabled={robotLoading || robotVerified}
                          className="w-4 h-4 cursor-pointer"
                        />

                        <span className="text-sm text-gray-700">
                          {robotLoading
                            ? "Verifying..."
                            : robotVerified
                              ? "I'm not a robot ✔"
                              : "I'm not a robot"}
                        </span>
                      </div>

                      {/* Right side (fake captcha branding like real one) */}
                      <div className="text-[10px] text-gray-400 text-right leading-tight">
                        <div className="font-semibold">CAPTCHA</div>
                        <div>Privacy • Terms</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                  >
                    <button
                      type="submit"
                      className="w-full py-2 px-4 bg-DGXgreen hover:bg-DGXblue text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-DGXgreen focus:ring-opacity-50"
                    >
                      Sign in
                    </button>
                  </motion.div>
                </form>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                  className="mt-6"
                >
                  <div className="bg-gradient-to-r from-DGXgreen/10 to-DGXblue/10 border border-DGXgreen rounded-xl p-4 text-center shadow-sm">
                    <h3 className="text-lg font-semibold text-DGXblue mb-2">
                      New to AI Awareness Program?
                    </h3>

                    <p className="text-sm text-gray-600 mb-3">
                      Register for the{" "}
                      <span className="font-medium text-DGXgreen">
                        MPIT AI Awareness Program
                      </span>{" "}
                      and start your AI journey today.
                    </p>

                    <Link
                      to="/registration"
                      className="inline-block px-6 py-2 bg-DGXgreen hover:bg-DGXblue text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Register Now
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
