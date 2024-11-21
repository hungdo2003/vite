import { Card, CardContent, Typography, Box } from "@mui/material";

const ReportCard = ({ title, value, icon, color, textColor, trend }) => {
  return (
    <Card style={{ backgroundColor: color, color: textColor }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Box>{icon}</Box>
        </Box>
        <Typography variant="h3" component="div" mb={2}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
