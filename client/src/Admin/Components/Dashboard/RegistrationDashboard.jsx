import { useEffect, useState, useContext } from "react";
import ApiContext from "../../../context/ApiContext";
import Papa from "papaparse";
import { Download } from "lucide-react";
import Table from "./Table";
import PieChart from "./PieChart";
import NotVerifiedUsersCount from "./NotVerifiedUsersCount";
import BlockedUsersCount from "./BlockedUsers";
import { FaUser } from "react-icons/fa6";
//import { set } from "jodit/types/core/helpers";

export default function RegistrationDashboard() {
  const { fetchData, userToken } = useContext(ApiContext);

  const [counts, setCounts] = useState({ online: 0, offline: 0, total: 0 });
  const [offlineUsers, setOfflineUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState([]);
  const [totalNotVerifiedUsers, setNotVerifiedCount] = useState([]);
  const [totalBlockedUsers, setTotalBlockedUsers] = useState([]);

  const [districtCounts, setDistrictCounts] = useState([]);
  const [genderCounts, setGenderCounts] = useState([]);
  const [genderSummary, setGenderSummary] = useState({
    male: 0,
    female: 0,
  });
  const [qualificationData, setQualificationData] = useState([]);
  const [passFailData, setPassFailData] = useState([]);

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
          const {
            counts,
            offlineUsers,
            onlineUsers,
            totalUsers,
            totalNotVerifiedUsers,
            totalBlockedUsers,
          } = response.data;

          setCounts({
            offline: Number(counts?.offlineCount || 0),
            online: Number(counts?.onlineCount || 0),
            total: Number(counts?.totalCount || 0),
          });

          setOfflineUsers(offlineUsers || []);
          setOnlineUsers(onlineUsers || []);
          setTotalUsers(totalUsers || []); // Calculate total users from both lists
          setNotVerifiedCount(totalNotVerifiedUsers || []);
          setTotalBlockedUsers(totalBlockedUsers || []);
        }
      } catch (err) {
        console.error("Error fetching registration counts:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchDistrictCounts = async () => {
      try {
        const response = await fetchData(
          "badgesapi/district-user-count",
          "GET",
          {},
          {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
        );

        if (response.success && response.data?.data) {
          setDistrictCounts(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching district counts:", err);
      }
    };

    const fetchGenderCounts = async () => {
      try {
        const response = await fetchData(
          "badgesapi/district-gender-user-count",
          "GET",
          {},
          {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
        );

        if (response.success && response.data?.data) {
          setGenderCounts(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching gender counts:", err);
      }
    };

    const fetchGenderSummary = async () => {
      try {
        const response = await fetchData(
          "badgesapi/gender-user-count",
          "GET",
          {},
          {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
        );

        if (response.success && response.data?.data?.length) {
          const data = response.data.data[0];

          setGenderSummary({
            male: Number(data.MaleCount),
            female: Number(data.FemaleCount),
          });
        }
      } catch (err) {
        console.error("Error fetching gender summary:", err);
      }
    };

    const fetchQualificationWise = async () => {
      try {
        const response = await fetchData(
          "badgesapi/qualification-user-count",
          "GET",
          {},
          {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
        );

        if (response.success && response.data?.data?.length) {
          const formatted = response.data.data.map((item) => ({
            name: item.QualificationName,
            y: Number(item.totalUser),
            male: Number(item.MaleCount),
            female: Number(item.FemaleCount),
          }));

          setQualificationData(formatted);
        }
      } catch (err) {
        console.error("Error fetching qualification data:", err);
      }
    };

    const fetchPassFailCount = async () => {
      try {
        const response = await fetchData(
          "badgesapi/total-pass-fail-count",
          "GET",
          {},
          {
            "Content-Type": "application/json",
            "auth-token": userToken,
          },
        );

        if (response.success && response.data?.data?.length) {
          const data = response.data.data[0];

          const formatted = [
            {
              name: "Pass",
              y: Number(data.totalPass),
              color: "#22c55e", // green
            },
            {
              name: "Fail",
              y: Number(data.totalFail),
              color: "#ef4444", // red
            },
          ];

          setPassFailData(formatted);
        }
      } catch (err) {
        console.error("Error fetching pass/fail data:", err);
      }
    };

    fetchRegistrationCounts();
    fetchDistrictCounts();
    fetchGenderCounts();
    fetchGenderSummary();
    fetchQualificationWise();
    fetchPassFailCount();
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
      <p className="text-xs mt-2 opacity-70">
        <button className="mt-4 flex items-center gap-2">
          <Download size={18} />
          <span>Download CSV</span>
        </button>
      </p>
    </div>
  );

  const genderChartData = [
    { name: "Male", y: genderSummary.male, color: "#4C8CE4" },
    { name: "Female", y: genderSummary.female, color: "#FE81D4" },
  ];

  return (
    // <div className="p-6 md:p-10 bg-gray-50 rounded-xl">
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 max-w-7xl mx-auto rounded-lg">
      {/* <div className="flex flex-row gap-1">
        <FaUser className="text-3xl text-blue-500" />
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8">
          User Registration Dashboard
        </h1>
      </div> */}
      {/* <div className="flex items-center gap-2 mb-6">
        <FaUser className="text-blue-500 text-2xl md:text-3xl" />
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 leading-none">
          User Registration Dashboard
        </h1>
      </div> */}
      {/* <div className="flex items-center gap-2 mb-6">
        <FaUser className="text-blue-500 text-[26px] md:text-[30px]" />
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          User Registration Dashboard
        </h1>
      </div> */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <FaUser className="text-white text-lg" />
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          User Registration Dashboard
        </h1>
      </div>

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
          onClick={() => downloadCSV(totalUsers, "all_users.csv")}
        />

        <Card
          title="Not Verified Users"
          value={<NotVerifiedUsersCount />}
          gradient="bg-gradient-to-r from-emerald-500 to-teal-600"
          onClick={() =>
            downloadCSV(totalNotVerifiedUsers, "not_verified_users.csv")
          }
        />

        <Card
          title="Blocked Users"
          value={<BlockedUsersCount />}
          gradient="bg-gradient-to-r from-blue-500 to-indigo-600"
          onClick={() => downloadCSV(totalBlockedUsers, "blocked_users.csv")}
        />
      </div>

      <div className="mt-10 flex flex-col gap-6">
        {/* PIE CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PieChart title="Gender-Wise Distribution" data={genderChartData} />

          <PieChart
            title="Qualification-Wise Distribution"
            data={qualificationData}
            showGenderBreakdown={true}
          />

          <PieChart title="Pass vs Fail Distribution" data={passFailData} />
          {/* {passFailData.some((item) => item.y > 0) && (
            <PieChart title="Pass vs Fail Distribution" data={passFailData} />
          )} */}
        </div>

        {/* TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Table
            title="District-wise Users"
            maxHeight="max-h-[400px]"
            loading={loading}
            data={districtCounts}
            columns={[
              { header: "District", accessor: "DistrictName" },
              { header: "Total Users", accessor: "totalUser" },
            ]}
          />

          <Table
            title="Gender-wise Users"
            maxHeight="max-h-[400px]"
            loading={loading}
            data={genderCounts}
            columns={[
              { header: "District", accessor: "DistrictName" },
              {
                header: "Male",
                render: (row) => Number(row.MaleCount),
              },
              {
                header: "Female",
                render: (row) => Number(row.FemaleCount),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
