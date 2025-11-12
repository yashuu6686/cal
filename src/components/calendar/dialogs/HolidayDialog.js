"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Divider,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch, useSelector } from "react-redux";

import { setOpenHolidayDialog } from "@/redux/store/slices/calendarSlice";
import HolidayTable from "@/components/calendar/right-side/TableHoliday";

export default function HolidayDialog() {
  const dispatch = useDispatch();
  const openHolidayDialog = useSelector((state) => state.calendar.openHolidayDialog);
  const holidays = useSelector((state) => state.calendar.holidays);

  const handleCloseDialog = () => {
    dispatch(setOpenHolidayDialog(false));
  };

  return (
    <Dialog
      open={openHolidayDialog}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          overflow: "hidden",
          background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          color: "#2c3e50",
          fontWeight: 700,
          fontSize: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#2c3e50" }}>
          Holiday Details
        </Typography>
      </DialogTitle>

      <Divider sx={{ borderColor: "#e0e0e0" }} />

      <DialogContent sx={{ px: 2, py: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {holidays.length > 0 ? (
            <HolidayTable />
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
                px: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
                border: "2px dashed #bdbdbd",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#757575",
                  fontStyle: "italic",
                  mb: 1,
                  fontSize: "1.1rem",
                }}
              >
                🏖️ No holidays scheduled
              </Typography>
              <Typography variant="body2" sx={{ color: "#9e9e9e" }}>
                Select date and times to add holiday schedules
              </Typography>
            </Box>
          )}
        </LocalizationProvider>
      </DialogContent>

      <Divider sx={{ borderColor: "#e0e0e0" }} />

      <DialogActions
        sx={{
          p: 1,
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        }}
      >
        <Button
          onClick={handleCloseDialog}
          variant="contained"
          sx={{
            color: "#fff",
            fontWeight: 600,
            textTransform: "none",
            px: 3,
            borderRadius: 3,
            fontSize: "1rem",
            transition: "all 0.3s ease",
          }}
        >
          ✓ Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}