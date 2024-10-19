import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import FinancialChart from "./FinancialChart";

function CustomTabPanel(props) {
  const { children, value, index, sx, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      // aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0, marginTop: "60px", ...sx }}>{children}</Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    // "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", marginTop: "40px", marginLeft: "60px" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            ".MuiTab-root": {
              fontFamily: "Circular Std",
              fontSize: "18px",
              fontWeight: "400",
              lineHeight: "22.77px",
              textAlign: "left",
              color: "#6f7177",
              minWidth: "auto",
              textTransform: "none",
            },
            ".Mui-selected": {
              color: "#4C68D7", // Highlight selected tab
            },
          }}
        >
          <Tab label="Summary" {...a11yProps(0)} />
          <Tab label="Chart" {...a11yProps(1)} />
          <Tab label="Statistics" {...a11yProps(2)} />
          <Tab label="Analysis" {...a11yProps(3)} />
          <Tab label="Settings" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        Summary content
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1} sx={{ marginLeft: "-40px" }}>
        <FinancialChart />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Statistics content
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        Analysis content
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        Settings content
      </CustomTabPanel>
    </Box>
  );
}
