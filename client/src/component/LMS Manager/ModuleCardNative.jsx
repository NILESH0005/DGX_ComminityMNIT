import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ApiContext from "../../context/ApiContext";
import ByteArrayImage from "../../utils/ByteArrayImage";
import ModuleStats from "./ModuleStats";
import {
  FaAngleDown,
  FaAngleUp,
} from "react-icons/fa";
import Swal from "sweetalert2";
import images from "../../../public/images";

const ModuleCardNative = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const { fetchData, userToken, user } = useContext(ApiContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken || !user) {
      console.log("⛔ Waiting for user & token...");
      return;
    }

    const fetchModulesAndViews = async () => {
      try {
        setLoading(true);
        console.log("🔥 Fetching modules...");

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

        console.log("✅ Modules Loaded:", mergedModules);
        setModules(mergedModules);

        const initialExpandedState = {};
        mergedModules.forEach(
          (m) => (initialExpandedState[m.ModuleID] = false),
        );
        setExpandedDescriptions(initialExpandedState);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
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
  }, [userToken, user]);

  const handleModuleClick = (module) => {
    console.log("Clicked module name:", module.ModuleName);

    if (!userToken) {
      Swal.fire({
        title: "Login Required",
        text: "You need to login to access this module",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Go to Login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) navigate("/SignInn");
      });
      return;
    }

    const moduleName = module.ModuleName?.trim().toLowerCase();

    // Store common data
    localStorage.setItem("moduleName", module.ModuleName);
    localStorage.setItem("moduleId", module.ModuleID);
    localStorage.setItem("uiType", module.UIKey);
    localStorage.setItem("onBackShowSubModule", module.onBackShowSubModule);
    localStorage.setItem("EventType", module.EventType);
    localStorage.setItem(
      "quizAccessOnSubModuleCompletion",
      module.quizAccessOnSubModuleCompletion,
    );
    localStorage.setItem("hasCertificate", module.hasCertificate);

    const navigationState = {
      moduleName: module.ModuleName,
      moduleId: module.ModuleID,
      uiType: module.UIKey,
      onBackShowSubModule: module.onBackShowSubModule,
      quizAccessOnSubModuleCompletion: module.quizAccessOnSubModuleCompletion,
      hasCertificate: module.hasCertificate,
    };

    // Different pages for different module names
    if (moduleName === "ai user enablement program") {
      navigate("/CoursePage", { state: navigationState });
      return;
    }

    if (moduleName === "ai awareness for all") {
      navigate("/AwarenessPage", { state: navigationState });
      return;
    }

    if (moduleName === "native ai engineer training") {
      navigate("/NativeAiCoursePage", { state: navigationState });
      return;
    }

    // Default module page
    const encodedId = btoa(module.ModuleID.toString());
    navigate(`/module/${encodedId}`, { state: navigationState });
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
      const baseUploadsUrl = import.meta.env.VITE_API_UPLOADSURL;
      const cleanPath = module.ModuleImagePath?.replace(/^\/+/, "") || "";
      return (
        <img
          src={`${baseUploadsUrl}/${cleanPath}`}
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

  const getTypeStyles = (eventType) => {
    const typeMap = {
      1: 'green',
      2: 'blue',
      3: 'gold',
    };

    const type = typeMap[eventType] || 'green';

    switch (type) {
      case 'green':
        return {
          borderTop: 'border-t-[3px] border-t-[#00C9A7]',
          badgeBg: 'bg-[#00C9A7]/12',
          badgeColor: 'text-[#00a388]'
        };
      case 'blue':
        return {
          borderTop: 'border-t-[3px] border-t-[#3B82F6]',
          badgeBg: 'bg-[#3B82F6]/10',
          badgeColor: 'text-[#2563EB]'
        };
      case 'gold':
        return {
          borderTop: 'border-t-[3px] border-t-[#F59E0B]',
          badgeBg: 'bg-[#F59E0B]/10',
          badgeColor: 'text-[#D97706]'
        };
      default:
        return {
          borderTop: 'border-t-[3px] border-t-[#00C9A7]',
          badgeBg: 'bg-[#00C9A7]/12',
          badgeColor: 'text-[#00a388]'
        };
    }
  };

  const getBadgeInfo = (eventType) => {
    const badgeMap = {
      1: { text: 'For Everyone', icon: 'ti-users' },
      2: { text: 'For Students', icon: 'ti-school' },
      3: { text: 'For Professionals', icon: 'ti-briefcase' },
    };
    return badgeMap[eventType] || { text: 'Learning Path', icon: 'ti-certificate' };
  };

  const getLevelInfo = (eventType) => {
    const levelMap = {
      1: 'Beginner',
      2: 'Intermediate',
      3: 'Advanced',
    };
    return levelMap[eventType] || 'Beginner';
  };

  if (loading) {
    return (
      <div className="w-full">
        {/* Horizontal scrollable skeleton */}
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm animate-pulse flex-shrink-0 w-[280px] sm:w-[300px]"
            >
              <div className="h-44 bg-gradient-to-r from-gray-100 to-gray-200"></div>
              <div className="p-5 space-y-4">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const userEventIds = user?.EventIDs || [];

  return (
    <div className="w-full">
      {/* Horizontal scrollable container */}
      <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1">
        {modules.map((module) => {
          const isUnlocked = userEventIds.includes(Number(module.EventType));
          const styles = getTypeStyles(module.EventType);
          const badgeInfo = getBadgeInfo(module.EventType);
          const levelInfo = getLevelInfo(module.EventType);

          return (
            <div
              key={module.ModuleID}
              onClick={() => {
                if (!isUnlocked) {
                  Swal.fire({
                    icon: "warning",
                    title: "🔒 Module Locked",
                    text: "You are not eligible for this learning path.",
                    confirmButtonColor: "#6b7280",
                  });
                  return;
                }
                handleModuleClick(module);
              }}
              className={`
                bg-white border border-gray-200 rounded-2xl
                transition-all duration-300 relative overflow-hidden shadow-sm
                flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px]
                flex flex-col
                ${styles.borderTop}
                ${isUnlocked
                  ? "hover:border-gray-300 hover:shadow-md cursor-pointer"
                  : "opacity-50 grayscale cursor-not-allowed"
                }
              `}
            >
              {/* Image Section */}
              <div className="h-44 overflow-hidden relative flex-shrink-0">
                {renderModuleImage(module)}
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                    <div className="bg-gray-900 px-4 py-2 rounded-2xl text-sm font-bold text-white shadow-lg flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Locked
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
               

                  {/* Title - Medium size with hover effect */}
                  <h3 className={`
                    text-lg sm:text-xl font-bold mb-2 
                    transition-colors duration-300 break-words leading-snug
                    ${isUnlocked ? 'group-hover:text-DGXgreen text-gray-900' : 'text-gray-700'}
                  `}>
                    {module.ModuleName}
                  </h3>

                {/* Stats Component */}
                <ModuleStats
                  stats={{
                    views: module.totalViews,
                    duration: module.totalTimeSpent,
                    rating: module.Rating,
                    totalRatings: module.totalRatings
                  }}
                />

                {/* Description */}
                <div className="mb-4 mt-3 flex-1">
                  <p
                    className={`text-gray-600 text-sm leading-relaxed ${
                      expandedDescriptions[module.ModuleID]
                        ? "overflow-y-auto max-h-28"
                        : "line-clamp-2"
                    }`}
                  >
                    {module.ModuleDescription || "No description available."}
                  </p>

                  {isDescriptionClamped(module.ModuleDescription) && (
                    <button
                      onClick={(e) => toggleDescription(module.ModuleID, e)}
                      className="text-[#00C9A7] hover:text-[#00a388] mt-2 text-xs flex items-center gap-1 transition-colors"
                    >
                      {expandedDescriptions[module.ModuleID] ? (
                        <>
                          <FaAngleUp className="text-xs" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <FaAngleDown className="text-xs" />
                          Read More
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Level Badge */}
                {/* <div className="pt-3 border-t border-gray-100 mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Level</span>
                    <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                      {levelInfo}
                    </span>
                  </div>
                </div> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleCardNative;