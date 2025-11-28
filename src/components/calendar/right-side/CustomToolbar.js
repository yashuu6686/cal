"use client";
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import {
  toolbarContainerStyle,
  navButtonStyle,
  viewButtonStyle,
  actionButtonStyle,
} from "@/components/calendar/styles/calendarStyles";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { selectIsFieldsDisabled } from "@/redux/store/slices/calendarSlice";
import { useSelector } from "react-redux";

import { FormControl, Select, MenuItem } from "@mui/material";

const viewOptions = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];


  
export default function CustomToolbar({
  onNavigate,
  onView,
  label,
  view,
  onShowBreak,
  handleShowHolidayDialog,
}) {

  const isFieldsDisabled = useSelector(selectIsFieldsDisabled);


  return (
    <Box sx={toolbarContainerStyle}>
      {/* Top Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        {/* Left Nav Buttons */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button   disabled={isFieldsDisabled} sx={navButtonStyle} onClick={() => onNavigate("TODAY")}>
            Today
          </Button>
          <Button   disabled={isFieldsDisabled} sx={navButtonStyle} onClick={() => onNavigate("PREV")}>
            <ChevronLeftIcon/>
          </Button>
          <Button    disabled={isFieldsDisabled} sx={navButtonStyle} onClick={() => onNavigate("NEXT")}>
            <ChevronRightIcon sx={{width:"40px"}}/>
          </Button>
        </Box>

        {/* Center Label */}
        <Typography
          sx={{
            color: "#1565c0",
            fontWeight: 700,
            fontSize: "1.3rem",
            letterSpacing: "0.5px",
          }}
        >
          {label}
        </Typography>

        {/* Right View Buttons */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 1,
              // pt: 1,
              // borderTop: "1px solid #90caf9",
            }}
          >
            <Button
            
              disabled={isFieldsDisabled}
              variant="contained"
              sx={actionButtonStyle}
              onClick={onShowBreak}
            >
              Break
            </Button>

            <Button
              disabled={isFieldsDisabled}
              variant="contained"
              sx={actionButtonStyle}
              onClick={handleShowHolidayDialog}
            >
              Holiday
            </Button>
          </Box>
        
<FormControl size="small">
  <Select
    disabled={isFieldsDisabled}
    value={view}
    onChange={(e) => onView(e.target.value)}
    displayEmpty
    sx={{
      boxShadow: "none",
      bgcolor: "#1172BA",
      color: "white",
      borderRadius: "12px",
      px: 2,
      py: 0.5,
      height: "45px",
      fontWeight: 400,
      textAlign: "center",
      "& .MuiSelect-icon": { color: "white" },
      "& fieldset": { border: "none" },
    }}
    renderValue={(selected) => {
      const item = viewOptions.find((i) => i.value === selected);
      return item?.label || "Select View";
    }}
  >
    {viewOptions.map((opt) => (
      <MenuItem key={opt.value} value={opt.value}>
        {opt.label}
      </MenuItem>
    ))}
  </Select>
</FormControl>

        </Box>
      </Box>

      {/* Bottom Row */}
    </Box>
  );
}
