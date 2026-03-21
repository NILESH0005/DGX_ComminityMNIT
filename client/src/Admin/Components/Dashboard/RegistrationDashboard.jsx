import { useEffect, useState, useContext } from "react";
import ApiContext from "../../../context/ApiContext";
import Papa from "papaparse";

export default function RegistrationDashboard() {
  const { fetchData, userToken } = useContext(ApiContext);

  const [counts, setCounts] = useState({ online: 0, offline: 0, total: 0 });
  const [offlineUsers, setOfflineUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userToken) return;

    const fetchRegistrationCounts = async () => {
      try {
        setLoading(true);

        const response = await fetchData(
          "dashboard/registrationCounts",
          "GET",
          {},
          {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
        );

        if (response.success && response.data) {
          const { counts, offlineUsers, onlineUsers, totalUsers } = response.data;

          setCounts({
            offline: Number(counts?.offlineCount || 0),
            online: Number(counts?.onlineCount || 0),
            total: Number(counts?.totalCount || 0),
          });

          setOfflineUsers(offlineUsers || []);
          setOnlineUsers(onlineUsers || []);
          setTotalUsers(totalUsers || []); // Calculate total users from both lists
        }
      } catch (err) {
        console.error("Error fetching registration counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationCounts();
  }, [userToken]);

  /* -----------------------------
     CSV DOWNLOAD USING PAPAPARSE
  ------------------------------ */
  const downloadCSV = (users, filename) => {
    if (!users?.length) return;

    const formatted = users.map((u) => ({
      SNo: u.SNo,
      Name: u.Name,
      Gender: u.Gender,
      Email: u.EmailId,
      Mobile: u.MobileNumber,
      College: u.CollegeName,
      RegistrationNumber: u.RegNumber,
      RegistrationDate: u.RegistrationDate,
      District: u.DistrictName,
      State: u.State,
      RegistrationType: u.RegistrationType,
    }));

    const csv = Papa.unparse(formatted);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

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
      <p className="text-xs mt-2 opacity-70">Click to download CSV</p>
    </div>
  );

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8">
        User Registration Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Online Registrations"
          value={counts.online}
          gradient="bg-gradient-to-r from-emerald-500 to-teal-600"
          onClick={() => downloadCSV(onlineUsers, "online_users.csv")}
        />

        <Card
          title="Offline Registrations"
          value={counts.offline}
          gradient="bg-gradient-to-r from-blue-500 to-indigo-600"
          onClick={() => downloadCSV(offlineUsers, "offline_users.csv")}
        />

        <Card
          title="Total Users"
          value={counts.total}
          gradient="bg-gradient-to-r from-purple-500 to-pink-600"
          onClick={() =>
            downloadCSV(totalUsers, "all_users.csv")
          }
        />
      </div>
    </div>
  );
}
