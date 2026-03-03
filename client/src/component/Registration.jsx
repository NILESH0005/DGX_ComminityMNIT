import React, { useState, useEffect, useContext } from "react";
import ApiContext from "../context/ApiContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
  });

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
          "GET"
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
        const response = await fetchData(
          "dropdown/qualifications",
          "GET"
        );

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
      !form.gender
    ) {
      return Swal.fire("Warning", "Please fill all fields", "warning");
    }

    try {
      setLoading(true);
      const res = await fetchData("mpit/register", "POST", form);

      if (res.success) {
        Swal.fire("Success", "Registration Successful!", "success");
        navigate("/otp-verification", {
          state: { mobile: form.mobile },
        });
      } else {
        Swal.fire("Error", res.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-DGXblue">
            MPIT AI Awareness Program
          </h1>
          <p className="text-gray-500 mt-2">
            Powered by NVIDIA DGX H200
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ================= PERSONAL INFO ================= */}
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
  );
};

export default Registration;