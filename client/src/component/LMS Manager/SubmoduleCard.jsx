import React, { useState, useEffect, useContext } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import ApiContext from "../../context/ApiContext";
import ByteArrayImage from "../../utils/ByteArrayImage";
import ProgressBar from "./ProgressBar";
import {
  FaAngleDown,
  FaAngleUp,
  FaClock,
  FaEye,
  FaStar,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";
import images from "../../../public/images";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

// ── Roadmap sub-components ──────────────────────────────────────────────────
import ModuleHeader from "./roadmap/ModuleHeader";
import RoadmapContainer from "./roadmap/RoadmapContainer";

// ── Framer Motion variants ──────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.12)" },
};

const imageVariants = {
  hover: { scale: 1.05 },
  initial: { scale: 1 },
};

// ── Milestone color palette – cycles if more than 7 submodules ─────────────
const MILESTONE_PALETTE = [
  { color: "#FF6B6B", bg: "#FFF0F0" },
  { color: "#FFA94D", bg: "#FFF4E6" },
  { color: "#69DB7C", bg: "#EBFBEE" },
  { color: "#4DABF7", bg: "#E7F5FF" },
  { color: "#CC5DE8", bg: "#F8F0FC" },
  { color: "#F06595", bg: "#FFF0F6" },
  { color: "#FFD43B", bg: "#FFF9DB" },
];

