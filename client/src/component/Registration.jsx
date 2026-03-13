import React, { useState, useEffect, useContext } from "react";
import ApiContext from "../context/ApiContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import OtpModal from "./OtpModal";
import { images } from "../../public/index.js";

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

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    mobile: "",
    schoolName: "",
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
      if (!mobileRegex.test(value)) errorMsg = "Mobile must be 10 digits";
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
        if (response.success) setStates(response.data || []);
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

    if (
      !form.fullName ||
      !form.email ||
      !form.mobile ||
      !form.stateId ||
      !form.districtId ||
      !form.schoolName ||
      !form.qualificationId ||
      !form.gender ||
      !form.password ||
      !form.confirmPassword
    ) {
      return Swal.fire("Warning", "Please fill all fields", "warning");
    }

    if (form.password !== form.confirmPassword) {
      return Swal.fire("Error", "Passwords do not match", "error");
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
    <div className="bg-gray-100 flex justify-center py-10">
      <div className="bg-white shadow-xl rounded-xl flex w-full max-w-5xl overflow-hidden">
        <div className="flex-1">
          <img
            src={images.MPIT_Logo}
            alt="MPIT College Logo"
            className="w-full h-35 object-contain border-b"
          />

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="relative z-10">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter Name"
                      value={form.fullName}
                      onChange={handleChange}
                      className={`w-full border px-3 py-2 rounded 
    ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
                    />

                    <div className="absolute -top-9 left-0 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg">
                      Enter your full name
                    </div>

                    {errors.fullName && (
                      <p className="text-red-500 text-sm">{errors.fullName}</p>
                    )}
                  </div>
                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full border px-3 py-2 rounded 
    ${errors.email ? "border-red-500" : "border-gray-300"}`}
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
                      placeholder="Mobile Number"
                      value={form.mobile}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 10) {
                          handleChange({ target: { name: "mobile", value } });
                        }
                      }}
                      className="w-full border px-3 py-2 rounded border-gray-300"
                    />
                    <div className="absolute -top-9 left-0 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg">
                      Enter your Mobile Number
                    </div>
                  </div>
                  <div className="relative group">
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded border-gray-300"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute -top-9 left-0 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg">
                      Enter your Gender
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
                      onChange={(e) => {
                        handleChange(e);
                        setForm((prev) => ({ ...prev, districtId: "" }));
                      }}
                      className="w-full border px-3 py-2 rounded border-gray-300"
                    >
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
                      disabled={!form.stateId}
                      className="w-full border px-3 py-2 rounded border-gray-300"
                    >
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
                      className="w-full border px-3 py-2 rounded border-gray-300"
                    />

                    {/* Tooltip */}
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
                      className="w-full border px-3 py-2 rounded border-gray-300"
                    >
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
                      className="w-full border px-3 py-2 rounded border-gray-300"
                    />

                    {/* Tooltip */}
                    <div className="absolute -top-9 left-0 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg">
                      Password requirements
                      <div className="w-2 h-2 bg-gray-900 rotate-45 absolute left-3 -bottom-1"></div>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className="relative group">
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="w-full border px-3 py-2 rounded border-gray-300"
                    />

                    {/* Tooltip */}
                    <div className="absolute -top-9 left-0 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg">
                      Re-enter the same password
                      <div className="w-2 h-2 bg-gray-900 rotate-45 absolute left-3 -bottom-1"></div>
                    </div>
                  </div>
                </div>

                {/* PASSWORD VALIDATION RULES */}
                <div className="mt-3 text-sm space-y-1">
                  <p
                    className={
                      passwordRules.length ? "text-green-600" : "text-red-500"
                    }
                  >
                    Minimum 8 characters
                  </p>

                  <p
                    className={
                      passwordRules.uppercase
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    At least one uppercase letter
                  </p>

                  <p
                    className={
                      passwordRules.lowercase
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    At least one lowercase letter
                  </p>

                  <p
                    className={
                      passwordRules.number ? "text-green-600" : "text-red-500"
                    }
                  >
                    At least one number
                  </p>

                  <p
                    className={
                      passwordRules.specialChar
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    At least one special character
                  </p>
                </div>
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
