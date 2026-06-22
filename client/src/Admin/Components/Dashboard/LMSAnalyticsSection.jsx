import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import ApiContext from "../../../context/ApiContext";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const LMSAnalyticsSection = ({ selectedEvent }) => {
  const { fetchData, userToken } = useContext(ApiContext);

  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDownload = async (data) => {
    try {
      const endpoint = `badgesapi/submodule-user-details?eventId=${selectedEvent.EventID}&subModuleId=${data.subModuleId}`;

      const result = await fetchData(
        endpoint,
        "GET",
        {},
        {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
      );

      if (result.success) {
        downloadCSV(result.data || [], data.name);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const downloadCSV = (data, lectureName) => {
    if (!data?.length) return;

    const headers = [
      "UserID",
      "Name",
      "Mobile Number",
      "Email",
      "Total Views",
      "Last Activity",
    ];

    const rows = data.map((item) => [
      item.UserID,
      item.Name,
      item.MobileNumber,
      item.EmailID,
      item.TotalViews,
      item.LastActivity,
    ]);

    const csvContent = [
      headers.join(","),

      ...rows.map((row) => row.map((field) => `"${field ?? ""}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${lectureName.replace(/\s+/g, "_")}_students.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedEvent]);

  const chartOptions = {
    chart: {
      type: "bar",
      backgroundColor: "transparent",
      height: 500,
    },

    title: {
      text: "",
    },

    credits: {
      enabled: false,
    },

    exporting: {
      enabled: true,
    },

    xAxis: {
      categories: analyticsData.map((item) => item.SubModuleName),

      labels: {
        style: {
          color: "#013D54",
          fontSize: "12px",
          fontWeight: "500",
        },
      },
    },

    yAxis: {
      title: {
        text: "Students",
      },

      labels: {
        style: {
          color: "#013D54",
        },
      },
    },

    tooltip: {
      useHTML: true,

      pointFormat: `
      <div style="padding:8px">
        <b>{point.custom.name}</b><br/>
        Students: <b>{point.y}</b><br/>
        Participation: <b>{point.custom.percentage}%</b><br/>
        Total Views: <b>{point.custom.views}</b>
      </div>
    `,
    },

    plotOptions: {
      series: {
        borderRadius: 8,
        cursor: "pointer",

        dataLabels: {
          enabled: true,
          format: "{point.y}",
        },

        point: {
          events: {
            click: function () {
              handleDownload(this.options.custom);
            },
          },
        },
      },
    },

    legend: {
      enabled: false,
    },

    series: [
      {
        name: "Students",

        colorByPoint: true,

        data: analyticsData.map((item) => ({
          y: Number(item.UsersInSubModule),

          custom: {
            subModuleId: item.SubModuleID,
            percentage: item.ParticipationPercentage,
            views: item.TotalViews,
            name: item.SubModuleName,
          },
        })),
      },
    ],
  };

  const fetchAnalytics = async () => {
    if (!selectedEvent?.EventID) return;

    setLoading(true);

    try {
      const endpoint = `badgesapi/event-submodule-analytics?eventId=${selectedEvent.EventID}`;

      const result = await fetchData(
        endpoint,
        "GET",
        {},
        {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
      );

      if (result.success) {
        setAnalyticsData(result.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedEvent]);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-3xl border border-[#013D54]/10 shadow-xl overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-[#013D54] to-[#01516e]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#76B900] font-bold">
              LMS ANALYTICS
            </p>

            <h2 className="text-2xl font-bold text-white mt-1">
              Lecture Engagement Analytics
            </h2>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-6">
        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            Loading...
          </div>
        ) : (
          <div>
            {/* GRAPH WILL COME HERE */}

            <div className="rounded-2xl border border-gray-100 bg-[#f8fafc] p-4">
              <div className="h-[550px]">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={chartOptions}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LMSAnalyticsSection;
