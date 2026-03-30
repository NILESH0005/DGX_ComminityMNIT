import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { images } from "../../public/index.js";
import { AiOutlineMenu } from "react-icons/ai";
import { IoMdCloseCircleOutline } from "react-icons/io";
import clsx from "clsx";
import ApiContext from "../context/ApiContext.jsx";
import Cookies from "js-cookie";
import {
  faHome,
  faComments,
  faCalendar,
  faBlog,
  faEnvelope,
  faBook,
  faUser,
  faCog,
  faSignOutAlt,
  faChalkboardTeacher,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaBrain } from "react-icons/fa";
import Swal from "sweetalert2";
import { navbarRouteMap } from "../utils/pageRouteMap.js";

const Navbar = () => {
  const [isSideMenuOpen, setMenu] = useState(false);
  const [allowedPages, setAllowedPages] = useState([]);
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const { user, userToken, setUserToken, logOut, fetchData } =
    useContext(ApiContext);
  console.log("Navbar userToken:", userToken);

  const isLoggedIn = !!(userToken && user);
  const location = useLocation();
  const navigate = useNavigate();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [imageVersion, setImageVersion] = useState(0);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const normalize = (name) => name?.toLowerCase().replace(/\s+/g, "").trim();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to log out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        setDropdownOpen(false);
        Cookies.remove("userToken");
        setUserToken(null);
        navigate("/SignInn");
      }
    });
  };

  // Fetch user data including daysRemaining
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userToken) {
        setDaysRemaining(null);
        setUserName("");
        setProfilePicture(null);
        return;
      }

      // First, try to get data from localStorage (where login data might be stored)
      const storedUserData = localStorage.getItem("userLoginData");
      if (storedUserData) {
        try {
          const parsedData = JSON.parse(storedUserData);
          if (parsedData.daysRemaining !== undefined) {
            setDaysRemaining(parsedData.daysRemaining);
            setUserName(parsedData.name || user?.Name || "");
            setProfilePicture(parsedData.profilePicture || user?.ProfilePicture);
            return;
          }
        } catch (e) {
          console.error("Error parsing stored user data:", e);
        }
      }

      // If no localStorage data, try to fetch from API
      try {
        // Try multiple possible endpoints
        const endpoints = [
          "user/get-profile",
          "user/me",
          "user/dashboard",
          "user/profile"
        ];
        
        let userData = null;
        
        for (const endpoint of endpoints) {
          try {
            const response = await fetchData(
              endpoint,
              "GET",
              {},
              {
                "auth-token": userToken,
              }
            );
            
            if (response?.success && response?.data) {
              userData = response.data;
              break;
            }
          } catch (err) {
            console.log(`Endpoint ${endpoint} failed:`, err);
          }
        }
        
        if (userData) {
          setDaysRemaining(userData.daysRemaining || null);
          setUserName(userData.name || userData.Name || user?.Name || "");
          setProfilePicture(userData.profilePicture || userData.ProfilePicture || user?.ProfilePicture);
          
          // Store in localStorage for future use
          localStorage.setItem("userLoginData", JSON.stringify({
            daysRemaining: userData.daysRemaining,
            name: userData.name || userData.Name,
            profilePicture: userData.profilePicture || userData.ProfilePicture
          }));
        } else if (user) {
          // Fallback to existing user data from context
          setUserName(user.Name || user.name || "");
          setProfilePicture(user.ProfilePicture || user.profilePicture);
          
          // If user object has daysRemaining, use it
          if (user.daysRemaining !== undefined) {
            setDaysRemaining(user.daysRemaining);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [userToken, fetchData, user]);

  useEffect(() => {
    const fetchMenuPages = async () => {
      try {
        if (!userToken) {
          setAllowedPages([]);
          return;
        }

        const result = await fetchData(
          "user/pages-by-role",
          "GET",
          {},
          {
            "auth-token": userToken,
          }
        );

        if (result?.success) {
          setAllowedPages(result.data || []);
        }
      } catch (error) {
        console.error("Failed to load menu pages", error);
      }
    };

    fetchMenuPages();
  }, [userToken]);

  const navLinks = allowedPages
    .filter((page) => page.MenuType === "NAVBAR")
    .map((page) => {
      const config = navbarRouteMap[page.PageID];

      if (!config) {
        console.warn("No navbar mapping for PageID:", page.PageID);
        return null;
      }

      return {
        label: page.DisplayName,
        to: config.to,
        icon: config.icon,
      };
    })
    .filter(Boolean);

  const mobileMenuLinks = navLinks;

  const getProfileImage = () => {
    const profilePic = profilePicture || user?.ProfilePicture;
    if (profilePic) {
      if (
        profilePic.startsWith("http") ||
        profilePic.startsWith("data:image")
      ) {
        return `${profilePic}${
          profilePic.includes("?") ? "&" : "?"
        }v=${imageVersion}`;
      }

      return `${
        import.meta.env.VITE_API_UPLOADSURL
      }/${profilePic}?v=${imageVersion}&t=${new Date().getTime()}`;
    }
    return images.defaultProfile;
  };

  useEffect(() => {
    if (profilePicture || user?.ProfilePicture) {
      setImageVersion((prev) => prev + 1);
    }
  }, [profilePicture, user?.ProfilePicture]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "profileImageUpdated" || e.key === "userDataUpdated") {
        setImageVersion((prev) => prev + 1);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const hasAccessById = (pageId) =>
    allowedPages.some((p) => p.PageID === pageId);

  useEffect(() => {
    const handleProfileImageUpdate = () => {
      setImageVersion((prev) => prev + 1);
    };

    window.addEventListener("profileImageUpdated", handleProfileImageUpdate);

    return () => {
      window.removeEventListener(
        "profileImageUpdated",
        handleProfileImageUpdate
      );
    };
  }, []);

  const getImageKey = () => {
    const profilePic = profilePicture || user?.ProfilePicture;
    return `profile-${profilePic || "default"}-${imageVersion}`;
  };
  
  const isRegistrationPage = location.pathname === "/registration";
  if (isRegistrationPage) return null;
  
  // Debug log to see if daysRemaining is being set
  console.log("Days remaining value:", daysRemaining);
  
  return (
    <main>
      <nav className="flex justify-between items-center py-2 px-4 md:px-6 lg:px-8 bg-white shadow-lg">
        <div className="flex items-center gap-4">
          <AiOutlineMenu
            onClick={() => setMenu(true)}
            className="text-3xl cursor-pointer md:hidden text-DGXblue hover:text-DGXgreen transition-colors duration-300"
          />
          <img
            src={images.aiAwarenessLogo}
            className="h-12 md:h-16 lg:h-24 xl:h-20"
            alt="gi-venture logo"
          />
        </div>

        <div className="hidden md:flex items-center justify-center flex-1 mx-4">
          <div className="flex flex-wrap justify-center gap-2 lg:gap-4 xl:gap-6">
            {navLinks.map((d, i) => (
              <Link
                key={i}
                className={clsx(
                  "text-DGXblue text-sm lg:text-base font-medium transition-all duration-300 ease-in-out relative",
                  "px-2 py-1 rounded-md hover:bg-DGXblue/20",
                  location.pathname === d.to
                    ? "text-DGXgreen font-bold"
                    : "hover:text-DGXgreen"
                )}
                to={d.to}
              >
                {d.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right section - User Profile */}
        <div className="flex items-center justify-end">
          {!isLoggedIn ? (
            <Link to="/SignInn">
              <button
                type="button"
                className="text-white bg-DGXgreen hover:bg-DGXblue font-medium rounded-md text-sm px-3 py-1.5 md:px-4 md:py-2 transition-all duration-300"
              >
                Login
              </button>
            </Link>
          ) : (
            <div className="relative flex items-center gap-2">
              {/* Days Remaining Badge - Desktop */}
              {daysRemaining !== null && daysRemaining !== undefined && (
                <div className="hidden md:block mr-2">
                  <div className="bg-gradient-to-r from-DGXgreen to-DGXblue text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {daysRemaining} days left
                    </span>
                  </div>
                </div>
              )}

              <span className="hidden xs:inline text-sm sm:text-base font-medium text-DGXblue truncate max-w-[100px] sm:max-w-[150px]">
                {userName || user?.Name || user?.name || "User"}
              </span>
              <div className="relative group">
                <img
                  src={getProfileImage()}
                  alt="User"
                  className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full border-2 cursor-pointer border-DGXgreen hover:border-DGXblue transition-all duration-300 object-cover"
                  onClick={toggleDropdown}
                  onError={(e) => {
                    e.target.src = images.defaultProfile;
                  }}
                  key={getImageKey()}
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-DGXblue overflow-hidden">
                  {/* Days Remaining Badge - Mobile (inside dropdown) */}
                  {daysRemaining !== null && daysRemaining !== undefined && (
                    <div className="md:hidden px-4 pt-3 pb-2 border-b border-gray-200">
                      <div className="bg-gradient-to-r from-DGXgreen to-DGXblue text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md inline-block w-full text-center">
                        <span className="flex items-center justify-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {daysRemaining} days remaining
                        </span>
                      </div>
                    </div>
                  )}
                  <Link
                    to="/UserProfile"
                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-DGXblue/10 hover:text-DGXgreen transition-all duration-200"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      className="mr-2 text-DGXblue"
                    />
                    Profile
                  </Link>
                  {hasAccessById(11) && (
                    <Link
                      to="/AdminDashboard"
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-DGXblue/10 hover:text-DGXgreen transition-all duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FontAwesomeIcon
                        icon={faCog}
                        className="mr-2 text-DGXblue"
                      />
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-DGXblue/10 hover:text-DGXgreen transition-all duration-200"
                  >
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="mr-2 text-DGXblue"
                    />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Side Menu */}
        <div
          className={clsx(
            "fixed inset-0 h-full w-screen lg:hidden bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300",
            isSideMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <section
            className={clsx(
              "absolute left-0 top-0 h-full w-3/4 sm:w-64 bg-DGXblue text-white p-6 transition-transform duration-300 ease-in-out flex flex-col",
              isSideMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex justify-between items-center mb-6">
              <IoMdCloseCircleOutline
                onClick={() => setMenu(false)}
                className="text-2xl cursor-pointer hover:text-DGXgreen transition-colors duration-300"
              />
              {isLoggedIn && (
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm truncate max-w-[100px]">
                      {userName || user?.Name || user?.name || "User"}
                    </span>
                    <img
                      src={getProfileImage()}
                      alt="User"
                      className="h-8 w-8 rounded-full border-2 border-white object-cover"
                      onError={(e) => {
                        e.target.src = images.defaultProfile;
                      }}
                      key={getImageKey()}
                    />
                  </div>
                  {/* Days Remaining Badge - Mobile Side Menu */}
                  {daysRemaining !== null && daysRemaining !== undefined && (
                    <div className="mt-2">
                      <div className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                        <span className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {daysRemaining} days left
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {mobileMenuLinks.map((d, i) => (
                <Link
                  key={i}
                  className={clsx(
                    "flex items-center gap-4 py-3 px-4 rounded-md my-1 transition-all duration-200",
                    location.pathname === d.to
                      ? "bg-DGXblue/80 text-DGXgreen font-bold"
                      : "text-white hover:bg-DGXblue/80 hover:text-DGXgreen"
                  )}
                  to={d.to}
                  onClick={() => setMenu(false)}
                >
                  {typeof d.icon === "function" ? (
                    <d.icon className="text-xl" />
                  ) : (
                    <FontAwesomeIcon icon={d.icon} className="text-xl" />
                  )}
                  <span className="text-sm font-medium">{d.label}</span>
                </Link>
              ))}
            </div>

            {!isLoggedIn ? (
              <Link
                to="/SignInn"
                className="mt-4 bg-DGXgreen text-white px-4 py-3 rounded-md text-center hover:bg-DGXblue transition-all duration-300 flex items-center justify-center gap-2"
                onClick={() => setMenu(false)}
              >
                <FontAwesomeIcon icon={faUser} />
                <span>Login</span>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="mt-4 bg-DGXgreen text-white px-4 py-3 rounded-md text-center hover:bg-DGXblue transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Logout</span>
              </button>
            )}
          </section>
        </div>
      </nav>
      <hr className="border-b-4 border-DGXblue" />
    </main>
  );
};

export default Navbar;