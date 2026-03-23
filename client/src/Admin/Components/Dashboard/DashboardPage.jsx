import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import UserInsightsSection from "./UserInsightsSection";
import LMSDashboardSection from "./LMSDashboardSection";
import RegistrationDashboard from "./RegistrationDashboard";
import BadgesCountSection from "./BadgesCountSection";
import ActiveUserCount from "./ActiveUserCount";
import NotVerifiedUsersCount from "./NotVerifiedUsersCount";

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

  const formatDateForDisplay = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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

  // Combined filter object passed to all children
  // For custom filter, only pass if range is valid
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
      className="min-h-screen p-6 font-inter"
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
    <ActiveUserCount />
  </div>

</div>

{/* <NotVerifiedUsersCount></NotVerifiedUsersCount> */}

        </motion.div>

        {/* 🌟 GLOBAL DATE FILTER - Fixed Section */}

        <motion.div variants={itemVariants}>
          {/* <TrendingSection dateFilter={filterData} />
           */}
          <RegistrationDashboard />
           
        </motion.div>

        <motion.div>
          <BadgesCountSection />
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* <div className="lg:col-span-2 space-y-6">
            <motion.div
              whileHover={{ y: -1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <ApprovalSection dateFilter={filterData} />
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              whileHover={{ y: -1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <TopContentSection dateFilter={filterData} />
            </motion.div>
          </div> */}
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ y: -1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <UserInsightsSection dateFilter={filterData} />
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.div
            whileHover={{ y: -1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
          >
            <LMSDashboardSection dateFilter={filterData} />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
