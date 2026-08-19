import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import UserInsightsSection from "./UserInsightsSection";
import LMSDashboardSection from "./LMSDashboardSection";
import RegistrationDashboard from "./RegistrationDashboard";
import ActiveUserCount from "./ActiveUserCount";
import BadgesCountSection from "./BadgesCountSection";
import ApiContext from "../../../context/ApiContext";
import LMSAnalyticsSection from "./LMSAnalyticsSection";
import QuizInsightsSection from "./QuizInsightsSection.JSX";

const today = new Date().toLocaleDateString("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

// ✅ Accept events as props
const DashboardPage = ({
  events: propEvents = [],
  loadingEvents: propLoadingEvents = false,
}) => {
  const [filterType, setFilterType] = useState("30d");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [calculatedRange, setCalculatedRange] = useState({ from: "", to: "" });
  const [isCustomRangeValid, setIsCustomRangeValid] = useState(false);
  // ✅ Use props events instead of local state
  const [events, setEvents] = useState(propEvents);
  const [loadingEvents, setLoadingEvents] = useState(propLoadingEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { fetchData, userToken } = useContext(ApiContext);

  // ✅ Update events when props change
  useEffect(() => {
    setEvents(propEvents);
    setLoadingEvents(propLoadingEvents);

    // Auto select first event if available
    if (propEvents?.length > 0 && !selectedEvent) {
      setSelectedEvent(propEvents[0]);
    }
  }, [propEvents, propLoadingEvents]);

  const formatDateForDisplay = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // ❌ REMOVE THIS - No longer needed since events come from props
  // const fetchEvents = async () => {
  //   // ... removed
  // };

  // ❌ REMOVE THIS useEffect - No longer needed
  // useEffect(() => {
  //   fetchEvents();
  // }, []);

  const formatDateReadable = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateDateRange = (type, customFrom = "", customTo = "") => {
    const today = new Date();
    let fromDate = new Date();
    let toDate = new Date();

    switch (type) {
      case "today":
        fromDate = today;
        toDate = today;
        break;

      case "7d":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 7);
        break;

      case "30d":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 30);
        break;

      case "60d":
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 60);
        break;

      case "custom":
        if (customFrom && customTo) {
          fromDate = new Date(customFrom);
          toDate = new Date(customTo);
        } else {
          return null;
        }
        break;

      default:
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 30);
    }

    return {
      from: formatDateForDisplay(fromDate),
      to: formatDateForDisplay(toDate),
    };
  };

  const validateCustomRange = (from, to) => {
    if (!from || !to) return false;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return fromDate <= toDate;
  };

  const handleCustomRangeChange = (field, value) => {
    const newCustomRange = {
      ...customRange,
      [field]: value,
    };

    setCustomRange(newCustomRange);

    const isValid = validateCustomRange(newCustomRange.from, newCustomRange.to);
    setIsCustomRangeValid(isValid);

    if (isValid && filterType === "custom") {
      const range = calculateDateRange(
        "custom",
        newCustomRange.from,
        newCustomRange.to,
      );
      if (range) {
        setCalculatedRange(range);
      }
    }
  };

  const handleFilterChange = (e) => {
    const newFilterType = e.target.value;
    setFilterType(newFilterType);

    if (newFilterType !== "custom") {
      const range = calculateDateRange(newFilterType);
      if (range) {
        setCalculatedRange(range);
        setCustomRange(range);
      }
    } else {
      const isValid = validateCustomRange(customRange.from, customRange.to);
      setIsCustomRangeValid(isValid);

      if (isValid) {
        const range = calculateDateRange(
          "custom",
          customRange.from,
          customRange.to,
        );
        if (range) {
          setCalculatedRange(range);
        }
      }
    }
  };

  useEffect(() => {
    if (filterType !== "custom") {
      const range = calculateDateRange(filterType);
      if (range) {
        setCalculatedRange(range);
        setCustomRange(range);
        setIsCustomRangeValid(true);
      }
    } else {
      const isValid = validateCustomRange(customRange.from, customRange.to);
      setIsCustomRangeValid(isValid);

      if (isValid) {
        const range = calculateDateRange(
          "custom",
          customRange.from,
          customRange.to,
        );
        if (range) {
          setCalculatedRange(range);
        }
      }
    }
  }, [filterType]);

  useEffect(() => {
    const range = calculateDateRange("30d");
    if (range) {
      setCalculatedRange(range);
      setCustomRange(range);
      setIsCustomRangeValid(true);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const filterData = {
    type: filterType,
    from:
      isCustomRangeValid || filterType !== "custom" ? calculatedRange.from : "",
    to: isCustomRangeValid || filterType !== "custom" ? calculatedRange.to : "",
    displayText: getDateRangeDisplayText(
      filterType,
      calculatedRange.from,
      calculatedRange.to,
      isCustomRangeValid,
    ),
    isValid: filterType !== "custom" ? true : isCustomRangeValid,
  };

  function getDateRangeDisplayText(type, from, to, isValid = true) {
    if (type === "custom" && !isValid) {
      return "Select both dates (from ≤ to)";
    }

    if (type === "today") {
      return `Today (${formatDateReadable(from)})`;
    } else if (type === "custom") {
      return `Custom: ${formatDateReadable(from)} - ${formatDateReadable(to)}`;
    } else {
      return `${formatDateReadable(from)} - ${formatDateReadable(to)}`;
    }
  }

  const getBadgeColor = () => {
    if (filterType === "custom" && !isCustomRangeValid) {
      return "bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-700 border-yellow-200";
    }
    return "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200";
  };

  return (
    <motion.div
      className="min-h-screen font-inter"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>

            <div className="flex items-center md:justify-end">
              <ActiveUserCount selectedEvent={selectedEvent} />
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-white border border-[#013D54]/10 rounded-2xl p-4 shadow-lg shadow-[#013D54]/5">
          <div className="flex items-center gap-3 min-w-fit">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#013D54] to-[#01516e] flex items-center justify-center shadow-md">
              <svg
                className="w-5 h-5 text-[#76B900]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#76B900] font-bold">
                Event Dashboard
              </p>

              <h3
                className="text-lg font-bold text-[#013D54]"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Select Event
              </h3>
            </div>
          </div>

          <div className="flex-1">
            <select
              className="w-full bg-[#f8fafc] border border-[#013D54]/10 rounded-xl px-2 py-2.5 text-[#013D54] font-medium shadow-sm outline-none transition-all duration-300 focus:border-[#76B900] focus:ring-4 focus:ring-[#76B900]/15 hover:border-[#013D54]/20"
              value={selectedEvent?.EventID || ""}
              onChange={(e) => {
                const selected = events.find(
                  (item) => item.EventID === Number(e.target.value),
                );
                setSelectedEvent(selected);
              }}
            >
              {loadingEvents ? (
                <option value="">Loading events...</option>
              ) : (
                <>
                  <option value="">-- Select Event --</option>
                  {events.map((event) => (
                    <option key={event.EventID} value={event.EventID}>
                      {event.EventName}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        </div>

        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ y: -1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <RegistrationDashboard selectedEvent={selectedEvent} />
          </motion.div>
        </motion.div>

        {selectedEvent?.isBadgeEnabled ? (
          <motion.div>
            <motion.div
              whileHover={{ y: -1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <BadgesCountSection selectedEvent={selectedEvent} />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="text-4xl mb-3">🏅</div>

              <h3 className="text-lg font-semibold text-gray-800">
                No Badges Available
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                No badges are available on this LMS.
              </p>
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="bg-white">
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div
              whileHover={{ y: -1 }}
              className="rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <LMSDashboardSection
                dateFilter={filterData}
                selectedEvent={selectedEvent}
              />
            </motion.div>

            <LMSAnalyticsSection selectedEvent={selectedEvent} />

            <QuizInsightsSection
              selectedEvent={selectedEvent}
              dateFilter={filterData}
            />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ y: -1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <UserInsightsSection
              dateFilter={filterData}
              selectedEvent={selectedEvent}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
