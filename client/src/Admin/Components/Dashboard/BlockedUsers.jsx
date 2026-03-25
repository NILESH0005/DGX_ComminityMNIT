import { useEffect, useState, useContext } from "react";
import ApiContext from "../../../context/ApiContext";


export default function BlockedUsersCount() {
  const { fetchData, userToken } = useContext(ApiContext);

  const [loading, setLoading] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);




  const fetchBlockedUsers = async () => {
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
      // Extract totalNotVerifiedUser from response.data.data[0].totalNotVerifiedUser
      const count = Number(
        response?.data?.data?.[0]?.totalBlockedUser 
      );
      const safeCount = isNaN(count) ? 0 : count;

      setPrevCount(blockedUsers);
      setBlockedUsers(safeCount);
      setLastUpdated(new Date());

    } catch (err) {
      console.error("Error fetching registration counts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userToken) return;

    fetchBlockedUsers();


  }, [userToken]);

 

  return (
  <div className=" flex-col items-end">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        
      
      </div>
       <div className="text-4xl font-bold mt-2 tracking-wide">
        
          <span className="text-xs text-gray-500"></span>
           <p
            className="text-1xl font-bold"
            
          >
            {blockedUsers.toLocaleString()}
          </p>
        </div>
      </div>
   
     
  );
  
}
