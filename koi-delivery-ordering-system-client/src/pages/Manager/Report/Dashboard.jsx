import { Box, styled } from "@mui/material";
import LineChart from "./components/LineChart";
import PieChart from "./components/PieChart";

const DasboardBox = styled(Box)(() => ({
  margin: "30px",
  padding: "40px",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
  gap: "30px",
}));

const LineChartBox = styled(Box)(() => ({}));

const PieChartBox = styled(Box)(() => ({
  borderRadius: "16px",
  border: "1px solid #ccc",
  display: "flex",
  justifyContent: "center",
  padding: "0 20px",
}));

function Dashboard() {
  return (
    <DasboardBox>
      <LineChartBox>
        <LineChart />
      </LineChartBox>
      <PieChartBox>
        <PieChart />
      </PieChartBox>
    </DasboardBox>
  );
}

export default Dashboard;
