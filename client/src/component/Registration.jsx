import React, { useState, useEffect, useContext } from "react";
import ApiContext from "../context/ApiContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import OtpModal from "./OtpModal";
import { images } from "../../public/index.js";
import { FaEye } from "react-icons/fa";
import { FaEyeLowVision } from "react-icons/fa6";

const Registration = () => {
  const { fetchData } = useContext(ApiContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    stateId: "",
    districtId: "",
    schoolName: "",
    qualificationId: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredMobile, setRegisteredMobile] = useState("");
  const [registeredUserId, setRegisteredUserId] = useState(null);
  const [registeredPassword, setRegisteredPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    mobile: "",
    schoolName: "",
    gender: "",
    stateId: "",
    districtId: "",
    qualificationId: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordRules, setPasswordRules] = useState({
    number: false,
    specialChar: false,
    uppercase: false,
    lowercase: false,
    length: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    let errorMsg = "";

    if (name === "fullName") {
      if (value.trim().length < 3)
        errorMsg = "Name must be at least 3 characters";
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) errorMsg = "Enter a valid email address";
    }

    if (name === "mobile") {
      const mobileRegex = /^[0-9]{10}$/;
      const sameDigitRegex = /^(\d)\1{9}$/;

      if (!mobileRegex.test(value)) {
        errorMsg = "Mobile must be 10 digits";
      } else if (sameDigitRegex.test(value)) {
        errorMsg = "Mobile number cannot have all identical digits";
      }
    }

    if (name === "schoolName") {
      if (value.trim().length < 3)
        errorMsg = "School name must be at least 3 characters";
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));

    if (name === "password") {
      setPasswordRules({
        number: /\d/.test(value),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        length: value.length >= 8,
      });
    }
  };

  useEffect(() => {
    const loadStates = async () => {
      try {
        const response = await fetchData("dropdown/states", "GET");

        if (response.success) {
          const stateList = response.data || [];
          setStates(stateList);

          // If only one state exists → set it automatically
          if (stateList.length === 1) {
            setForm((prev) => ({
              ...prev,
              stateId: stateList[0].State,
            }));
          }
        }
      } catch {
        Swal.fire("Error", "Failed to load states", "error");
      }
    };

    loadStates();
  }, [fetchData]);

  useEffect(() => {
    const loadDistricts = async () => {
      if (!form.stateId) {
        setDistricts([]);
        return;
      }

      try {
        const response = await fetchData(
          `dropdown/districts/${form.stateId}`,
          "GET",
        );
        if (response.success) setDistricts(response.data || []);
      } catch {
        Swal.fire("Error", "Failed to load districts", "error");
      }
    };

    loadDistricts();
  }, [form.stateId, fetchData]);

  useEffect(() => {
    const loadQualifications = async () => {
      try {
        const response = await fetchData("dropdown/qualifications", "GET");
        if (response.success) setQualifications(response.data || []);
      } catch {
        Swal.fire("Error", "Failed to load qualifications", "error");
      }
    };

    loadQualifications();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sameDigitRegex = /^(\d)\1{9}$/;
    if (sameDigitRegex.test(form.mobile)) {
      newErrors.mobile = "Mobile number cannot have all identical digits";
    }
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!form.stateId) newErrors.stateId = "State is required";
    if (!form.districtId) newErrors.districtId = "District is required";
    if (!form.schoolName.trim())
      newErrors.schoolName = "School / College name is required";
    if (!form.qualificationId)
      newErrors.qualificationId = "Qualification is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.password) newErrors.password = "Password is required";
    if (!form.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (
      !passwordRules.number ||
      !passwordRules.specialChar ||
      !passwordRules.uppercase ||
      !passwordRules.lowercase ||
      !passwordRules.length
    ) {
      return Swal.fire(
        "Weak Password",
        "Password must contain uppercase, lowercase, number, special character and be 8+ characters",
        "warning",
      );
    }

    try {
      setLoading(true);

      const payload = { ...form };

      const res = await fetchData("user/register", "POST", payload);

      if (res?.success) {
        setRegisteredUserId(res.data.userId);
        setRegisteredMobile(form.mobile);
        setRegisteredPassword(form.password);
        setShowOtpModal(true);
      } else {
        setErrors((prev) => ({
          ...prev,
          email: res?.message || "Email already exists",
        }));
      }
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex justify-center items-center relative   overflow-hidden">
      {" "}
      <div className="max-w-5xl">
        <div className="bg-white shadow-xl rounded-xl flex  mb-5 max-w-5xl relative overflow-hidden">
          {" "}
          <img
            src={images.aiAwarenessLogo}
            alt="AI Awareness Logo"
            className="absolute inset-0 m-auto w-[420px] opacity-15 pointer-events-none select-none z-0"
          />
          <div className="flex flex-col h-full ">
            {" "}
            <img
              src={images.MPIT_logo}
              alt="MPIT College Logo"
              className="w-full h-30 object-contain border-b "
            />
            <div className="p-4 flex-1">
              {" "}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative z-10">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Enter Name"
                        value={form.fullName}
                        onChange={handleChange}
                        className={`w-full border px-3 py-2 rounded bg-white/70 backdrop-blur-sm opacity-50

                    ${errors.fullName ? "border-red-500" : "border-black"}`}
                      />

                      <div className="absolute -top-9 left-0 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg z-50">
                        {" "}
                        Enter your full name
                      </div>

                      {errors.fullName && (
                        <p className="text-red-500 text-sm">
                          {errors.fullName}
                        </p>
                      )}
                    </div>
                    <div className="relative group">
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full border px-3 py-2 rounded bg-white/80 backdrop-blur-sm opacity-50
${errors.fullName ? "border-red-500" : "border-black"}`}
                      />

                      <div className="absolute -top-9 left-0 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg">
                        Use a valid email (example@email.com)
                      </div>

                      {errors.email && (
                        <p className="text-red-500 text-sm mb-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="relative group">
                      <input
                        type="tel"
                        name="mobile"
                        placeholder="Mobile Number( WhatsApp/SMS)"
                        value={form.mobile}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 10) {
                            handleChange({ target: { name: "mobile", value } });
                          }
                        }}
                        className={`w-full border px-3 py-2 opacity-50 rounded ${
                          errors.mobile ? "border-red-500" : "border-black"
                        }`}
                      />

                      {errors.mobile && (
                        <p className="text-red-500 text-sm">{errors.mobile}</p>
                      )}
                      <div className="absolute -top-9 left-0 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg">
                        Enter your Mobile Number
                      </div>
                    </div>
                    <div className="relative group">
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className={`w-full border px-3 py-2 opacity-50 rounded ${
                          errors.gender ? "border-red-500" : "border-black"
                        }`}
                      >
                        {errors.gender && (
                          <p className="text-red-500 text-sm">
                            {errors.gender}
                          </p>
                        )}
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>

                      <div className="absolute -top-9 left-0 hidden group-hover:block bg-gray-900 text-white text-xs  py-1 rounded shadow-lg">
                        Select your Gender
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative group">
                      <select
                        name="stateId"
                        value={form.stateId}
                        onChange={handleChange}
                        className={`w-full border px-3 py-2 opacity-50 rounded ${
                          errors.stateId ? "border-red-500" : "border-black"
                        }`}
                      >
                        {errors.stateId && (
                          <p className="text-red-500 text-sm">
                            {errors.stateId}
                          </p>
                        )}
                        <option value="">Select State</option>
                        {states.map((s, i) => (
                          <option key={i} value={s.State}>
                            {s.State}
                          </option>
                        ))}
                      </select>
                      <div className="absolute -top-10 left-0 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg z-20">
                        Select your state of residence
                        <div className="w-2 h-2 bg-gray-900 rotate-45 absolute left-3 -bottom-1"></div>
                      </div>
                    </div>
                    <div className="relative group">
                      <select
                        name="districtId"
                        value={form.districtId}
                        onChange={handleChange}
                        className={`w-full border px-3 py-2 opacity-50 rounded ${
                          errors.districtId ? "border-red-500" : "border-black"
                        }`}
                      >
                        {errors.districtId && (
                          <p className="text-red-500 text-sm">
                            {errors.districtId}
                          </p>
                        )}
                        <option value="">Select District</option>
                        {districts.map((d) => (
                          <option key={d.DistrictID} value={d.DistrictID}>
                            {d.DistrictName}
                          </option>
                        ))}
                      </select>
                      <div className="absolute -top-10 left-0 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg z-20">
                        Select your district after choosing state
                        <div className="w-2 h-2 bg-gray-900 rotate-45 absolute left-3 -bottom-1"></div>
                      </div>
                    </div>
                    <div className="relative group md:col-span-2">
                      <input
                        type="text"
                        name="schoolName"
                        placeholder="School / College Name"
                        value={form.schoolName}
                        onChange={handleChange}
                        className={`w-full border px-3 py-2 opacity-50 rounded ${
                          errors.schoolName ? "border-red-500" : "border-black"
                        }`}
                      />

                      <div className="absolute -top-10 left-0 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg z-20">
                        Enter the name of your school or college
                        <div className="w-2 h-2 bg-gray-900 rotate-45 absolute left-3 -bottom-1"></div>
                      </div>

                      {errors.schoolName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.schoolName}
                        </p>
                      )}
                    </div>
                    <div className="relative group">
                      <select
                        name="qualificationId"
                        value={form.qualificationId}
                        onChange={handleChange}
                        className={`w-full border opacity-50 px-3 py-2 rounded ${
                          errors.qualificationId
                            ? "border-red-500"
                            : "border-black"
                        }`}
                      >
                        {errors.qualificationId && (
                          <p className="text-red-500 text-sm">
                            {errors.qualificationId}
                          </p>
                        )}
                        <option value="">Select Qualification</option>
                        {qualifications.map((q) => (
                          <option
                            key={q.QualificationID}
                            value={q.QualificationID}
                          >
                            {q.QualificationName}
                          </option>
                        ))}
                      </select>
                      <div className="absolute -top-10 left-0 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg z-20">
                        Choose your highest qualification
                        <div className="w-2 h-2 bg-gray-900 rotate-45 absolute left-3 -bottom-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* PASSWORD */}
                    <div className="relative group">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        placeholder="Enter Password"
                        value={form.password}
                        onChange={handleChange}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        className={`w-full border px-3 py-2 pr-10 opacity-50 rounded ${
                          errors.password ? "border-red-500" : "border-black"
                        }`}
                      />

                      {/* 👁️ Eye Button */}
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute right-3 top-2.5 text-DGXgreen hover:text-DGXblue"
                      >
                        {passwordVisible ? <FaEye /> : <FaEyeLowVision />}
                      </button>

                      {errors.password && (
                        <p className="text-red-500 text-sm">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="relative group">
                      <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className={`w-full border px-3 py-2 pr-10 opacity-50 rounded ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-black"
                        }`}
                      />

                      {/* 👁️ Eye Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmPasswordVisible(!confirmPasswordVisible)
                        }
                        className="absolute right-3 top-2.5 text-DGXgreen hover:text-DGXblue"
                      >
                        {confirmPasswordVisible ? (
                          <FaEye />
                        ) : (
                          <FaEyeLowVision />
                        )}
                      </button>

                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* PASSWORD VALIDATION RULES */}
                  {isPasswordFocused && (
                    <div className="mt-2 text-xs grid grid-cols-2 gap-1">
                      {!passwordRules.length && (
                        <span className="text-red-500">8+ chars</span>
                      )}

                      {!passwordRules.uppercase && (
                        <span className="text-red-500">1 Uppercase</span>
                      )}

                      {!passwordRules.lowercase && (
                        <span className="text-red-500">1 Lowercase</span>
                      )}

                      {!passwordRules.number && (
                        <span className="text-red-500">1 Number</span>
                      )}

                      {!passwordRules.specialChar && (
                        <span className="text-red-500">1 Special</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-10 py-3 bg-DGXgreen text-white rounded-xl shadow hover:scale-105"
                  >
                    {loading ? "Processing..." : "Submit & Verify OTP"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="flex justify-end mb-2">
          <Link
            to="/SignInn"
            className="bottom-6 right-6 text-xs bg-DGXblue text-white px-3 py-1.5 rounded-md shadow hover:bg-DGXgreen transition-all duration-300"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
      <OtpModal
        isOpen={showOtpModal}
        userId={registeredUserId}
        mobile={registeredMobile}
        password={registeredPassword}
        onClose={() => setShowOtpModal(false)}
      />
    </div>
  );
};

export default Registration;
