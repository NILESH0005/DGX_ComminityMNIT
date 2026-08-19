import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Users from "./Components/Users";
import Discussions from "./Components/Discussions";
import Events from "./Components/Events";
import GuidelineManager from "./Components/GuidelineManager";
import Contact from "./Components/ContactEdit";
import BlogManager from "./Components/BlogManager";
import Home from "./Components/Home";
import QuizPanel from "./Components/Quiz/QuizPanel";
import QuestionBank from "./Components/Quiz/QuestionBank";
import QuizMapping from "./Components/Quiz/QuizMapping";
import Dashboard from "./Components/Dashboard/DashboardPage";
import {
  FaUsers,
  FaComments,
  FaCalendarAlt,
  FaBlog,
  FaQuestionCircle,
  FaList,
  FaBrain,
  FaChartPie,
  FaCog,
  FaBook,
  FaHome,
  FaEnvelope,
  FaAngleDown,
  FaAngleUp,
  FaBars,
  FaTimes,
  FaGraduationCap,
  FaLayerGroup,
  FaTachometerAlt,
  FaUserCog,
} from "react-icons/fa";
import { FiLayout, FiBookOpen, FiAward, FiHelpCircle, FiBarChart2 } from "react-icons/fi";
import LearningMaterialManager from "./Components/LMS/LearningMaterialManager";
import LearningMaterialList from "./Components/LMS/LearningMaterialList";
import ModuleBuilder from "./Components/LMS/ModuleBuilder/ModuleBuilder";
import DashboardPage from "./Components/Dashboard/DashboardPage";
import ApiContext from "../context/ApiContext";
import QueryManagement from "./Components/LMS/QueryManagement";
import BadgeSetup from "./Components/LMS/BadgeSetup/BadgeSetup";

