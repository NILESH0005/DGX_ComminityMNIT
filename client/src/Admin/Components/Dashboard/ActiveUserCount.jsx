import { useEffect, useState, useContext } from "react";
import ApiContext from "../../../context/ApiContext";

// 🔥 Blinking Dot Component (inline for simplicity)
function BlinkingDot({ size = 8, color = "green" }) {
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

export default function ActiveUserCount() {
  const { fetchData, userToken } = useContext(ApiContext);

  const [loading, setLoading] = useState(true);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchActiveUsersCount = async () => {
    try {
      setLoading(true);

      const response = await fetchData(
        "badgesapi/today-live-user-count",
        "GET",
        {},
        {
          "Content-Type": "application/json",
          "auth-token": userToken,
        }
      );

      const count = Number(
        response?.data?.data?.[0]?.todaysLogins 
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

    fetchActiveUsersCount();

    // 🔄 Auto refresh every 30 sec
    const interval = setInterval(fetchActiveUsersCount, 30000);
    return () => clearInterval(interval);

  }, [userToken]);

  // 🎯 Dynamic color based on load
  const getColor = () => {
   
    return "green";
  };

  return (
  <div className="flex flex-col items-center md:items-end">
       <p
            className="text-1xl font-bold"
            style={{ color: getColor() }}
          >
            {activeUserCount.toLocaleString()}
          </p>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2 w-full">
        <h3 className="text-lg font-semibold text-gray-800">
      
        </h3>

        <div className="flex items-center gap-2">
          <BlinkingDot color={getColor()} />
          <span className="text-xs text-gray-500">Today's Active</span>
        
        </div>
      </div>
  
      {/* Content */}
    
    </div>
  );
}
