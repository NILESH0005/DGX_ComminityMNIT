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
  const { fetchData, userToken, user } = useContext(ApiContext);
  const navigate = useNavigate();
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const encodeId = (id) => {
    return btoa(id.toString());
  };
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

        // const modulesData = (modulesResponse.data || []).filter(
        //   (module) => module.EventType === user?.EventType,
        // );
        const modulesData = (modulesResponse.data || []).filter((module) => {
          if (Number(user?.EventType) === 0) return true; // show all modules
          return Number(module.EventType) === Number(user?.EventType);
        });
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

    const encodedId = encodeId(moduleId); // ✅ NEW

    localStorage.setItem("moduleName", moduleName);
    localStorage.setItem("moduleId", moduleId); // fallback

    navigate(`/module/${encodedId}`, {
      // ✅ UPDATED
      state: {
        moduleName,
        moduleId,
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
      const baseUploadsUrl = import.meta.env.VITE_API_UPLOADSURL;
      const cleanPath = module.ModuleImagePath.replace(/^\/+/, "");
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

  if (loading) {
    return (
      <div className="min-h-[60vh] p-4 sm:p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col lg:flex-row backdrop-blur-lg bg-white/60 border border-white/40 rounded-3xl overflow-hidden shadow-lg animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="lg:w-5/12 h-56 sm:h-64 lg:h-72 bg-gradient-to-br from-indigo-100 via-purple-50 to-indigo-100"></div>
              <div className="lg:w-7/12 p-6 sm:p-8 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-7 bg-indigo-100/80 rounded-xl w-3/4"></div>
                  <div className="h-4 bg-indigo-100/60 rounded-lg w-full"></div>
                  <div className="h-4 bg-indigo-100/60 rounded-lg w-5/6"></div>
                  <div className="h-4 bg-indigo-100/60 rounded-lg w-4/6"></div>
                </div>
                <div className="h-12 bg-indigo-100/80 rounded-2xl w-44"></div>
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
    <>
      {/* Scoped styles for effects that Tailwind can't express inline */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500&display=swap');

        .module-card {
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .module-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 32px 64px -12px rgba(99, 102, 241, 0.22),
                      0 0 0 1px rgba(99, 102, 241, 0.08);
        }

        /* Number badge on each card */
        .card-index {
          font-family: 'Playfair Display', serif;
        }

        /* Image inner zoom wrapper */
        .img-zoom-wrap {
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .module-card:hover .img-zoom-wrap {
          transform: scale(1.06);
        }

        /* CTA button shimmer sweep */
        .cta-btn {
          position: relative;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        .cta-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform 0.55s ease;
        }
        .cta-btn:hover::after {
          transform: translateX(100%);
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px -4px rgba(99,102,241,0.45);
          background: linear-gradient(135deg, #4338ca, #7c3aed);
        }
        .cta-btn:active {
          transform: translateY(0px);
          box-shadow: 0 4px 12px -2px rgba(99,102,241,0.3);
        }

        /* Diagonal accent line on image overlay */
        .img-accent-line {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 140%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent);
          transform: rotate(-8deg) translateY(-32px);
          pointer-events: none;
        }

        /* Staggered card entrance */
        .card-enter {
          opacity: 0;
          transform: translateY(28px);
          animation: cardSlideUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes cardSlideUp {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Module name font */
        .module-title {
          font-family: 'Playfair Display', serif;
        }
        .module-desc {
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div className="min-h-[70vh] px-4 sm:px-6 py-10 sm:py-14">
        <div className="w-full max-w-5xl mx-auto space-y-8 sm:space-y-10">
          {modules.map((module, idx) => (
            <div
              key={module.ModuleID}
              className="module-card card-enter flex flex-col lg:flex-row backdrop-blur-xl bg-white/75 border border-white/50 rounded-3xl overflow-hidden shadow-xl cursor-pointer group"
              style={{ animationDelay: `${idx * 0.1}s` }}
              onClick={() =>
                handleModuleClick(module.ModuleID, module.ModuleName)
              }
            >
              {/* ── IMAGE SECTION ── */}
              <div className="relative lg:w-5/12 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
                {/* Fixed-height on mobile, full-height on desktop */}
                <div className="h-56 sm:h-72 lg:h-full min-h-0 lg:min-h-[320px]">
                  <div className="img-zoom-wrap w-full h-full">
                    {renderModuleImage(module)}
                  </div>
                </div>

                {/* Gradient veil — subtle, preserves image clarity */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-indigo-900/10 pointer-events-none z-10" />

                {/* Diagonal accent */}
                <div className="img-accent-line z-10" />

                {/* Module number pill */}
                {/* <div className="absolute top-4 left-4 z-20 card-index bg-white/90 backdrop-blur-sm text-indigo-700 text-sm font-bold px-3 py-1 rounded-full shadow-md border border-indigo-100 select-none">
                  {String(idx + 1).padStart(2, "0")}
                </div> */}
              </div>

              {/* ── CONTENT SECTION ── */}
              <div className="lg:w-7/12 flex flex-col justify-between p-6 sm:p-8 lg:p-10 gap-5">
                {/* Top: title + description */}
                <div className="space-y-3">
                  <h2 className="module-title text-2xl sm:text-3xl font-bold text-indigo-900 leading-snug group-hover:text-indigo-600 transition-colors duration-300">
                    {module.ModuleName}
                  </h2>

                  {/* Thin accent bar under title */}
                  <div className="w-12 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 group-hover:w-20 transition-all duration-500" />

                  <p className="module-desc text-gray-500 leading-relaxed text-sm sm:text-base line-clamp-4">
                    {module.ModuleDescription || "No description available."}
                  </p>
                </div>

                {/* STATS — commented block preserved exactly */}
                {/* <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
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
                </div> */}

                {/* Bottom: pill tags + CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
                  {/* Decorative meta pills (static, no logic change) */}
                  {/* <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
                      <FaStar className="text-yellow-400 text-xs" />
                      {(module.Rating ?? 0).toFixed(1)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full">
                      <FaEye className="text-xs" />
                      {module.totalViews}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                      <FaClock className="text-xs" />
                      {formatTimeSmart(module.totalTimeSpent)}
                    </span>
                  </div> */}

                  {/* CTA */}
                  <button className="cta-btn sm:ml-auto flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold text-sm sm:text-base shadow-md w-fit whitespace-nowrap">
                    <FaPlayCircle className="text-lg flex-shrink-0" />
                    Start Learning
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ModuleCard;
