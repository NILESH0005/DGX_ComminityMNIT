import React, { useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import Papa from "papaparse";

import {
  FiUpload,
  FiDownload,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import ApiContext from "../context/ApiContext";
import { validateRow } from "../utils/csvValidator";

const StudentRegisteration = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { fetchData, userToken } = useContext(ApiContext);
  const [successRows, setSuccessRows] = useState([]);
  const [errorRows, setErrorRows] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [hasErrors, setHasErrors] = useState(false);
  const [allValid, setAllValid] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const loadMasters = async () => {
      try {
        // districts for UP
        const districtRes = await fetchData(
          "dropdown/districts/UTTAR PRADESH",
          "GET",
        );

        // qualifications
        const qualRes = await fetchData("dropdown/qualifications", "GET");

        if (districtRes.success) {
          setDistricts(districtRes.data);
        }

        if (qualRes.success) {
          setQualifications(qualRes.data);
        }
      } catch (err) {
        Swal.fire("Error", "Failed to load master data", "error");
      }
    };

    loadMasters();
  }, []);

  const districtMap = new Map(
    districts.map((d) => [d.DistrictName.toLowerCase(), d.DistrictID]),
  );

  const qualificationMap = new Map(
    qualifications.map((q) => [
      q.QualificationName.toLowerCase(),
      q.QualificationID,
    ]),
  );

  const uploadCsvFile = async () => {
    try {
      if (!file) {
        Swal.fire("Error", "Please select a CSV file", "error");
        return;
      }
      setCurrentStep(4);
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      const response = await fetchData("user/upload-csv", "POST", formData, {});

      console.log("what is response", response);

      if (response.success) {
        Swal.fire("Success", `${response.inserted} users imported`, "success");

        setFile(null);
        setLoading(false);
        setSuccessRows(response.successRows || []);
        setErrorRows(response.errors || []);
        Swal.fire("Success", `${response.inserted} users imported`, "success");
      } else {
        const preview = response.errors.map((item) => ({
          name: item.row.Name,
          email: item.row.EmailId,
          mobile: item.row.MobileNumber,
          status: "Invalid",
          error: item.errors.join(", "),
        }));
        console.log("preview data", preview);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

      console.error("UPLOAD ERROR:", error);

      Swal.fire(
        "Error",
        error?.response?.data?.message || error.message || "Upload failed",
        "error",
      );
    }
  };

  const handleFileChange = (e) => {
    if (!e.target.files.length) return;

    const uploadedFile = e.target.files[0];
    setCurrentStep(2);
    e.target.value = "";
    setSuccessRows([]);
    setErrorRows([]);
    setHasErrors(false);
    setAllValid(false);
    setFile(uploadedFile);

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;

        const validRows = [];
        const invalidRows = [];

        rows.forEach((row) => {
          const rowErrors = validateRow(row, districtMap, qualificationMap);

          if (rowErrors.length > 0) {
            invalidRows.push({
              row,
              errors: rowErrors,
            });
          } else {
            validRows.push(row);
          }
        });

        setSuccessRows(validRows);
        setErrorRows(invalidRows);
        setCurrentStep(3);

        if (invalidRows.length > 0) {
          setHasErrors(true);
          setAllValid(false);
        } else {
          setHasErrors(false);
          setAllValid(true);
        }
      },
    });
  };

  const downloadTemplate = () => {
    setCurrentStep(1);

    const csvContent =
      "Name,EmailId,MobileNumber,Gender,District,CollegeName,Qualification";

    const blob = new Blob([csvContent], { type: "text/csv" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "student_upload_template.csv";
    link.click();
  };

  const downloadCsv = (rows, filename) => {
    if (!rows.length) return;

    let formattedRows = rows.map((item) => {
      if (item.row) {
        return {
          ...item.row,
          Error: item.errors.join("; "),
        };
      }
      return item;
    });

    const headers = Object.keys(formattedRows[0]);

    const csv = [
      headers.join(","),
      ...formattedRows.map((row) =>
        headers.map((field) => `"${row[field] || ""}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Student Bulk Registration</h1>

      <div className="flex items-center gap-6 mb-10">
        {/* Step 1 */}

        <div
          className={`flex items-center gap-2 ${currentStep >= 1 ? "text-green-600" : "text-gray-400"}`}
        >
          <div
            className={`w-8 h-8 rounded-full text-white flex items-center justify-center 
      ${currentStep >= 1 ? "bg-green-600" : "bg-gray-300"}`}
          >
            1
          </div>
          Download Template
        </div>

        <div className="border-t w-16"></div>

        {/* Step 2 */}

        <div
          className={`flex items-center gap-2 ${currentStep >= 2 ? "text-green-600" : "text-gray-400"}`}
        >
          <div
            className={`w-8 h-8 rounded-full text-white flex items-center justify-center 
      ${currentStep >= 2 ? "bg-green-600" : "bg-gray-300"}`}
          >
            2
          </div>
          Upload CSV
        </div>

        <div className="border-t w-16"></div>

        {/* Step 3 */}

        <div
          className={`flex items-center gap-2 ${currentStep >= 3 ? "text-green-600" : "text-gray-400"}`}
        >
          <div
            className={`w-8 h-8 rounded-full text-white flex items-center justify-center 
      ${currentStep >= 3 ? "bg-green-600" : "bg-gray-300"}`}
          >
            3
          </div>
          Validate
        </div>

        <div className="border-t w-16"></div>

        {/* Step 4 */}

        <div
          className={`flex items-center gap-2 ${currentStep >= 4 ? "text-green-600" : "text-gray-400"}`}
        >
          <div
            className={`w-8 h-8 rounded-full text-white flex items-center justify-center 
      ${currentStep >= 4 ? "bg-green-600" : "bg-gray-300"}`}
          >
            4
          </div>
          Import
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Download Template */}

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">Download CSV Template</h3>

          <p className="text-sm text-gray-500 mb-4">
            Download the template and fill student data before uploading.
          </p>

          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FiDownload />
            Download Template
          </button>
        </div>

        {/* Upload CSV */}

        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">Upload CSV File</h3>

          <label
            htmlFor="csvUpload"
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400"
          >
            <FiUpload size={28} className="text-gray-500 mb-2" />
            <p className="text-sm text-gray-500">Click or drag CSV file here</p>
          </label>

          <input
            id="csvUpload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />

          {file && (
            <p className="mt-3 text-sm text-green-600">
              File Selected: {file.name}
            </p>
          )}
        </div>
      </div>
      {/* Import Summary */}

      {allValid && (
        <div className="bg-white shadow rounded-xl p-6 flex justify-between items-center mt-6">
          <button
            disabled={loading}
            onClick={uploadCsvFile}
            className={`px-6 py-2 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Importing..." : "Import Valid Students"}
          </button>
        </div>
      )}

      <div className="flex gap-4 mt-6">
        {/* Only invalid data download */}

        {hasErrors && (
          <button
            onClick={() => downloadCsv(errorRows, "invalid_students.csv")}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Download Invalid Data
          </button>
        )}

        {/* Only valid data download */}

        {allValid && (
          <button
            onClick={() => downloadCsv(successRows, "valid_students.csv")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Download Valid Data
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentRegisteration;
