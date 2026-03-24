import { useEffect, useState, useContext } from "react";
import ApiContext from "../../../context/ApiContext";



export default function BlockedUserCount() {
  const { fetchData, userToken } = useContext(ApiContext);

  const [loading, setLoading] = useState(true);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchActiveUsersCount = async () => {
    try {
      setLoading(true);

      const response = await fetchData(
        "badgesapi/blocked-users",
        "GET",
        {},
        {
          "Content-Type": "application/json",
          "auth-token": userToken,
        }
      );
      console.log(response)

      const count = Number(
        response?.data?.data?.[0]?.todaysLoing ??
        response?.data?.totalActiveUsers ??
        response?.data?.activeUserCount ??
        response?.totalActiveUsers ??
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

    fetchActiveUsersCount();

    // 🔄 Auto refresh every 30 sec
    const interval = setInterval(fetchActiveUsersCount, 30000);
    return () => clearInterval(interval);

  }, [userToken]);

  // 🎯 Dynamic color based on load
  const getColor = () => {
    if (activeUserCount > 1000) return "red";
    if (activeUserCount > 500) return "orange";
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
