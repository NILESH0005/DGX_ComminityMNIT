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

  const [passwordRules, setPasswordRules] = useState({
    number: false,
    specialChar: false,
    uppercase: false,
    lowercase: false,
    length: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

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

  /* ================= FETCH STATES ================= */
  useEffect(() => {
    const loadStates = async () => {
      try {
        const response = await fetchData("dropdown/states", "GET");
        if (response.success) {
          setStates(response.data || []);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to load states", "error");
      }
    };
    loadStates();
  }, [fetchData]);

  /* ================= FETCH DISTRICTS ================= */
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

        if (response.success) {
          setDistricts(response.data || []);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to load districts", "error");
      }
    };

    loadDistricts();
  }, [form.stateId, fetchData]);

  /* ================= FETCH QUALIFICATIONS ================= */
  useEffect(() => {
    const loadQualifications = async () => {
      try {
        const response = await fetchData("dropdown/qualifications", "GET");

        if (response.success) {
          setQualifications(response.data || []);
        }
      } catch (error) {
        Swal.fire("Error", "Failed to load qualifications", "error");
      }
    };

    loadQualifications();
  }, [fetchData]);

  /* ================= SUBMIT ================= */
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

      const payload = {
        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        stateId: form.stateId,
        districtId: form.districtId,
        schoolName: form.schoolName,
        qualificationId: form.qualificationId,
        gender: form.gender,
        password: form.password, // ✅ send password
      };

      const res = await fetchData("user/register", "POST", payload);

      if (res?.success || res?.data?.success) {
        Swal.fire("Success", "Registration Successful!", "success");

        setRegisteredMobile(form.mobile);
        setShowOtpModal(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: res?.message || res?.data?.message || "User already exists",
        });
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl ">
        {/* Header */}
        <img
          src={images.MPIT_Logo}
          alt="MPIT College Logo"
          className="h-25 mb-4 w-full"
        />
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-DGXblue">
            MPIT AI Awareness Program
          </h1>
          <p className="text-gray-500 mt-2">Powered by NVIDIA DGX H200</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-DGXgreen mb-4">
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-DGXgreen"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-DGXgreen"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Mobile</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-DGXgreen"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Gender</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-DGXgreen"
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ================= ACADEMIC INFO ================= */}
            <div>
              <h2 className="text-lg font-semibold text-DGXgreen mb-4">
                Academic Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">State</label>
                  <select
                    name="stateId"
                    value={form.stateId}
                    onChange={(e) => {
                      handleChange(e);
                      setForm((prev) => ({
                        ...prev,
                        districtId: "",
                      }));
                    }}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-DGXgreen"
                  >
                    <option value="">Select State</option>
                    {states.map((s, index) => (
                      <option key={index} value={s.State}>
                        {s.State}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">District</label>
                  <select
                    name="districtId"
                    value={form.districtId}
                    onChange={handleChange}
                    disabled={!form.stateId}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-DGXgreen disabled:bg-gray-100"
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d.DistrictID} value={d.DistrictID}>
                        {d.DistrictName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">
                    School / College Name
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={form.schoolName}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-DGXgreen"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Qualification</label>
                  <select
                    name="qualificationId"
                    value={form.qualificationId}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-DGXgreen"
                  >
                    <option value="">Select Qualification</option>
                    {qualifications.map((q) => (
                      <option key={q.QualificationID} value={q.QualificationID}>
                        {q.QualificationName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-DGXgreen mb-4">
                Account Security
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block text-sm mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-DGXgreen"
                    />

                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-3 top-2 text-gray-500"
                    >
                      {passwordVisible ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-DGXgreen"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setConfirmPasswordVisible(!confirmPasswordVisible)
                      }
                      className="absolute right-3 top-2 text-gray-500"
                    >
                      {confirmPasswordVisible ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Rules */}
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
                    passwordRules.uppercase ? "text-green-600" : "text-red-500"
                  }
                >
                  At least one uppercase letter
                </p>

                <p
                  className={
                    passwordRules.lowercase ? "text-green-600" : "text-red-500"
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

            {/* ================= SUBMIT ================= */}
            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-3 bg-DGXgreen text-white rounded-xl shadow-md hover:scale-105 transition"
              >
                {loading ? "Processing..." : "Submit & Verify OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <OtpModal
        isOpen={showOtpModal}
        mobile={registeredMobile}
        onClose={() => setShowOtpModal(false)}
      />
    </div>
  );
};

export default Registration;
