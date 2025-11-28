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

import {
  selectIsFieldsDisabled,
  setOpenDialog,
  setOpenHolidayDialog,
} from "@/redux/store/slices/calendarSlice";
import { calendarStyles } from "@/components/calendar/styles/calendarStyles";


const localizer = momentLocalizer(moment);

export default function CalendarMerge() {

   const isFieldsDisabled = useSelector(selectIsFieldsDisabled);


  const router = useRouter();
  const dispatch = useDispatch();

  const events = useSelector((state) => state.calendar.events);
  const isCalendarPublished = useSelector(
    (state) => state.calendar.isCalendarPublished
  );
  const isEditMode = useSelector((state) => state.calendar.isEditMode);

  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);


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

 
  return (
    <Box 
      bgcolor="#f9fafb" 
      sx={{ 
        p: { xs: 0.5, sm: 1 },
        width: '100%',
        overflowX: 'hidden'
      }}
    >
      <Grid container spacing={{ xs: 0.5, sm: 1 }}>
        {/* Left Sidebar */}
        <Grid size={{ xs: 12, sm: 12, md: 4.5, lg: 2.9 }}>
          <LeftSide />
        </Grid>

        {/* Main Calendar */}
        <Grid size={{ xs: 12, sm: 12, md: 7.5, lg: 9.1 }}>
          <Paper 
            elevation={2} 
            sx={{
              ...calendarStyles,
              width: '100%',
              overflow: 'hidden',
              '& .rbc-calendar': {
                width: '100% !important'
              }
            }}
          >
            <Calendar
              localizer={localizer}
              events={events}
              defaultView="week"
              views={["day", "week", "month", "agenda"]}
              onSelectEvent={handleEventClick}
              style={{ 
                // height: 'calc(100vh - 100px)',
                // minHeight: '500px',
                // width: '100vh',
                height:"95.4vh"
              }}
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
      <HolidayDialog />
    </Box>
  );
}

