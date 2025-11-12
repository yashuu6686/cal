
"use client";
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

export default function CustomToolbar({
  onNavigate,
  onView,
  label,
  view,
  isFieldsDisabled,
  onShowBreak,
  handleShowBreakDialog,handleShowHolidayDialog
}) {
  // const [holidayOpen, setHolidayOpen] = useState(false);

  return (
    <Box
      sx={{
        backgroundColor: "#e3f2fd",
        padding: "16px 20px",
        borderRadius: "12px",
        marginBottom: "24px",
        border: "2px solid #90caf9",
        boxShadow: "0 4px 12px rgba(25, 118, 210, 0.1)",
      }}
    >
      {/* Top Row: Navigation + View Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* Left: Today, Back, Next */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={() => onNavigate("TODAY")}
            sx={{
              color: "#1976d2",
              // fontWeight: 600,
              fontSize: "0.9rem",
              padding: "8px 20px",
              borderRadius: "10px",
              border: "2px solid transparent",
              transition: "all 0.3s ease",
              backgroundColor: "white",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1976d2",
                color: "white",
                border: "2px solid #1565c0",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              },
            }}
          >
            Today
          </Button>
          <Button
            onClick={() => onNavigate("PREV")}
            sx={{
              color: "#1976d2",
              // fontWeight: 600,
              fontSize: "0.9rem",
              padding: "8px 20px",
              borderRadius: "10px",
              border: "2px solid transparent",
              transition: "all 0.3s ease",
              backgroundColor: "white",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1976d2",
                color: "white",
                border: "2px solid #1565c0",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              },
            }}
          >
            Back
          </Button>
          <Button
            onClick={() => onNavigate("NEXT")}
            sx={{
              color: "#1976d2",
              // fontWeight: 600,
              fontSize: "0.9rem",
              padding: "8px 20px",
              borderRadius: "10px",
              border: "2px solid transparent",
              transition: "all 0.3s ease",
              backgroundColor: "white",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1976d2",
                color: "white",
                border: "2px solid #1565c0",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              },
            }}
          >
            Next
          </Button>
        </Box>

        {/* Center: Label */}
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

        {/* Right: View Buttons */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {["day", "week", "month"].map((viewType) => (
            <Button
              key={viewType}
              onClick={() => onView(viewType)}
              sx={{
                color: "#1976d2",
                // fontWeight: 600,
                fontSize: "0.9rem",
                padding: "8px 16px",
                borderRadius: "10px",
                border: "2px solid transparent",
                transition: "all 0.3s ease",
                backgroundColor: view === viewType ? "#1172BA" : "white",
                color: view === viewType ? "white" : "#1976d2",
                textTransform: "capitalize",
                "&:hover": {
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "2px solid #1565c0",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                },
              }}
            >
              {viewType}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Bottom Row: Break & Holiday Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          pt: 2,
          borderTop: "1px solid #90caf9",
        }}
      >
        <Button
          disabled={isFieldsDisabled}
          variant="contained"
          onClick={onShowBreak}
          sx={{
            color: "white",
            // fontWeight: 600,
            fontSize: "0.9rem",
            padding: "8px 24px",
            borderRadius: "10px",
            textTransform: "none",
            "&:hover": {
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Break
        </Button>
        <Button
          disabled={isFieldsDisabled}
          variant="contained"
          onClick={handleShowHolidayDialog}
          sx={{
            color: "white",
            // fontWeight: 600,
            fontSize: "0.9rem",
            padding: "8px 24px",

            borderRadius: "10px",
            textTransform: "none",
            "&:hover": {
              transform: "translateY(-2px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Holiday
        </Button>
      </Box>
    </Box>
  );
}