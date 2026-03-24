import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default function PieChart({ title, data, showGenderBreakdown }) {
  const options = {
    chart: {
      type: "pie",
      height: 260,
    },
    title: {
      text: title,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      formatter: function () {
        if (showGenderBreakdown) {
          return `
        <b>${this.point.name}</b><br/>
        Total: ${this.point.y}<br/>
        Male: ${this.point.male}<br/>
        Female: ${this.point.female}
      `;
        }

        return `
      <b>${this.point.name}</b><br/>
      Users: ${this.point.y}
    `;
      },
    },
    legend: {
      enabled: true,
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      itemStyle: {
        fontSize: "12px",
      },
    },

    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        showInLegend: true,
        dataLabels: {
          enabled: true,
          style: {
            fontSize: "10px",
          },
        },
      },
    },

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            chart: {
              height: 300,
            },
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
              itemStyle: {
                fontSize: "10px",
              },
            },
            plotOptions: {
              pie: {
                dataLabels: {
                  enabled: true,
                  connectorWidth: 0,
                  distance: 0,
                  style: {
                    fontSize: "10px",
                  },
                },
              },
            },
          },
        },
      ],
    },

    series: [
      {
        name: "Users",
        data: data,
      },
    ],
  };

  return (
    <div className="bg-white shadow rounded-lg p-3 w-full h-full">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