const AdminDashboard = (props) => {
  const location = useLocation();
  const [activeComp, setActiveComp] = useState("DashboardPage");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const overlayRef = useRef(null);
  const { userToken, fetchData } = useContext(ApiContext);
  const [allowedPages, setAllowedPages] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    if (location.state?.open) {
      setActiveComp(location.state.open);
    }
  }, [location]);

  useEffect(() => {
    const fetchMenuPages = async () => {
      try {
        if (!userToken) return;

        const result = await fetchData(
          "user/pages-by-role",
          "GET",
          {},
          { "auth-token": userToken },
        );

        if (result?.success) {
          setAllowedPages(result.data || []);
        }
      } catch (error) {
        console.error("Failed to load admin sidebar pages", error);
      }
    };

    fetchMenuPages();
  }, [userToken]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const result = await fetchData(
          "dropdown/geteventmaster",
          "GET",
          {},
          { "auth-token": userToken },
        );

        if (result?.success) {
          setEvents(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoadingEvents(false);
      }
    };

    if (userToken) {
      fetchEvents();
    }
  }, [userToken]);

  const hasAccessById = (pageId) => {
    return allowedPages.some((p) => p.PageID === pageId);
  };

  const hasAnyAccessById = (pageIds = []) => {
    return pageIds.some((id) => hasAccessById(id));
  };

  const hasAnyAccess = (pageNames = []) => {
    return pageNames.some((name) => hasAccess(name));
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        sidebarOpen &&
        overlayRef.current &&
        overlayRef.current.contains(event.target) &&
        !event.target.closest(".sidebar-container")
      ) {
        setSidebarOpen(false);
      }
    };

    if (isMobile && sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isMobile, sidebarOpen]);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const getPageLabel = (pageId) =>
    allowedPages.find((p) => p.PageID === pageId)?.DisplayName;

  const getComp = (comp) => {
    switch (comp) {
      case "users":
        return <Users />;
      case "discussions":
        return <Discussions />;
      case "events":
        return <Events events={props.events} setEvents={props.setEvents} />;
      case "blog_manager":
        return <BlogManager blogs={props.blogs} setBlogs={props.setBlogs} />;
      case "quizpanel":
        return <QuizPanel setActiveComp={setActiveComp} />;
      case "quiz_bank":
        return <QuestionBank />;
      case "quiz_mapping":
        return <QuizMapping />;
      case "guidelines":
        return <GuidelineManager />;
      case "Home":
        return <Home />;
      case "DashboardPage":
        return <DashboardPage events={events} loadingEvents={loadingEvents} />;
      case "contact":
        return <Contact />;
      case "select_module":
        return <LearningMaterialManager />;
      case "edit_module":
        return <LearningMaterialList />;
      case "query_management":
        return <QueryManagement />;
      case "badge_setup":
        return <BadgeSetup events={events} loadingEvents={loadingEvents} />;
      default:
        return <Home />;
    }
  };

  const handleMenuItemClick = (comp) => {
    setActiveComp(comp);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Enhanced animations
  const dropdownVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: { 
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
  };

  // Helper to check if menu item is active
  const isActive = (compNames) => {
    if (Array.isArray(compNames)) {
      return compNames.includes(activeComp);
    }
    return activeComp === compNames;
  };

  // Styling helpers
  const getMenuItemClass = (compNames, isDropdown = false) => {
    const baseClass = "group flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200";
    const activeClass = "bg-gradient-to-r from-yellow-400/20 to-yellow-400/5 text-yellow-400 border-r-4 border-yellow-400";
    const hoverClass = "hover:bg-white/5";
    const dropdownClass = isDropdown ? "ml-4 px-4 py-2.5 rounded-lg" : "";
    
    if (isActive(compNames)) {
      return `${baseClass} ${activeClass} ${dropdownClass}`;
    }
    return `${baseClass} ${hoverClass} ${dropdownClass} text-gray-300`;
  };

  const iconClass = "w-5 h-5 flex-shrink-0 mr-3 group-hover:text-yellow-400 transition-colors";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 relative">
      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-gray-900 to-black text-white p-4 flex justify-between items-center sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
            <FiLayout className="text-black text-xl" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-wide">LMS Portal</div>
            <div className="text-xs text-gray-400">Admin Dashboard</div>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white focus:outline-none hover:bg-white/10 p-2 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 mt-16"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - Fixed position on desktop */}
      <motion.div
        className="sidebar-container fixed md:sticky top-0 left-0 h-screen w-full md:w-72 flex-shrink-0 z-30 md:z-0 shadow-2xl"
        style={{ height: '100vh' }}
        initial={isMobile ? "closed" : "open"}
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        <div className="h-full bg-DGXblue text-white flex flex-col overflow-hidden">
          {/* Desktop Sidebar Header */}
          <div className="hidden md:flex items-center px-2 py-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-400/20">
                <FiLayout className="text-black text-2xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wide">Admin Portal</h1>
              </div>
            </div>
          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto w-full px-3 py-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <ul className="space-y-1">
              {/* Dashboard */}
              {hasAccessById(11) && (
                <li>
                  <div
                    className={getMenuItemClass("DashboardPage")}
                    onClick={() => handleMenuItemClick("DashboardPage")}
                  >
                    <FaTachometerAlt className={iconClass} />
                    <span className="font-medium text-sm flex-1">{getPageLabel(11)}</span>
                    {isActive("DashboardPage") && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-1.5 h-1.5 rounded-full bg-yellow-400"
                      />
                    )}
                  </div>
                </li>
              )}

              {/* Home */}
              {hasAccessById(22) && (
                <li>
                  <div
                    className={getMenuItemClass("Home")}
                    onClick={() => handleMenuItemClick("Home")}
                  >
                    <FaHome className={iconClass} />
                    <span className="font-medium text-sm flex-1">Home</span>
                    {isActive("Home") && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-1.5 h-1.5 rounded-full bg-yellow-400"
                      />
                    )}
                  </div>
                </li>
              )}

              {/* Users */}
              {hasAccessById(12) && (
                <li>
                  <div
                    className={getMenuItemClass("users")}
                    onClick={() => handleMenuItemClick("users")}
                  >
                    <FaUsers className={iconClass} />
                    <span className="font-medium text-sm flex-1">Users</span>
                    {isActive("users") && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-1.5 h-1.5 rounded-full bg-yellow-400"
                      />
                    )}
                  </div>
                </li>
              )}

              {/* LMS Section */}
              {hasAccessById(6) && (
                <li>
                  <div
                    className={getMenuItemClass(["select_module", "edit_module", "query_management", "badge_setup"])}
                    onClick={() => toggleDropdown("lms")}
                  >
                    <FaGraduationCap className={iconClass} />
                    <span className="font-medium text-sm flex-1">{getPageLabel(6)}</span>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full mr-2">
                      LMS
                    </span>
                    {openDropdown === "lms" ? (
                      <FaAngleUp className="text-gray-400 text-sm" />
                    ) : (
                      <FaAngleDown className="text-gray-400 text-sm" />
                    )}
                  </div>

                  <AnimatePresence>
                    {openDropdown === "lms" && (
                      <motion.ul
                        className="ml-4 mt-1 space-y-1 overflow-hidden"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={dropdownVariants}
                      >
                        {hasAccessById(17) && (
                          <li>
                            <div
                              className={getMenuItemClass("select_module", true)}
                              onClick={() => handleMenuItemClick("select_module")}
                            >
                              <FiBookOpen className="w-4 h-4 mr-3" />
                              <span className="text-sm">{getPageLabel(17)}</span>
                            </div>
                          </li>
                        )}

                        {hasAccessById(27) && (
                          <li>
                            <div
                              className={getMenuItemClass("badge_setup", true)}
                              onClick={() => handleMenuItemClick("badge_setup")}
                            >
                              <FiAward className="w-4 h-4 mr-3" />
                              <span className="text-sm">{getPageLabel(27)}</span>
                            </div>
                          </li>
                        )}

                        {hasAccessById(18) && (
                          <li>
                            <div
                              className={getMenuItemClass("edit_module", true)}
                              onClick={() => handleMenuItemClick("edit_module")}
                            >
                              <FaCog className="w-4 h-4 mr-3" />
                              <span className="text-sm">{getPageLabel(18)}</span>
                            </div>
                          </li>
                        )}

                        {hasAccessById(23) && (
                          <li>
                            <div
                              className={getMenuItemClass("query_management", true)}
                              onClick={() => handleMenuItemClick("query_management")}
                            >
                              <FiHelpCircle className="w-4 h-4 mr-3" />
                              <span className="text-sm">{getPageLabel(23)}</span>
                            </div>
                          </li>
                        )}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              )}

              {/* Quiz Section */}
              {hasAnyAccessById([19, 20, 21]) && (
                <li>
                  <div
                    className={getMenuItemClass(["quizpanel", "quiz_bank", "quiz_mapping"])}
                    onClick={() => toggleDropdown("quiz")}
                  >
                    <FaBrain className={iconClass} />
                    <span className="font-medium text-sm flex-1">{getPageLabel(5)}</span>
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full mr-2">
                      Quiz
                    </span>
                    {openDropdown === "quiz" ? (
                      <FaAngleUp className="text-gray-400 text-sm" />
                    ) : (
                      <FaAngleDown className="text-gray-400 text-sm" />
                    )}
                  </div>

                  <AnimatePresence>
                    {openDropdown === "quiz" && (
                      <motion.ul
                        className="ml-4 mt-1 space-y-1 overflow-hidden"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={dropdownVariants}
                      >
                        {hasAccessById(19) && (
                          <li>
                            <div
                              className={getMenuItemClass("quizpanel", true)}
                              onClick={() => handleMenuItemClick("quizpanel")}
                            >
                              <FaQuestionCircle className="w-4 h-4 mr-3" />
                              <span className="text-sm">{getPageLabel(19)}</span>
                              <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                                Active
                              </span>
                            </div>
                          </li>
                        )}

                        {hasAccessById(20) && (
                          <li>
                            <div
                              className={getMenuItemClass("quiz_bank", true)}
                              onClick={() => handleMenuItemClick("quiz_bank")}
                            >
                              <FaList className="w-4 h-4 mr-3" />
                              <span className="text-sm">{getPageLabel(20)}</span>
                              <span className="ml-auto text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                                Bank
                              </span>
                            </div>
                          </li>
                        )}

                        {hasAccessById(21) && (
                          <li>
                            <div
                              className={getMenuItemClass("quiz_mapping", true)}
                              onClick={() => handleMenuItemClick("quiz_mapping")}
                            >
                              <FiBarChart2 className="w-4 h-4 mr-3" />
                              <span className="text-sm">{getPageLabel(21)}</span>
                            </div>
                          </li>
                        )}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              )}

              {/* Divider */}
              <li className="my-4 px-4">
                <hr className="border-white/10" />
              </li>

              {/* Discussions */}
              {hasAccessById(13) && (
                <li>
                  <div
                    className={getMenuItemClass("discussions")}
                    onClick={() => handleMenuItemClick("discussions")}
                  >
                    <FaComments className={iconClass} />
                    <span className="font-medium text-sm flex-1">{getPageLabel(13)}</span>
                    {isActive("discussions") && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-1.5 h-1.5 rounded-full bg-yellow-400 ml-2"
                      />
                    )}
                  </div>
                </li>
              )}

              {/* Blog Manager */}
              {hasAccessById(14) && (
                <li>
                  <div
                    className={getMenuItemClass("blog_manager")}
                    onClick={() => handleMenuItemClick("blog_manager")}
                  >
                    <FaBlog className={iconClass} />
                    <span className="font-medium text-sm flex-1">{getPageLabel(14)}</span>
                    {isActive("blog_manager") && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-1.5 h-1.5 rounded-full bg-yellow-400"
                      />
                    )}
                  </div>
                </li>
              )}

              {/* Events */}
              {hasAccessById(15) && (
                <li>
                  <div
                    className={getMenuItemClass("events")}
                    onClick={() => handleMenuItemClick("events")}
                  >
                    <FaCalendarAlt className={iconClass} />
                    <span className="font-medium text-sm flex-1">{getPageLabel(15)}</span>
                    {isActive("events") && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-1.5 h-1.5 rounded-full bg-yellow-400"
                      />
                    )}
                  </div>
                </li>
              )}

              {/* Contact Edit */}
              {hasAccessById(16) && (
                <li>
                  <div
                    className={getMenuItemClass("contact")}
                    onClick={() => handleMenuItemClick("contact")}
                  >
                    <FaEnvelope className={iconClass} />
                    <span className="font-medium text-sm flex-1">{getPageLabel(16)}</span>
                    {isActive("contact") && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-1.5 h-1.5 rounded-full bg-yellow-400"
                      />
                    )}
                  </div>
                </li>
              )}

              {/* Bottom spacer for user profile */}
              <li className="h-20"></li>
            </ul>
          </nav>

          {/* User Profile Footer - Fixed at bottom */}
          <div className="hidden md:block border-t border-white/10 bg-black/50 backdrop-blur-sm flex-shrink-0">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold shadow-lg shadow-yellow-400/20">
                  {userToken ? userToken.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Administrator</p>
                  <p className="text-xs text-gray-400 truncate">admin@lms.com</p>
                </div>
                <FaUserCog className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 min-h-screen overflow-y-auto">
        <div className="p-4 md:p-6">
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100">
            {getComp(activeComp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;