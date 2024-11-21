import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getAllOrders } from "../../../../utils/axios/order";

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [chartData, setChartData] = useState({
    days: [], // Days of the selected month
    completed: [], // Completed orders per day
    failed: [], // Failed orders per day
  });

  // Array of months for the dropdown
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);

  useEffect(() => {
    async function fetchData() {
      try {
        const orders = await getAllOrders();

        const totalDaysInMonth = new Date(
          selectedYear,
          selectedMonth + 1,
          0
        ).getDate();

        const days = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
        const completed = Array(totalDaysInMonth).fill(0);
        const failed = Array(totalDaysInMonth).fill(0);

        orders.forEach((order) => {
          const orderDate = new Date(order.expectedFinishDate);
          const orderMonth = orderDate.getMonth();
          const orderYear = orderDate.getFullYear();

          // Only count orders from the selected year and month
          if (orderMonth === selectedMonth && orderYear === selectedYear) {
            const orderDay = orderDate.getDate() - 1; // Get the day (0-based index)
            if (order.orderStatus === 7) {
              completed[orderDay] += 1; // Increment completed count for the respective day
            } else if (order.orderStatus === 8) {
              failed[orderDay] += 1; // Increment failed count for the respective day
            }
          }
        });
        setChartData({
          days,
          completed,
          failed,
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }

    fetchData();
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const data = {
    labels: chartData.days,
    datasets: [
      {
        label: "Completed Orders",
        data: chartData.completed,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Failed Orders",
        data: chartData.failed,
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Daily Completed and Failed Orders for ${months[selectedMonth]} ${selectedYear}`,
      },
    },
  };

  return (
    <div>
      {/* Dropdown to select year and month */}
      <div style={{ marginBottom: "20px", display: "flex" }}>
        <label htmlFor="year-select">Select Year: </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <label htmlFor="month-select" style={{ marginLeft: "10px" }}>
          Select Month:{" "}
        </label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Line Chart */}
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
