import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ApiContext from "../../context/ApiContext";
import ByteArrayImage from "../../utils/ByteArrayImage";
import {
  FaAngleDown,
  FaAngleUp,
  FaEye,
  FaClock,
  FaPlayCircle,
  FaStar,
  FaUsers,
} from "react-icons/fa";
import Swal from "sweetalert2";
import images from "../../../public/images";

const ModuleCard = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchData, userToken } = useContext(ApiContext);
  const navigate = useNavigate();
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    const fetchModulesAndViews = async () => {
      try {
        setLoading(true);

        const [modulesResponse, viewsResponse] = await Promise.all([
          fetchData("dropdown/getModules", "GET"),
          fetchData("lms/module-views", "GET"),
        ]);

        if (!modulesResponse?.success) {
          throw new Error(modulesResponse?.message || "Failed to load modules");
        }

        const modulesData = modulesResponse.data || [];
        const viewsData = viewsResponse?.data || [];
        const ratingRequests = modulesData.map((module) =>
          fetchData(`lms/module-rating/${module.ModuleID}`, "GET"),
        );

        const ratingResponses = await Promise.all(ratingRequests);

        const mergedModules = modulesData.map((module, index) => {
          const viewEntry = viewsData.find(
            (v) => v.moduleID === module.ModuleID,
          );

          const ratingData = ratingResponses[index]?.data || {};

          return {
            ...module,
            totalViews: viewEntry ? viewEntry.totalViews : 0,
            totalTimeSpent: viewEntry ? Number(viewEntry.totalTimeSpent) : 0,
            Rating: ratingData.avgRating ?? 0,
            totalRatings: ratingData.totalRatings ?? 0,
          };
        });

        setModules(mergedModules);
        const initialExpandedState = {};
        mergedModules.forEach(
          (m) => (initialExpandedState[m.ModuleID] = false),
        );
        setExpandedDescriptions(initialExpandedState);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          title: "Error",
          text: error.message || "Failed to fetch module data",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchModulesAndViews();
  }, [fetchData]);

  const handleModuleClick = (moduleId, moduleName) => {
    if (!userToken) {
      Swal.fire({
        title: "Login Required",
        text: "You need to login to access this module",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Go to Login",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#4f46e5",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/SignInn");
        }
      });
      return;
    }
    localStorage.setItem("moduleName", moduleName);
    localStorage.setItem("moduleId", moduleId);
    navigate(`/module/${moduleId}`, {
      state: {
        moduleName: moduleName,
        moduleId: moduleId,
      },
    });
  };

  const toggleDescription = (moduleId, event) => {
    event.stopPropagation();
    setExpandedDescriptions((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const isDescriptionClamped = (description) =>
    description && description.length > 100;

  const renderModuleImage = (module) => {
    if (module.ModuleImageUrl) {
      return (
        <img
          src={module.ModuleImageUrl}
          alt={module.ModuleName}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = images.Noimage;
            e.target.className = "w-full h-full object-contain bg-gray-200 p-4";
          }}
        />
      );
    }
    if (module.ModuleImage) {
      return (
        <ByteArrayImage
          byteArray={module.ModuleImage.data}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      );
    }
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-indigo-100 to-purple-100">
        <img
          src={images.Noimage}
          alt="No Image Available"
          className="w-2/3 h-2/3 object-contain opacity-70"
        />
      </div>
    );
  };
  if (loading) {
    return (
      <div className="min-h-[60vh] p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="backdrop-blur-lg bg-white/60 border border-white/40 rounded-3xl overflow-hidden shadow-lg animate-pulse"
            >
              <div className="h-48 bg-gradient-to-r from-indigo-100 to-purple-100"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-white/70 rounded w-3/4"></div>
                <div className="h-4 bg-white/70 rounded w-1/4"></div>
                <div className="h-16 bg-white/70 rounded"></div>
                <div className="h-10 bg-white/70 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const formatTimeSmart = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) return "0m";

    const minutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    }

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }

    if (minutes > 0) {
      return `${minutes}m`;
    }

    return `${totalSeconds}s`;
  };

  return (
    <div className="min-h-[70vh] p-6 flex items-center justify-center">
      <div className="w-full max-w-6xl">
        {modules.map((module) => (
          <div
            key={module.ModuleID}
            onClick={() =>
              handleModuleClick(module.ModuleID, module.ModuleName)
            }
            className="flex flex-col lg:flex-row backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl overflow-hidden shadow-2xl hover:shadow-indigo-200 transition-all duration-500 cursor-pointer group"
          >
            {/* IMAGE SECTION */}
            <div className="lg:w-1/2 h-72 lg:h-auto overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 z-10"></div>

              <div className="h-full w-full group-hover:scale-105 transition-transform duration-700">
                {renderModuleImage(module)}
              </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="lg:w-1/2 p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold text-indigo-900 mb-4 group-hover:text-indigo-600 transition">
                  {module.ModuleName}
                </h2>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {module.ModuleDescription || "No description available."}
                </p>

                {/* STATS */}
                <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <FaEye className="text-indigo-500" />
                    <span>{module.totalViews} Views</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaClock className="text-purple-500" />
                    <span>{formatTimeSmart(module.totalTimeSpent)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    <span>{(module.Rating ?? 0).toFixed(1)}</span>
                    <span className="text-sm text-gray-400">
                      ({module.totalRatings})
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA BUTTON */}
              <button className="mt-4 flex items-center gap-3 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition transform group-hover:scale-105 w-fit">
                <FaPlayCircle />
                Start Learning
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleCard;
