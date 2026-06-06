import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import UserInsightsSection from "./UserInsightsSection";
import LMSDashboardSection from "./LMSDashboardSection";
import RegistrationDashboard from "./RegistrationDashboard";
import ActiveUserCount from "./ActiveUserCount";
import BadgesCountSection from "./BadgesCountSection";
import ApiContext from "../../../context/ApiContext";

const today = new Date().toLocaleDateString("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const DashboardPage = () => {
  const [filterType, setFilterType] = useState("30d");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [calculatedRange, setCalculatedRange] = useState({ from: "", to: "" });
  const [isCustomRangeValid, setIsCustomRangeValid] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { fetchData, userToken } = useContext(ApiContext);

  const formatDateForDisplay = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchEvents = async () => {
    setLoadingEvents(true);

    const endpoint = "dropdown/geteventmaster";
    const method = "GET";

    const headers = {
      "Content-Type": "application/json",
      "auth-token": userToken,
    };

    try {
      const result = await fetchData(endpoint, method, {}, headers);

      if (result.success) {
        setEvents(result.data || []);

        // Auto select first event
        if (result.data?.length > 0) {
          setSelectedEvent(result.data[0]);
        }
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);

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
        // Today only
        fromDate = today;
        toDate = today;
        break;

      case "7d":
        // Last 7 days
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 7);
        break;

      case "30d":
        // Last 30 days
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 30);
        break;

      case "60d":
        // Last 60 days
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 60);
        break;

      case "custom":
        // Use custom dates if both are provided and valid
        if (customFrom && customTo) {
          fromDate = new Date(customFrom);
          toDate = new Date(customTo);
        } else {
          // Don't update if custom range is not complete
          return null;
        }
        break;

      default:
        // Default to 30 days
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

    // Only update calculated range if both dates are valid
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

    // For preset filters, immediately calculate and update
    if (newFilterType !== "custom") {
      const range = calculateDateRange(newFilterType);
      if (range) {
        setCalculatedRange(range);
        // Also update customRange for consistency
        setCustomRange(range);
      }
    } else {
      // For custom filter, check if we have valid dates
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
      // For custom filter, only update if we have valid dates
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

  // Initialize on component mount
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

  // Function to get display text for date range
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

  // Get badge color based on state
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

          {/* <NotVerifiedUsersCount></NotVerifiedUsersCount> */}
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-white border border-[#013D54]/10 rounded-2xl p-4 shadow-lg shadow-[#013D54]/5">
          {/* Label Section */}
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

          {/* Select */}
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
              {events.map((event) => (
                <option key={event.EventID} value={event.EventID}>
                  {event.EventName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 🌟 GLOBAL DATE FILTER - Fixed Section */}

        <motion.div variants={itemVariants}>
          {/* <TrendingSection dateFilter={filterData} />
           */}
          <motion.div
            whileHover={{ y: -1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <RegistrationDashboard selectedEvent={selectedEvent} />
          </motion.div>
        </motion.div>

        {/* <UserCountByDistrict /> */}

        {selectedEvent?.isBadgeEnabled && (
          <motion.div>
            {" "}
            <motion.div
              whileHover={{ y: -1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              {" "}
              <BadgesCountSection selectedEvent={selectedEvent} />{" "}
            </motion.div>{" "}
          </motion.div>
        )}
        {/* <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        ></motion.div> */}
        <motion.div variants={itemVariants} className="bg-DGXgreen">
          <motion.div
            whileHover={{ y: -1 }}
            className=" rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <LMSDashboardSection dateFilter={filterData} />
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
