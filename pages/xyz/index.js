"use client";
import React, { useState } from "react";
import { Box, Grid, Paper } from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import LeftSide from "@/components/calendar/left-side/LeftSide";
import EventDetailsDialog from "@/components/calendar/dialogs/EventDetailsDialog";
import BreakDialog from "@/components/calendar/dialogs/DialogBreak";
import HolidayDialog from "@/components/calendar/dialogs/HolidayDialog";
import CustomToolbar from "@/components/calendar/right-side/CustomToolbar";

import { setOpenDialog, setOpenHolidayDialog } from "@/redux/store/slices/calendarSlice";
import { calendarStyles } from "@/components/calendar/styles/calendarStyles";

const localizer = momentLocalizer(moment);

export default function CalendarMerge() {
  const router = useRouter();
  const dispatch = useDispatch();

  // ===== REDUX STATE =====
  const events = useSelector((state) => state.calendar.events);
  const isCalendarPublished = useSelector(
    (state) => state.calendar.isCalendarPublished
  );
  const isEditMode = useSelector((state) => state.calendar.isEditMode);

  // ===== LOCAL STATE =====
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // const [holidayOpen, setHolidayOpen] = useState(false);

  // ===== EVENT HANDLERS =====
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const handleShowBreakDialog = () => {
    dispatch(setOpenDialog(true));
  };

  const handleShowHolidayDialog = () => {
    dispatch(setOpenHolidayDialog(true));
  };

  const handleCloseHolidayDialog = () => {
   dispatch( setOpenHolidayDialog(false));
  };

  // ===== COMPUTED VALUES =====
  const isFieldsDisabled = isCalendarPublished && !isEditMode;

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: "#b3e5fc",
      border: "1px solid #0288d1",
      color: "black",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center !important",
      marginLeft: "0px",
      cursor: isFieldsDisabled ? "not-allowed" : "pointer",
      opacity: isFieldsDisabled ? 0.7 : 1,
      pointerEvents: isFieldsDisabled ? "none" : "auto",
    },
  });

  // ===== RENDER =====
  return (
    <Box bgcolor="#f9fafb" p={1}>
      <Grid container spacing={1}>
        {/* Left Sidebar */}
        <Grid item xs={12} md={3} lg={3} size={{ md: 3 }}>
          <LeftSide />
        </Grid>

        {/* Main Calendar */}
        <Grid item xs={12} md={8.5} lg={9} size={{ md: 9 }}>
          <Paper elevation={2} sx={calendarStyles}>
            <Calendar
              localizer={localizer}
              events={events}
              defaultView="week"
              views={["day", "week", "month", "agenda"]}
              onSelectEvent={handleEventClick}
              style={{ height: "109vh" }}
              eventPropGetter={eventStyleGetter}
              components={{
                toolbar: (toolbarProps) => (
                  <CustomToolbar
                    {...toolbarProps}
                    isFieldsDisabled={isFieldsDisabled}
                    onShowBreak={handleShowBreakDialog}
                    handleShowHolidayDialog={handleShowHolidayDialog}
                  />
                ),
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Dialogs */}
      <EventDetailsDialog
        open={open}
        selectedEvent={selectedEvent}
        onClose={handleClose}
        router={router}
      />
      <BreakDialog />
      <HolidayDialog 
      />
    </Box>
  );
}