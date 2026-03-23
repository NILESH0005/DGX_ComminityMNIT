import { useEffect, useState, useContext } from "react";
import ApiContext from "../../../context/ApiContext";



export default function NotVerifiedUsersCount() {
  const { fetchData, userToken } = useContext(ApiContext);

  const [loading, setLoading] = useState(true);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);


  function BlinkingDot({ size = 8, color = "orange" }) {
  return (
    <div className="relative flex items-center justify-center w-[20px] h-[20px]">
      {/* Ripple */}
      <span
        className="absolute rounded-full border animate-ping"
        style={{
          width: 16,
          height: 16,
          borderColor: color,
        }}
      ></span>

      {/* Dot */}
      <span
        className="rounded-full animate-pulse"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      ></span>
    </div>
  );
}

  const fetchBadgeUserCount = async () => {
    try {
      setLoading(true);

      const response = await fetchData(
        "badgesapi/not-verified-users",
        "GET",
        {},
        {
          "Content-Type": "application/json",
          "auth-token": userToken,
        }
      );
      console.log(response);

      // Extract totalNotVerifiedUser from response.data.data[0].totalNotVerifiedUser
      const count = Number(
        response?.data?.data?.[0]?.totalNotVerifiedUser ??
        response?.data?.totalNotVerifiedUser ??
        response?.totalNotVerifiedUser ??
        0
      );
      const safeCount = isNaN(count) ? 0 : count;

      setPrevCount(activeUserCount);
      setActiveUserCount(safeCount);
      setLastUpdated(new Date());

    } catch (err) {
      console.error("Error fetching registration counts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userToken) return;

    fetchBadgeUserCount();

    // 🔄 Auto refresh every 30 sec
    const interval = setInterval(fetchBadgeUserCount, 30000);
    return () => clearInterval(interval);

  }, [userToken]);

  // 🎯 Dynamic color based on load
  const getColor = () => {
    if (activeUserCount > 1000) return "red";
    if (activeUserCount > 500) return "orange";
    return "orange";
  };

  return (
  <div className="flex flex-col items-end">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
      
        </h3>

      
      </div>
       <div className="flex items-center gap-2">
          <BlinkingDot color={getColor()} />
          <span className="text-xs text-gray-500">Not Verified</span>
           <p
            className="text-1xl font-bold"
            style={{ color: getColor() }}
          >
            {activeUserCount.toLocaleString()}
          </p>
        </div>
      </div>
   
     
  );
  
}
