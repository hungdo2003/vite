import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getAllOrders } from "../../../../utils/axios/order"; // Make sure this path is correct

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [completedCount, setCompletedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllOrders(); // Fetch all orders

        // Calculate completed and failed counts
        const completed = response.filter(
          (order) => order.orderStatus === 7
        ).length; // Count completed orders
        const failed = response.filter(
          (order) => order.orderStatus === 8
        ).length; // Count failed orders

        setCompletedCount(completed); // Update completed count
        setFailedCount(failed); // Update failed count
        console.log();
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    }

    fetchData();
  }, []); // Run this effect once when the component mounts

  // Calculate total count and percentages
  const totalCount = completedCount + failedCount;

  const data = {
    labels: ["Completed Orders", "Failed Orders"],
    datasets: [
      {
        data: [completedCount, failedCount], // Use actual counts instead of percentages
        backgroundColor: ["#0088FE", "#FFBB28"],
        hoverBackgroundColor: ["#0056b3", "#e1a500"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw || 0;
            return `${label}: ${value} (${((value / totalCount) * 100).toFixed(
              2
            )}%)`; // Show count and percentage
          },
        },
      },
    },
  };

  return (
    <Doughnut
      style={{ maxWidth: "180px", maxHeight: "300px" }}
      data={data}
      options={options}
    />
  );
};

export default PieChart;
