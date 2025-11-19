"use client";
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import {
  toolbarContainerStyle,
  navButtonStyle,
  viewButtonStyle,
  actionButtonStyle,
} from "@/components/calendar/styles/calendarStyles";

export default function CustomToolbar({
  onNavigate,
  onView,
  label,
  view,
  isFieldsDisabled,
  onShowBreak,
  handleShowHolidayDialog,
}) {
  return (
    <Box sx={toolbarContainerStyle}>
      {/* Top Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        {/* Left Nav Buttons */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button sx={navButtonStyle} onClick={() => onNavigate("TODAY")}>Today</Button>
          <Button sx={navButtonStyle} onClick={() => onNavigate("PREV")}>Back</Button>
          <Button sx={navButtonStyle} onClick={() => onNavigate("NEXT")}>Next</Button>
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
          {["day", "week", "month"].map((viewType) => (
            <Button
              key={viewType}
              sx={viewButtonStyle(view === viewType)}
              onClick={() => onView(viewType)}
            >
              {viewType}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Bottom Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          pt: 1,
          borderTop: "1px solid #90caf9",
        }}
      >
        <Button disabled={isFieldsDisabled} variant="contained" sx={actionButtonStyle} onClick={onShowBreak}>
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
    </Box>
  );
}