const SubModuleCard = () => {
  const { moduleId: encodedModuleId } = useParams();
  const decodeId = (encoded) => {
    if (!encoded) return null;

    try {
      // base64 check
      if (!/^[A-Za-z0-9+/=]+$/.test(encoded)) {
        return encoded; // already plain ID
      }

      return atob(encoded);
    } catch (error) {
      console.warn("Invalid encoded ID, using raw value:", encoded);
      return encoded; // fallback
    }
  };
  const decodedId = decodeId(encodedModuleId);
  const moduleId = decodedId || localStorage.getItem("moduleId");
  const [searchParams] = useSearchParams();
  const [subModules, setSubModules] = useState([]);
  const [moduleName, setModuleName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchData, userToken, user } = useContext(ApiContext);
  const [progressData, setProgressData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [viewedSubModules, setViewedSubModules] = useState(new Set());
  const [subModuleViews, setSubModuleViews] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [subModuleRatings, setSubModuleRatings] = useState({});
  const [hoverRatings, setHoverRatings] = useState({});
  const [ratingsLoaded, setRatingsLoaded] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // ── isSubModuleCompleted – define this early ──
  const isSubModuleCompleted = (subModuleId) => {
    if (!progressData) return false;
    const dataArray = Array.isArray(progressData)
      ? progressData
      : [progressData];
    const sm = dataArray.find(
      (p) =>
        p && // null check
        String(p.SubModuleID) === String(subModuleId),
    );
    return sm?.IsCompleted === true || sm?.isCompleted === true;
  };

  // ── API helpers ───────────────────────────────────────────────────────────
  const checkModuleCompletion = async () => {
    try {
      const res = await fetchData(
        "quiz/check-module-completion",
        "GET",
        {},
        { "auth-token": userToken },
      );

      if (res?.success) {
        setQuizCompleted(res.quizIsComplete);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubModuleRatings = async (subModuleIds) => {
    try {
      const responses = await Promise.all(
        subModuleIds.map((id) =>
          fetchData(
            `lms/submodule-rating/${id}`,
            "GET",
            {},
            { "auth-token": userToken },
          ),
        ),
      );
      const ratings = {};
      responses.forEach((res, index) => {
        if (res?.success) ratings[subModuleIds[index]] = res.data;
      });
      setSubModuleRatings(ratings);
      setRatingsLoaded(true);
    } catch (err) {
      console.error("Failed to fetch ratings", err);
      setRatingsLoaded(true);
    }
  };

  const handleCertificateClick = async () => {
    // First check if all submodules are completed
    if (!allSubModulesCompleted) {
      const remainingCount = subModules.filter(
        (sm) => !isSubModuleCompleted(sm.SubModuleID),
      ).length;
      Swal.fire({
        icon: "info",
        title: "🔒 Quiz Locked",
        html: `
        <div style="text-align:center;font-family:'Nunito',sans-serif;">
          <p style="color:#4b5563;margin-bottom:12px;font-size:15px;">
            You need to complete all milestones before you can take the quiz!
          </p>
          <div style="display:inline-flex;align-items:center;gap:8px;background:#fef3c7;border:1.5px solid #f59e0b;border-radius:10px;padding:8px 16px;">
            <span style="font-size:18px;">📚</span>
            <span style="color:#92400e;font-weight:700;font-size:13px;">
              ${remainingCount} milestone${remainingCount !== 1 ? "s" : ""} remaining
            </span>
          </div>
          <p style="color:#6b7280;font-size:12px;margin-top:12px;">
            Complete all video modules to unlock the final quiz
          </p>
        </div>
      `,
        confirmButtonColor: "#6b7280",
        confirmButtonText: "Got it",
        showCloseButton: true,
      });
      return;
    }

    // If all submodules are completed, then proceed with quiz
    try {
      const res = await fetchData(
        "quiz/getRandomQuiz",
        "POST",
        {},
        { "auth-token": userToken },
      );

      if (!res?.success) {
        throw new Error("Failed to fetch quiz");
      }

      const quiz = res.data;
      console.log("Random Quiz:", quiz);

      navigate("/quiz", {
        state: {
          quiz: {
            QuizID: quiz.QuizID,
            group_id: quiz.QuizCategory,
            title: quiz.QuizName,
            QuizDuration: quiz.QuizDuration,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching random quiz:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load quiz. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const recordSubModuleView = async (subModuleId) => {
    try {
      if (!userToken) return;
      const response = await fetchData(
        "progressTrack/recordView",
        "POST",
        { ProcessName: "LMS", reference: subModuleId },
        { "Content-Type": "application/json", "auth-token": userToken },
      );
      if (response?.success) {
        if (response.data.alreadyViewed)
          console.log("View was already recorded previously");
        else
          console.log("First-time view recorded successfully:", response.data);
      }
    } catch (error) {
      console.error("Error recording submodule view:", error);
    }
  };

  const rateSubModule = async (subModuleId, ratingValue, subModuleName) => {
    try {
      if (!userToken) {
        Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: "Please login to rate this submodule",
          confirmButtonColor: "#3b82f6",
        });
        return;
      }
      if (Number.isFinite(subModuleRatings[subModuleId]?.myRating)) {
        Swal.fire({
          icon: "info",
          title: "Already Rated",
          text: "You have already rated this submodule. Rating can only be done once.",
          confirmButtonColor: "#6b7280",
          showConfirmButton: true,
          timer: 3000,
        });
        return;
      }
      const result = await Swal.fire({
        title: "Rate Submodule",
        html: `<div class="text-center"><p class="mb-3">You are about to rate:</p><p class="font-bold text-lg text-blue-600 mb-4">${subModuleName}</p><div class="flex justify-center gap-2 mb-4">${[1, 2, 3, 4, 5].map((s) => `<span class="text-3xl ${s <= ratingValue ? "text-yellow-400" : "text-gray-300"}">★</span>`).join("")}</div><p class="text-gray-600 text-sm">Rating: <span class="font-bold">${ratingValue} out of 5</span></p><p class="text-gray-500 text-xs mt-2">Note: Rating can only be done once per submodule</p></div>`,
        showCancelButton: true,
        confirmButtonText: "Submit Rating",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#6b7280",
        reverseButtons: true,
        customClass: {
          confirmButton: "px-6 py-2 rounded-lg",
          cancelButton: "px-6 py-2 rounded-lg",
        },
      });
      if (!result.isConfirmed) return;

      setRatingLoading(true);
      const response = await fetchData(
        "lms/rate-submodule",
        "POST",
        { reference: subModuleId, rating: ratingValue },
        { "Content-Type": "application/json", "auth-token": userToken },
      );

      if (response?.success) {
        const updated = await fetchData(
          `lms/submodule-rating/${subModuleId}`,
          "GET",
          {},
          { "auth-token": userToken },
        );
        if (updated?.success) {
          setSubModuleRatings((prev) => ({
            ...prev,
            [subModuleId]: {
              ...prev[subModuleId],
              myRating: ratingValue,
              avgRating: updated.data.avgRating,
              totalRatings: updated.data.totalRatings,
            },
          }));
          const avg = updated.data?.avgRating || 0;
          Swal.fire({
            icon: "success",
            title: "Rating Submitted!",
            html: `<div class="text-center"><div class="flex justify-center gap-1 mb-3">${[1, 2, 3, 4, 5].map((s) => `<span class="text-2xl ${s <= ratingValue ? "text-yellow-400" : "text-gray-200"}">★</span>`).join("")}</div><p class="text-gray-700">Your rating: <span class="font-bold text-green-600">${ratingValue}/5</span></p><p class="text-gray-700">Average rating: <span class="font-bold text-blue-600">${avg.toFixed(1)}/5</span></p></div>`,
            confirmButtonColor: "#10b981",
            showConfirmButton: true,
            timer: 5000,
          });
        } else {
          const updatedRatings = {
            ...subModuleRatings,
            [subModuleId]: {
              ...(subModuleRatings[subModuleId] || {}),
              myRating: ratingValue,
              avgRating:
                response.data?.newAverageRating ||
                subModuleRatings[subModuleId]?.avgRating ||
                0,
              totalRatings:
                (subModuleRatings[subModuleId]?.totalRatings || 0) + 1,
            },
          };
          setSubModuleRatings(updatedRatings);
          const avg = updatedRatings[subModuleId]?.avgRating || 0;
          Swal.fire({
            icon: "success",
            title: "Rating Submitted!",
            html: `<div class="text-center"><div class="flex justify-center gap-1 mb-3">${[1, 2, 3, 4, 5].map((s) => `<span class="text-2xl ${s <= ratingValue ? "text-yellow-400" : "text-gray-200"}">★</span>`).join("")}</div><p class="text-gray-700">Your rating: <span class="font-bold text-green-600">${ratingValue}/5</span></p><p class="text-gray-700">Average rating: <span class="font-bold text-blue-600">${avg.toFixed(1)}/5</span></p></div>`,
            confirmButtonColor: "#10b981",
            showConfirmButton: true,
            timer: 5000,
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Rate",
          text:
            response?.message || "Failed to submit rating. Please try again.",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (error) {
      console.error("Rate submodule error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while rating. Please try again.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setRatingLoading(false);
    }
  };

  const handleSubModuleClick = async (subModule) => {
    await recordSubModuleView(subModule.SubModuleID);

    const encodedId = btoa(subModule.SubModuleID);

    // ✅ SAVE FALLBACK HERE
    localStorage.setItem("submoduleId", subModule.SubModuleID);

    navigate(`/submodule/${encodedId}`, {
      state: {
        moduleId,
        moduleName,
        submoduleName: subModule.SubModuleName,
      },
    });
  };

  // ── Fetch all data ─────────────────────────────────────────────────────────
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const subModulesResponse = await fetchData(
        `dropdown/getSubModules?moduleId=${moduleId}`,
        "GET",
      );

      if (!subModulesResponse?.success) {
        setError(subModulesResponse?.message || "Failed to fetch submodules");
        return;
      }

      setSubModules(subModulesResponse.data);
      const subModuleIds = subModulesResponse.data.map((s) => s.SubModuleID);
      await fetchSubModuleRatings(subModuleIds);

      // Progress (general)
      const progressResponse = await fetchData(
        "progressTrack/getModuleSubmoduleProgress",
        "POST",
        { moduleID: moduleId },
        { "Content-Type": "application/json", "auth-token": userToken },
      );
      if (progressResponse?.success) setProgressData(progressResponse.data);

      // Completion status – this will override progressData
      const completionResponse = await fetchData(
        "video-progress/getSubmoduleCompletionStatus",
        "POST",
        { moduleID: moduleId },
        { "Content-Type": "application/json", "auth-token": userToken },
      );
      console.log("submodule progress response", completionResponse);

      if (completionResponse?.success) {
        const data = completionResponse.data;
        setProgressData(Array.isArray(data) ? data : [data]);
      }

      const viewsResponse = await fetchData("lms/submodule-views", "GET");
      if (viewsResponse?.success) setSubModuleViews(viewsResponse.data);

      const initialExpandedState = {};
      subModulesResponse.data.forEach((s) => {
        initialExpandedState[s.SubModuleID] = false;
      });
      setExpandedDescriptions(initialExpandedState);

      if (!moduleName) {
        const currentModule = subModulesResponse.data[0]?.ModuleName;
        if (currentModule) {
          setModuleName(currentModule);
          if (!searchParams.get("moduleName"))
            navigate(`?moduleName=${encodeURIComponent(currentModule)}`, {
              replace: true,
            });
        }
      }
    } catch (error) {
      console.error("Error in fetchAllData:", error);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (totalSeconds) => {
    if (!totalSeconds || totalSeconds === 0) return "Not started";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const getProgressPercentage = (totalSeconds) => {
    return Math.round(Math.min((totalSeconds / 900) * 100, 100));
  };

  const renderSubModuleImage = (subModule) => {
    const baseUploadsUrl = import.meta.env.VITE_API_UPLOADSURL;

    if (subModule.SubModuleImagePath) {
      const cleanPath = subModule.SubModuleImagePath.replace(/^\/+/, "");
      return (
        <motion.img
          src={`${baseUploadsUrl}/${cleanPath}`}
          alt={subModule.SubModuleName}
          className="w-full h-full object-cover"
          variants={imageVariants}
          initial="initial"
          whileHover="hover"
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = images.Noimage;
          }}
          loading="lazy"
        />
      );
    }

    if (subModule.SubModuleImageUrl) {
      return (
        <motion.img
          src={subModule.SubModuleImageUrl}
          alt={subModule.SubModuleName}
          className="w-full h-full object-cover"
          variants={imageVariants}
          initial="initial"
          whileHover="hover"
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = images.Noimage;
            e.target.className = "w-full h-full object-contain bg-gray-200 p-4";
          }}
          loading="lazy"
        />
      );
    }

    if (subModule.SubModuleImage) {
      return (
        <motion.div
          className="w-full h-full overflow-hidden"
          variants={imageVariants}
          initial="initial"
          whileHover="hover"
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ByteArrayImage
            byteArray={subModule.SubModuleImage.data}
            className="w-full h-full object-cover"
          />
        </motion.div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-green-100">
        <img
          src={images.Noimage}
          alt="No Image Available"
          className="w-2/3 h-2/3 object-contain opacity-70"
          loading="lazy"
        />
      </div>
    );
  };

  const showRatingInfo = (subModuleId, subModuleName, myRating) => {
    const ratingData = subModuleRatings[subModuleId] || {};
    const avgRating = ratingData.avgRating || 0;
    const totalRatings = ratingData.totalRatings || 0;
    let html = `<div class="text-left"><p class="font-bold text-lg text-blue-600 mb-2">${subModuleName}</p><div class="mb-4"><p class="text-sm text-gray-600 mb-1">Average Rating</p><div class="flex items-center gap-2"><div class="flex">${[1, 2, 3, 4, 5].map((s) => `<span class="text-xl ${s <= avgRating ? "text-yellow-400" : "text-gray-300"}">★</span>`).join("")}</div><span class="text-gray-700 font-bold">${avgRating.toFixed(1)}/5</span><span class="text-gray-500 text-sm">(${totalRatings} rating${totalRatings !== 1 ? "s" : ""})</span></div></div>`;
    if (Number.isFinite(myRating)) {
      html += `<div class="mb-4"><p class="text-sm text-gray-600 mb-1">Your Rating</p><div class="flex items-center gap-2"><div class="flex">${[1, 2, 3, 4, 5].map((s) => `<span class="text-xl ${s <= myRating ? "text-yellow-400" : "text-gray-300"}">★</span>`).join("")}</div><span class="text-gray-700 font-bold">${myRating}/5</span><span class="text-green-500">✓</span></div></div>`;
    } else {
      html += `<div class="mb-4 p-3 bg-blue-50 rounded-lg"><p class="text-blue-800 text-sm">You haven't rated this submodule yet.</p></div>`;
    }
    html += `<div class="text-sm text-gray-500 mt-3 pt-3 border-t"><p>Rating can only be done once per submodule</p></div></div>`;
    Swal.fire({
      title: "Rating Details",
      html,
      confirmButtonColor: "#3b82f6",
      confirmButtonText: "Got it",
      showCloseButton: true,
    });
  };

  const handleStarClickWhenRated = (subModuleId, subModuleName, myRating) => {
    Swal.fire({
      icon: "info",
      title: "Already Rated",
      html: `<div class="text-center"><p class="mb-3">You have already rated:</p><p class="font-bold text-lg text-blue-600 mb-4">${subModuleName}</p><div class="flex justify-center gap-2 mb-4">${[1, 2, 3, 4, 5].map((s) => `<span class="text-3xl ${s <= myRating ? "text-yellow-400" : "text-gray-300"}">★</span>`).join("")}</div><p class="text-gray-700">Your rating: <span class="font-bold text-green-600">${myRating}/5</span></p></div>`,
      confirmButtonColor: "#6b7280",
      confirmButtonText: "Got it",
    });
  };

  useEffect(() => {
    const nameFromParams = searchParams.get("moduleName");
    if (nameFromParams) setModuleName(decodeURIComponent(nameFromParams));
    else if (location.state?.moduleName)
      setModuleName(location.state.moduleName);
    fetchAllData();
    checkModuleCompletion();
  }, [moduleId, userToken, location.key]);

  const toggleDescription = (subModuleId, event) => {
    event.stopPropagation();
    setExpandedDescriptions((prev) => ({
      ...prev,
      [subModuleId]: !prev[subModuleId],
    }));
  };

  // ── Build roadmap milestones ──────────────────────────────────────────────
  const sortedSubModules = [...subModules].sort(
    (a, b) => a.SortingOrder - b.SortingOrder,
  );

  const roadmapMilestones = sortedSubModules.map((sm, i) => {
    const palette = MILESTONE_PALETTE[i % MILESTONE_PALETTE.length];
    const subModuleView = subModuleViews.find(
      (v) => v.subModuleID === sm.SubModuleID,
    );
    const totalTimeSpent = subModuleView?.totalTimeSpent || 0;
    const totalViews = subModuleView?.totalViews || 0;
    const ratingData = subModuleRatings[sm.SubModuleID] || {};
    const avgRating = ratingData.avgRating || 0;
    const myRating = ratingData.myRating;
    const totalRatings = ratingData.totalRatings || 0;
    const progressPercentage = getProgressPercentage(totalTimeSpent);

    let isUnlocked = false;
    if (i === 0) {
      isUnlocked = true;
    } else {
      const prevSm = sortedSubModules[i - 1];
      isUnlocked = isSubModuleCompleted(prevSm.SubModuleID);
    }

    const isCompleted = isSubModuleCompleted(sm.SubModuleID);

    return {
      id: i + 1,
      color: palette.color,
      bg: palette.bg,
      title: sm.SubModuleName,
      tag: `Step ${i + 1}`,
      desc: sm.SubModuleDescription
        ? sm.SubModuleDescription.slice(0, 60) +
          (sm.SubModuleDescription.length > 60 ? "…" : "")
        : "",
      isUnlocked,
      isCompleted,
      _raw: sm,
      _cardProps: {
        subModule: sm,
        totalTimeSpent,
        totalViews,
        avgRating,
        myRating,
        totalRatings,
        progressPercentage,
        palette,
        isUnlocked,
        isCompleted,
      },
    };
  });

  // ⭐ CALCULATE THESE AFTER ALL DATA IS READY ⭐
  const allSubModulesCompleted =
    subModules.length > 0 &&
    subModules.every((sm) => isSubModuleCompleted(sm.SubModuleID));

  const isCertificateReady = allSubModulesCompleted && quizCompleted;

  // console.log("Completion states:", {
  //   allSubModulesCompleted,
  //   quizCompleted,
  //   isCertificateReady,
  //   subModulesCount: subModules.length,
  //   progressData,
  // });

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #e8f4fd 0%, #eef7e8 40%, #fef9e7 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: MILESTONE_PALETTE[i].color,
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <p style={{ color: "#718096", fontSize: 14, fontWeight: 600 }}>
            Loading your learning path…
          </p>
          <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0.8);opacity:0.5}40%{transform:scale(1.2);opacity:1}}`}</style>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #e8f4fd 0%, #eef7e8 40%, #fef9e7 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 32,
            maxWidth: 400,
            textAlign: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <p style={{ color: "#ef4444", marginBottom: 16, fontWeight: 600 }}>
            {error}
          </p>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "10px 24px",
              background: "#f3f4f6",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 700,
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Back to Modules
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: `radial-gradient(circle at 20% 30%, #d9f99d 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, #a7f3d0 0%, transparent 40%),
            linear-gradient(180deg, #e6f7ff 0%, #f0fdf4 50%, #fefce8 100%)`,
        fontFamily: "'Nunito', sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      <ModuleHeader
        moduleName={moduleName}
        onBack={() => navigate("/LearningPath")}
      />

      {subModules.length > 0 ? (
        <div
          style={{
            width: "100%",
            padding: "0 16px 93px",
            position: "relative",
          }}
        >
          <RoadmapContainer
            milestones={roadmapMilestones}
            onMilestoneNavigate={(m) => handleSubModuleClick(m._raw)}
            expandedDescriptions={expandedDescriptions}
            hoverRatings={hoverRatings}
            setHoverRatings={setHoverRatings}
            ratingLoading={ratingLoading}
            ratingsLoaded={ratingsLoaded}
            rateSubModule={rateSubModule}
            handleStarClickWhenRated={handleStarClickWhenRated}
            showRatingInfo={showRatingInfo}
            renderImage={renderSubModuleImage}
            formatTime={formatTime}
            toggleDescription={toggleDescription}
            onCertificateClick={handleCertificateClick}
            userGender={user?.Gender || user?.gender || "unknown"}
            allSubModulesCompleted={allSubModulesCompleted}
            quizCompleted={quizCompleted}
            isCertificateReady={isCertificateReady}
            user={user}
            moduleName={moduleName}
          />
        </div>
      ) : (
        <div style={{ padding: "40px 24px", textAlign: "center" }}>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 32,
              maxWidth: 400,
              margin: "0 auto",
              boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
            }}
          >
            <p style={{ color: "#6b7280", marginBottom: 16 }}>
              No submodules found for this module
            </p>
            <button
              onClick={() => navigate(-1)}
              style={{
                padding: "10px 24px",
                background: "#f3f4f6",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 700,
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              Back to Modules
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-50"
      />
    </div>
  );
};

export default SubModuleCard;
