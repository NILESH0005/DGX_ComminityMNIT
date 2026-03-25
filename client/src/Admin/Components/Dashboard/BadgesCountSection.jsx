import { useEffect, useState, useContext } from "react";
import ApiContext from "../../../context/ApiContext";
import Papa from "papaparse";
import { Download } from "lucide-react";
import { FaMedal } from "react-icons/fa6";

export default function BadgesCountSection() {
  const { fetchData, userToken } = useContext(ApiContext);

  const [totalUsers, setTotalUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!badges.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 4;
        return next >= badges.length ? 0 : next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [badges]);

  useEffect(() => {
    if (!badges.length) return;

    const interval = setInterval(() => {
      setStartIndex((prev) => {
        const step = window.innerWidth < 768 ? 2 : 8;
        const nextIndex = prev + step;

        return nextIndex >= badges.length ? 0 : nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [badges]);
  const visibleCount = window.innerWidth < 768 ? 2 : 5;
  const visibleBadges = badges.slice(startIndex, startIndex + visibleCount);

  // Loop fix (when reaching end)
  if (visibleBadges.length < visibleCount) {
    visibleBadges.push(...badges.slice(0, visibleCount - visibleBadges.length));
  }

  useEffect(() => {
    if (!userToken) return;

    const fetchBadgeUserCount = async () => {
      try {
        setLoading(true);

        const response = await fetchData(
          "badgesapi/badge-images",
          "GET",
          {},
          {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
        );

        const response1 = await fetchData(
          "badgesapi/user-count",
          "GET",
          {},
          {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
        );

        const badgeList = response?.data || [];

        const countList = response1?.data?.data || [];
        const countMap = {};
        countList.forEach((item) => {
          countMap[item.badgesId] = item.totalUSER;
        });

        // Merge
        const mergedBadges = badgeList.map((badge) => ({
          ...badge,
          userCount: countMap[badge.id] || 0,
        }));

        setBadges(mergedBadges);
        const totalUsersCount = mergedBadges.reduce(
          (sum, badge) => sum + (badge.userCount || 0),
          0,
        );
        setTotalUsers(totalUsersCount);

        const loopBadges = [...badges, ...badges];
      } catch (err) {
        console.error("Error fetching registration counts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBadgeUserCount();
  }, [userToken]);

  /* -----------------------------
     CSV DOWNLOAD USING PAPAPARSE
  ------------------------------ */

  const Card = ({ title, value, gradient, onClick }) => (
    <div
      onClick={onClick}
      className={`rounded-2xl shadow-lg p-6 text-white cursor-pointer ${gradient}
                  transform transition duration-300 hover:scale-105`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-4xl font-bold mt-2 tracking-wide">
        {loading ? "..." : value}
      </h2>
      <p className="text-xs mt-2 opacity-70">
        <button className="mt-4 flex items-center gap-2">
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </p>
    </div>
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 max-w-7xl mx-auto rounded-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        {/* <div className="flex flex-row gap-1">
          <FaMedal className="text-3xl text-yellow-500" />
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            User Badges Section
          </h1>
        </div> */}
        {/* <div className="flex items-center gap-2">
          <FaMedal className="text-yellow-500 text-2xl md:text-3xl align-middle" />
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 leading-none">
            User Badges Section
          </h1>
        </div> */}
        {/* <div className="flex items-center gap-2">
          <FaMedal className="text-yellow-500 text-[26px] md:text-[30px]" />
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            User Badges Section
          </h1>
        </div> */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <FaMedal className="text-white text-lg" />
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
            User Badges Section
          </h1>
        </div>

        <div className="flex gap-4 mt-2 md:mt-0">
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
            Total Users: {totalUsers}
          </div>
          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
            Total Badges: {badges.length}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-xl shadow">
        {/* 📱 MOBILE VIEW (Vertical Scroll) */}
        <div className="block md:hidden max-h-96 overflow-y-auto space-y-3 pr-2">
          {badges.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 rounded-xl p-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    item.badge
                      ? `data:image/png;base64,${item.badge}`
                      : "/default-badge.png"
                  }
                  alt={item.badge_name}
                  className="w-10 h-10 object-contain"
                />
                <p className="text-sm font-medium">{item.badge_name}</p>
              </div>

              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                {item.userCount}
              </span>
            </div>
          ))}
        </div>

        {/* 💻 DESKTOP VIEW (SMOOTH AUTO SCROLL) */}
        <div className="hidden md:block overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / 4)}%)`,
            }}
          >
            {[...badges, ...badges].map((item, index) => (
              <div
                key={index}
                className="min-w-[263px] flex-shrink-0 bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition"
              >
                <img
                  src={
                    item.badge
                      ? `data:image/png;base64,${item.badge}`
                      : "/default-badge.png"
                  }
                  alt={item.badge_name}
                  className="w-16 h-16 object-contain mx-auto"
                />

                <p className="text-sm font-medium mt-2 break-words">
                  {item.badge_name}
                </p>

                <span className="inline-block mt-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                  {item.userCount} Users
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
