"use client";
import React, { useEffect } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import dayjs from "dayjs";

// import {
//   setEditingSlot,
//   setForm,
//   setSelectedDays,
//   setStartTime,
//   setEndTime,
// } from "@/redux/store/slices/calendarSlice";
import { formatEventTime } from "../utils/eventHelpers";

export default function EventDetailsDialog({
  open,
  selectedEvent,
  onClose,
  router,
}) {
  // const dispatch = useDispatch();
  // const weekSchedule = useSelector((state) => state.calendar.weekSchedule);

  // ===== EVENT HANDLERS =====
  // const handleEdit = () => {
  //   if (!selectedEvent) return;

  //   // const eventDay = moment(selectedEvent.start).format("dddd");
  //   // const daySchedule = weekSchedule.find((d) => d.day === eventDay);

  //   if (daySchedule) {
  //     const slot = daySchedule.slots.find((s) => s.id === selectedEvent.id);

  //     if (slot) {
  //       // dispatch(
  //       //   setForm({
  //       //     serviceType: slot.serviceType,
  //       //     speciality: slot.speciality,
  //       //     startTime: dayjs(slot.start.toDate()),
  //       //     endTime: dayjs(slot.end.toDate()),
  //       //   })
  //       // );

  //       // dispatch(setSelectedDays([eventDay]));
  //       // dispatch(setStartTime(slot.start));
  //       // dispatch(setEndTime(slot.end));
  //       // dispatch(
  //       //   setEditingSlot({
  //       //     id: slot.id,
  //       //     days: [eventDay],
  //       //     originalSlot: slot,
  //       //   })
  //       // );

  //       onClose();
  //     }
  //   }
  // };

  // ===== COMPUTED VALUES =====
  const getEventDetails = () => {
    if (!selectedEvent) return { serviceType: "", specialities: [] };

    const serviceType = selectedEvent.serviceType || "";

    // Extract specialities array
    let specialities = [];
    if (selectedEvent.specialities) {
      if (Array.isArray(selectedEvent.specialities)) {
        specialities = selectedEvent.specialities;
      } else if (typeof selectedEvent.specialities === "string") {
        specialities = selectedEvent.specialities
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    
    return { serviceType, specialities };
  };
  
  const { serviceType, specialities } = getEventDetails();
  
  useEffect(() => {
    // console.log("Selected Event Specialities: ", selectedEvent?.specialities);
  });
  // ===== RENDER =====
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(25, 118, 210, 0.15)",
        },
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          color: "white",
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <DialogTitle sx={{ p: 0, fontSize: "1.5rem", fontWeight: 600 }}>
          Event Details
        </DialogTitle>
      </Box>

      <DialogContent sx={{ p: 3, mt: 2 }}>
        {selectedEvent ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Service Type */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                border: "1px solid #90caf9",
                borderRadius: 2.5,
                p: 1.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#1565c0",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  mb: 0.5,
                  display: "block",
                }}
              >
                Service Type
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#1976d2",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                {serviceType || "N/A"}
              </Typography>
            </Box>

            {/* Specialities - Show as Chips */}
            {/* <Box
              sx={{
                backgroundColor: "white",
                border: "2px solid #1976d2",
                borderRadius: 2.5,
                p: 1.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#1565c0",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  mb: 1,
                  display: "block",
                }}
              >
                Specialities
              </Typography>
              {specialities.length > 0 ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {specialities.map((spec, index) => (
                    <Chip
                      key={index}
                      label={spec}
                      sx={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        border: "1px solid #90caf9",
                        "&:hover": {
                          backgroundColor: "#bbdefb",
                        },
                      }}
                    />
                  ))}
                </Stack>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#90a4ae",
                    fontStyle: "italic",
                  }}
                >
                  No specialities added
                </Typography>
              )}
            </Box> */}

            {/* Start Time */}
            <Box
              sx={{
               
                 backgroundColor: "white",
                border: "2px solid #1976d2",
                borderRadius: 2.5,
                p: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#1976d2",
                  borderRadius: 2,
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  component="span"
                  sx={{ color: "white", fontSize: "1.5rem" }}
                >
                  📅
                </Box>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#1565c0",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    display: "block",
                  }}
                >
                  Start Time
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#1976d2",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    mt: 0.5,
                  }}
                >
                  {formatEventTime(selectedEvent.start)}
                </Typography>
              </Box>
            </Box>

            {/* End Time */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                border: "1px solid #90caf9",
                borderRadius: 2.5,
                p: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#1976d2",
                  borderRadius: 2,
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  component="span"
                  sx={{ color: "white", fontSize: "1.5rem" }}
                >
                  ⏰
                </Box>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#1565c0",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    display: "block",
                  }}
                >
                  End Time
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#1976d2",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    mt: 0.5,
                  }}
                >
                  {formatEventTime(selectedEvent.end)}
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Box
              sx={{
                backgroundColor: "#e3f2fd",
                borderRadius: "50%",
                width: 64,
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Box component="span" sx={{ fontSize: "2rem" }}>
                📅
              </Box>
            </Box>
            <Typography sx={{ color: "#1976d2" }}>
              No event selected.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: "#f5f5f5",
          borderTop: "1px solid #e0e0e0",
          p: 2,
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "#1976d2",
            fontWeight: 500,
            textTransform: "none",
            px: 3,
            border: "1px solid #1976d2",
            "&:hover": {
              border: "1px solid #1565c0",
            },
          }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          onClick={() => router.push("/xyz/preview")}
          sx={{
            textTransform: "none",
            fontWeight: 400,
            px: 4,
          }}
        >
          Preview
        </Button>
      </DialogActions>
    </Dialog>
  );
}
