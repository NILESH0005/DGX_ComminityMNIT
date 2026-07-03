import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const ModuleApprovalCard = ({
  module,
  fetchData,
  userToken,
  onApprovalUpdated,
  isApprovalView = false,
  onViewSubmodules,
  currentUserID,
}) => {
  const [approvalUsers, setApprovalUsers] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [remark, setRemark] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const isCreator = Number(module.AuthAdd) === Number(currentUserID);

  useEffect(() => {
    if (!isApprovalView && module.ApprovalStatus === "Draft" && isCreator) {
      loadApprovalUsers();
    }
  }, [module.ApprovalStatus, isApprovalView]);

  const loadApprovalUsers = async () => {
    try {
      const res = await fetchData(
        "dropdown/getApprovalUsers",
        "GET",
        {},
        {
          "auth-token": userToken,
        },
      );

      if (res.success) {
        setApprovalUsers(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleApprove = async () => {
    const { value: remark } = await Swal.fire({
      title: "Approve LMS",
      input: "textarea",
      inputPlaceholder: "Enter approval remark (optional)",
      showCancelButton: true,
      confirmButtonText: "Approve",
      confirmButtonColor: "#16a34a",
    });

    if (remark === undefined) return;

    try {
      const response = await fetchData(
        "lms/approveModule",
        "POST",
        {
          LMSID: module.ModuleID,
          Remark: remark,
        },
        {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
      );

      if (response.success) {
        Swal.fire("Approved", response.message, "success");

        onApprovalUpdated?.({
          ...module,
          ApprovalStatus: "Approved",
          ApprovalRemark: remark,
          ApprovalUserName: response.data.ApprovalUserName,
          ApprovalDate: response.data.ApprovalDate,
          ApprovalUpdatedOn: response.data.ApprovalUpdatedOn,
        });
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleReject = async () => {
    const { value: remark } = await Swal.fire({
      title: "Reject LMS",
      input: "textarea",
      inputPlaceholder: "Enter rejection reason",
      showCancelButton: true,
      confirmButtonText: "Reject",
      confirmButtonColor: "#dc2626",
    });

    if (remark === undefined) return;

    try {
      const response = await fetchData(
        "lms/rejectLMS",
        "POST",
        {
          LMSID: module.ModuleID,
          Remark: remark,
        },
        {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
      );

      if (response.success) {
        Swal.fire("Rejected", response.message, "success");

        onApprovalUpdated?.({
          ...module,
          ApprovalStatus: "Rejected",
          ApprovalRemark: remark,
          ApprovalUserName: response.data.ApprovalUserName,
          ApprovalDate: response.data.ApprovalDate,
          ApprovalUpdatedOn: response.data.ApprovalUpdatedOn,
        });
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Draft":
        return "bg-slate-100 text-slate-700 border-slate-300";

      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";

      case "Approved":
        return "bg-green-100 text-green-700 border-green-300";

      case "Rejected":
        return "bg-red-100 text-red-700 border-red-300";

      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleSendForApproval = async () => {
    if (!selectedReviewer) {
      Swal.fire(
        "Reviewer Required",
        "Please select an approval user.",
        "warning",
      );
      return;
    }

    try {
      const response = await fetchData(
        "lms/sendForApproval",
        "POST",
        {
          LMSID: module.ModuleID,
          ApprovalUserID: selectedReviewer,
        },
        {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
      );

      if (response.success) {
        Swal.fire("Success", "Module sent for approval.", "success");

        onApprovalUpdated?.({
          ...module,
          ApprovalStatus: "Pending",
          ApprovalRemark: "Waiting for review.",
          ApprovalUserID: selectedReviewer,
          ApprovalUserName: response.data.ApprovalUserName,
          ApprovalUpdatedOn: response.data.ApprovalUpdatedOn,
        });
      } else {
        Swal.fire("Error", response.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const renderApprovalContent = () => {
    switch (module.ApprovalStatus) {
      case "Draft":
        if (isCreator) {
          return (
            <>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                  Current Remark
                </p>

                <p className="text-sm text-gray-700">{module.ApprovalRemark}</p>
              </div>

              <div className="border-t border-dashed border-gray-200"></div>
              <div className="py-2">
                <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2 pt-2">
                  Select Reviewer
                </label>

                <select
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={selectedReviewer}
                  onChange={(e) => setSelectedReviewer(e.target.value)}
                >
                  <option value="">Select Reviewer</option>
                  {approvalUsers.map((user) => (
                    <option key={user.UserID} value={user.UserID}>
                      {user.Name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSendForApproval}
                className="
              w-full
              rounded-lg
              bg-DGXblue
              hover:bg-DGXblue
              text-white
              text-sm
              font-medium
              p-2
              transition
              "
              >
                Send For Approval
              </button>
            </>
          );
        }

      case "Pending":
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs uppercase text-gray-400">Reviewer</p>

                <p className="text-sm font-medium mt-1">
                  {module.ApprovalUserName}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs uppercase text-gray-400">Submitted</p>

                <p className="text-sm font-medium mt-1">
                  {module.ApprovalUpdatedOn
                    ? new Date(module.ApprovalUpdatedOn).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
              <p className="text-sm text-yellow-700">Waiting for approval.</p>
            </div>

            {isApprovalView ? (
              <>
                <div className="mt-5 flex flex-col gap-3">
                  <button
                    onClick={() => onViewSubmodules(module.ModuleID)}
                    className="w-full rounded-xl border border-DGXblue text-DGXblue hover:bg-DGXblue hover:text-white py-3 font-medium transition"
                  >
                    👁 Review LMS
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleReject}
                      className="rounded-xl border border-red-200 bg-red-50 py-3 text-red-600 hover:bg-red-600 hover:text-white transition"
                    >
                      Reject
                    </button>

                    <button
                      onClick={handleApprove}
                      className="rounded-xl bg-green-600 py-3 text-white hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </>
            ) : null}
          </>
        );
      case "Approved":
        return (
          <>
            <p>
              <strong>Approved By:</strong> {module.ApprovalUserName}
            </p>

            <p>
              <strong>Approved On:</strong>{" "}
              {module.ApprovalDate
                ? new Date(module.ApprovalDate).toLocaleString()
                : "-"}
            </p>

            <p>
              <strong>Remark:</strong> {module.ApprovalRemark}
            </p>

            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-green-700">
              This LMS has been approved.
            </div>

            {isApprovalView && (
              <div className="flex justify-end pt-3">
                <button
                  onClick={() => onViewSubmodules(module.ModuleID)}
                  className="px-4 py-2 rounded-lg bg-DGXblue text-white text-sm"
                >
                  View LMS
                </button>
              </div>
            )}
          </>
        );

      case "Rejected":
        return (
          <>
            <p>
              <strong>Rejected By:</strong> {module.ApprovalUserName}
            </p>

            <p>
              <strong>Reason:</strong> {module.ApprovalRemark}
            </p>

            <div className="flex justify-end pt-2">
              {isApprovalView ? (
                <div className="flex justify-end pt-3">
                  <button
                    onClick={() => onViewSubmodules(module.ModuleID)}
                    className="px-4 py-2 rounded-lg bg-DGXblue text-white text-sm"
                  >
                    View LMS
                  </button>
                </div>
              ) : (
                <div className="flex justify-end pt-3">
                  <button className="px-5 py-2 rounded-lg bg-DGXblue text-white">
                    Send for Approval
                  </button>
                </div>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* CLICKABLE HEADER */}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              module.ApprovalStatus === "Approved"
                ? "bg-green-500"
                : module.ApprovalStatus === "Pending"
                  ? "bg-yellow-500"
                  : module.ApprovalStatus === "Rejected"
                    ? "bg-red-500"
                    : "bg-gray-500"
            }`}
          />

          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">
              Approval Workflow
            </p>

            <p className="text-xs text-gray-500">Click to view details</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${getStatusStyle(
              module.ApprovalStatus,
            )}`}
          >
            {module.ApprovalStatus}
          </span>

          {isOpen ? (
            <FaAngleUp className="text-gray-500" />
          ) : (
            <FaAngleDown className="text-gray-500" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 p-5">
          {renderApprovalContent()}
        </div>
      )}
    </div>
  );
};

export default ModuleApprovalCard;
