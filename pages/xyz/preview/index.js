"use client";
import { Grid, Paper, Box, Typography, Chip } from "@mui/material";
import React, { useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

function Preview() {
  const localizer = momentLocalizer(moment);
  const weekSchedule = useSelector((state) => state.calendar.weekSchedule);
  const router = useRouter();

  const generateTimeSlots = (start, end, intervalMinutes) => {
    const slots = [];
    let current = moment(start);
    while (current.isBefore(end)) {
      const next = moment(current).add(intervalMinutes, "minutes");
      if (next.isAfter(end)) break;
      slots.push({ start: current.toDate(), end: next.toDate() });
      current = next;
    }
    return slots;
  };

  const previewEvents = useMemo(() => {
    const divided = [];
    const today = moment().startOf("day");
    const next7Days = Array.from({ length: 7 }, (_, i) =>
      today.clone().add(i, "days")
    );

    next7Days.forEach((day) => {
      const weekDayName = day.format("dddd");
      const schedule = weekSchedule.find((s) => s.day === weekDayName);
      if (!schedule) return;

      schedule.slots.forEach((slot) => {
        const start = day
          .clone()
          .set({ hour: slot.start.hour(), minute: slot.start.minute() });
        const end = day
          .clone()
          .set({ hour: slot.end.hour(), minute: slot.end.minute() });

        // FIX: Get duration from slot, or calculate from selected service
        const intervalMinutes = slot.duration || 15;
        
        console.log(`Service: ${slot.serviceType}, Duration: ${intervalMinutes} minutes`);
        
        const intervals = generateTimeSlots(start, end, intervalMinutes);

        intervals.forEach((i) => {
          divided.push({
            start: i.start,
            end: i.end,
            color: "#1c95f1ff",
            serviceType: slot.serviceType,
            duration: intervalMinutes,
          });
        });
      });
    });

    return divided;
  }, [weekSchedule]);

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: "#e3f2fd",
      border: "2px solid #1976d2",
      borderRadius: "12px",
      color: "#000",
      boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      transition: "all 0.3s ease",
    },
  });

  const totalSlots = previewEvents.length;
  const uniqueDays = new Set(
    previewEvents.map((e) => moment(e.start).format("YYYY-MM-DD"))
  ).size;

  return (
    <Box
      sx={{
        bgcolor: "#f9fafb",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Box
        onClick={() => router.back()}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          color: "#1976d2",
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "10px 16px",
          boxShadow: "0 2px 8px rgba(25, 118, 210, 0.2)",
          transition: "all 0.3s ease",
          fontWeight: 500,
          fontSize: "14px",
          ml: 1,
          "&:hover": {
            color: "white",
            backgroundColor: "#1976d2",
            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.4)",
            transform: "translateX(-1px)",
          },
        }}
      >
        <ArrowBackIcon sx={{ fontSize: "20px" }} />
        <span>Back</span>
      </Box>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Calendar Section */}
        <Grid item size={{ md: 12 }} md={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              background:
                "linear-gradient(to bottom, #ffffff 0%, #f8fbff 100%)",
              border: "2px solid #e3f2fd",
              boxShadow: "0 8px 32px rgba(25, 118, 210, 0.08)",
              "& .rbc-calendar": {
                backgroundColor: "transparent",
              },
              "& .rbc-header": {
                backgroundColor: "#e3f2fd",
                color: "#1565c0",
                fontWeight: 600,
                fontSize: "1rem",
                padding: "16px 8px",
                borderBottom: "2px solid #1976d2",
                borderRadius: "8px 8px 0 0",
              },
              "& .rbc-today": {
                backgroundColor: "#f0f7ff",
              },
              "& .rbc-time-slot": {
                borderTop: "1px solid #e3f2fd",
              },
              "& .rbc-time-column": {
                "& .rbc-timeslot-group": {
                  borderLeft: "2px solid #e3f2fd",
                },
              },
              "& .rbc-current-time-indicator": {
                backgroundColor: "#1976d2",
                height: 3,
              },
              "& .rbc-day-slot .rbc-time-slot": {
                borderTop: "1px solid #f0f7ff",
              },
              "& .rbc-time-header-content": {
                borderLeft: "2px solid #e3f2fd",
              },
              "& .rbc-toolbar": {
                backgroundColor: "#e3f2fd",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "24px",
                border: "2px solid #90caf9",
                "& button": {
                  color: "#1976d2",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "2px solid transparent",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "2px solid #1565c0",
                  },
                  "&.rbc-active": {
                    backgroundColor: "#1976d2",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                  },
                },
              },
              "& .rbc-event": {
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0 6px 16px rgba(25, 118, 210, 0.3)",
                  backgroundColor: "#bbdefb",
                  borderColor: "#1565c0",
                },
              },
            }}
          >
            <Calendar
              localizer={localizer}
              events={previewEvents}
              defaultView="week"
              views={["week"]}
              eventPropGetter={eventStyleGetter}
               step={60}
              timeslots={1}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Preview;