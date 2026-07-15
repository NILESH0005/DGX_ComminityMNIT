import React, { useEffect, useState, useContext } from "react";
import ApiContext from "../../../context/ApiContext";
import EditModule from "./EditableComponents/EditModule.jsx";
import EditSubModule from "./EditableComponents/EditSubModule.jsx";
import Swal from "sweetalert2";
import ModuleOrder from "./EditableComponents/ModuleOrder.jsx";

const LearningMaterialList = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showModuleOrder, setShowModuleOrder] = useState(false);
  const { fetchData, userToken, user } = useContext(ApiContext);
  const [reloadKey, setReloadKey] = useState(0);
  const [submodules, setSubmodules] = useState([]);
  const [batches, setBatches] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState("MY_LMS");
  const [approvalRequests, setApprovalRequests] = useState([]);
  const [approvalCount, setApprovalCount] = useState(0);

  useEffect(() => {
    const fetchDataAll = async () => {
      try {
        setLoading(true);

        const headers = {
          "auth-token": userToken,
        };

        const [moduleRes, batchRes, approvalRes] = await Promise.all([
          fetchData("dropdown/getAdminModules", "GET", {}, headers),
          fetchData("dropdown/course-batches", "GET", {}, headers),
          fetchData("lms/getApprovalRequests", "GET", {}, headers),
        ]);

        if (moduleRes?.success) {
          const sortedModules = [...moduleRes.data].sort((a, b) => {
            const orderA = a.SortingOrder || Number.MAX_SAFE_INTEGER;
            const orderB = b.SortingOrder || Number.MAX_SAFE_INTEGER;
            return orderA - orderB || a.ModuleID - b.ModuleID;
          });

          setModules(sortedModules);
        }

        if (batchRes?.success) {
          setBatches(batchRes.data);
        }
        if (approvalRes?.success) {
          setApprovalRequests(approvalRes.data);
          setApprovalCount(approvalRes.data.length);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAll();
  }, [fetchData, reloadKey, userToken]);

  const handleViewSubmodules = (moduleId) => {
    const module = modules.find((mod) => mod.ModuleID === moduleId);
    if (module) {
      setSelectedModule(module);
    }
    console.log("id ?", moduleId);
  };

  const handleSubmoduleUpdated = (updatedSubmodule) => {
    setSubmodules((prev) =>
      prev.map((sub) =>
        sub.SubModuleID === updatedSubmodule.SubModuleID
          ? updatedSubmodule
          : sub,
      ),
    );
  };

  const handleBackToList = () => {
    setSelectedModule(null);
  };

  const handleDeleteModule = async (moduleId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "OK",
    });

    if (!result.isConfirmed) return;

    try {
      // console.log("Deleting module with ID:", moduleId, typeof moduleId);

      const response = await fetchData(
        "lmsEdit/deleteModule",
        "POST",
        { moduleId },
        {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
      );

      if (response?.success) {
        setModules((prev) => prev.filter((mod) => mod.ModuleID !== moduleId));
        Swal.fire("Deleted!", "Module has been deleted.", "success");
      } else {
        throw new Error(response?.message || "Failed to delete module");
      }
    } catch (err) {
      // console.error("Full error details:", err);
      Swal.fire("Error!", `Failed to delete module: ${err.message}`, "error");
    }
  };

  // const handleModuleUpdated = (updatedModule) => {
  //   setModules((prevModules) =>
  //     prevModules.map((mod) =>
  //       mod.ModuleID === updatedModule.ModuleID ? updatedModule : mod,
  //     ),
  //   );
  // };

  const handleApprovalUpdated = (updatedModule) => {
    setModules((prev) =>
      prev.map((module) =>
        module.ModuleID === updatedModule.ModuleID
          ? {
              ...module,
              ...updatedModule,
            }
          : module,
      ),
    );

    if (updatedModule.ApprovalStatus === "Pending") {
      setApprovalRequests((prev) =>
        prev.map((module) =>
          module.ModuleID === updatedModule.ModuleID
            ? {
                ...module,
                ...updatedModule,
              }
            : module,
        ),
      );
    } else {
      setApprovalRequests((prev) =>
        prev.filter((module) => module.ModuleID !== updatedModule.ModuleID),
      );
    }

    setApprovalCount((prev) =>
      updatedModule.ApprovalStatus === "Pending" ? prev : Math.max(prev - 1, 0),
    );
  };

  const handleSaveModuleOrder = async (orderedModules) => {
    try {
      // Prepare modules with their new order positions
      const modulesWithOrder = orderedModules.map((module, index) => ({
        ModuleID: module.ModuleID,
        SortingOrder: index + 1,
      }));

      const response = await fetchData(
        "lmsEdit/updateModuleOrder",
        "POST",
        { modules: modulesWithOrder },
        {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
      );

      if (response?.success) {
        const updatedModules = [...modules]
          .map((module) => {
            const updatedModule = modulesWithOrder.find(
              (m) => m.ModuleID === module.ModuleID,
            );
            return updatedModule
              ? { ...module, SortingOrder: updatedModule.SortingOrder }
              : module;
          })
          .sort((a, b) => (a.SortingOrder || 0) - (b.SortingOrder || 0));

        setModules(updatedModules);
        setShowModuleOrder(false);
        Swal.fire("Success!", "Module order has been updated.", "success");
      } else {
        throw new Error(response?.message || "Failed to update module order");
      }
    } catch (err) {
      // console.error("Error updating module order:", err);
      Swal.fire(
        "Error!",
        `Failed to update module order: ${err.message}`,
        "error",
      );
    }
  };
  const filteredModules =
    statusFilter === "All"
      ? modules
      : modules.filter((module) => module.ApprovalStatus === statusFilter);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500 text-center">Error: {error}</div>;
  }

  if (selectedModule) {
    return (
      <EditSubModule
        module={selectedModule}
        submodules={submodules}
        setSubmodules={setSubmodules} // Pass the setter
        onBack={handleBackToList}
            onApprovalUpdated={handleApprovalUpdated}
      
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Module Details Header */}
      <div className="border-b border-gray-200 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Module Details</h1>
          <p className="text-gray-600 mt-1">Manage all learning modules</p>
        </div>
        <button
          onClick={() => setShowModuleOrder(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Manage Module Order
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setViewMode("MY_LMS")}
          className={`px-5 py-2 rounded-xl font-medium transition
      ${viewMode === "MY_LMS" ? "bg-blue-600 text-white" : "bg-white border"}`}
        >
          All LMS
        </button>

        <button
          onClick={() => setViewMode("APPROVAL")}
          className={`px-5 py-2 rounded-xl font-medium transition flex items-center gap-2
      ${
        viewMode === "APPROVAL" ? "bg-orange-500 text-white" : "bg-white border"
      }`}
        >
          LMS for Approval
          {approvalCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {approvalCount}
            </span>
          )}
        </button>
      </div>
      {/* Status Filters */}
      {viewMode === "MY_LMS" && (
        <div className="flex justify-center sm:justify-start">
          <div className="inline-flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-1 shadow-sm">
            {[
              {
                label: "All",
                color: "blue",
              },
              {
                label: "Draft",
                color: "gray",
              },
              {
                label: "Pending",
                color: "yellow",
              },
              {
                label: "Approved",
                color: "green",
              },
              {
                label: "Rejected",
                color: "red",
              },
            ].map(({ label, color }) => (
              <button
                key={label}
                onClick={() => setStatusFilter(label)}
                className={`
          relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
          ${
            statusFilter === label
              ? {
                  blue: "bg-blue-500 text-white shadow-md",
                  gray: "bg-gray-700 text-white shadow-md",
                  yellow: "bg-yellow-500 text-white shadow-md",
                  green: "bg-green-500 text-white shadow-md",
                  red: "bg-red-500 text-white shadow-md",
                }[color]
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }
        `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Module Order Modal */}
      {showModuleOrder && (
        <ModuleOrder
          modules={modules}
          onClose={() => setShowModuleOrder(false)}
          onSave={handleSaveModuleOrder}
        />
      )}
      {modules.length === 0 ? (
        <div className="text-gray-500 text-center">
          No modules found. Create your first module to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {" "}
          {(viewMode === "MY_LMS" ? filteredModules : approvalRequests).map(
            (module) => (
              <EditModule
                key={module.ModuleID}
                module={module}
                batches={batches}
                onDelete={handleDeleteModule}
                onViewSubmodules={handleViewSubmodules}
                onApprovalUpdated={handleApprovalUpdated}
                isApprovalView={viewMode === "APPROVAL"}
                currentUserID={user.UserID}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default LearningMaterialList;
