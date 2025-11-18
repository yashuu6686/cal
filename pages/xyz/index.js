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
  setOpenDialog,
  setOpenHolidayDialog,
} from "@/redux/store/slices/calendarSlice";
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
    dispatch(setOpenHolidayDialog(false));
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
        <Grid size={{ xs: 12, sm: 12, md: 4.5, lg: 3 }}>
          <LeftSide />
        </Grid>

        {/* Main Calendar */}
        <Grid size={{ xs: 12, sm: 12, md: 7.5, lg: 9 }}>
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
                height:"109vh"
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




// "use client";
// import React, { useState } from "react";
// import { 
//   Box, 
//   Grid, 
//   Paper, 
//   Card, 
//   CardContent, 
//   Typography,
//   Chip,
//   useMediaQuery,
//   useTheme 
// } from "@mui/material";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/navigation";

// import LeftSide from "@/components/calendar/left-side/LeftSide";
// import EventDetailsDialog from "@/components/calendar/dialogs/EventDetailsDialog";
// import BreakDialog from "@/components/calendar/dialogs/DialogBreak";
// import HolidayDialog from "@/components/calendar/dialogs/HolidayDialog";
// import CustomToolbar from "@/components/calendar/right-side/CustomToolbar";

// import {
//   setOpenDialog,
//   setOpenHolidayDialog,
// } from "@/redux/store/slices/calendarSlice";
// import { calendarStyles } from "@/components/calendar/styles/calendarStyles";

// const localizer = momentLocalizer(moment);

// export default function CalendarMerge() {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   // ===== REDUX STATE =====
//   const eventsFromStore = useSelector((state) => state.calendar.events);
//   const isCalendarPublished = useSelector(
//     (state) => state.calendar.isCalendarPublished
//   );
//   const isEditMode = useSelector((state) => state.calendar.isEditMode);

//   // Format events to ensure all required properties exist
//   const events = React.useMemo(() => {
//     if (!Array.isArray(eventsFromStore)) return [];
    
//     return eventsFromStore.map(event => ({
//       ...event,
//       title: event.title || event.serviceType || 'Untitled Event',
//       start: event.start ? new Date(event.start) : new Date(),
//       end: event.end ? new Date(event.end) : new Date(),
//     }));
//   }, [eventsFromStore]);

//   // ===== LOCAL STATE =====
//   const [open, setOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);

//   // ===== EVENT HANDLERS =====
//   const handleEventClick = (event) => {
//     setSelectedEvent(event);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedEvent(null);
//   };

//   const handleShowBreakDialog = () => {
//     dispatch(setOpenDialog(true));
//   };

//   const handleShowHolidayDialog = () => {
//     dispatch(setOpenHolidayDialog(true));
//   };

//   const handleCloseHolidayDialog = () => {
//     dispatch(setOpenHolidayDialog(false));
//   };

//   // ===== COMPUTED VALUES =====
//   const isFieldsDisabled = isCalendarPublished && !isEditMode;

//   const eventStyleGetter = () => ({
//     style: {
//       backgroundColor: "#b3e5fc",
//       border: "1px solid #0288d1",
//       color: "black",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       textAlign: "center !important",
//       marginLeft: "0px",
//       cursor: isFieldsDisabled ? "not-allowed" : "pointer",
//       opacity: isFieldsDisabled ? 0.7 : 1,
//       pointerEvents: isFieldsDisabled ? "none" : "auto",
//     },
//   });

//   // Group events by date for mobile view
//   const groupedEvents = React.useMemo(() => {
//     const grouped = {};
//     events.forEach(event => {
//       const dateKey = moment(event.start).format('YYYY-MM-DD');
//       if (!grouped[dateKey]) {
//         grouped[dateKey] = [];
//       }
//       grouped[dateKey].push(event);
//     });
//     return grouped;
//   }, [events]);

//   // ===== MOBILE CARD VIEW =====
//   const MobileEventCards = () => (
//     <Box sx={{ p: 1.5 }}>
//       {Object.keys(groupedEvents).length === 0 ? (
//         <Card 
//           sx={{ 
//             mb: 2,
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             color: 'white'
//           }}
//         >
//           <CardContent sx={{ textAlign: 'center', py: 6 }}>
//             <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
//               📅 No Events Yet
//             </Typography>
//             <Typography variant="body2" sx={{ opacity: 0.9 }}>
//               Your schedule is clear!
//             </Typography>
//           </CardContent>
//         </Card>
//       ) : (
//         Object.keys(groupedEvents).sort().map(dateKey => {
//           const isToday = moment(dateKey).isSame(moment(), 'day');
//           const isPast = moment(dateKey).isBefore(moment(), 'day');
          
//           return (
//             <Box key={dateKey} sx={{ mb: 3.5 }}>
//               <Box 
//                 sx={{ 
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 1.5,
//                   mb: 1.5,
//                   pb: 1,
//                   borderBottom: '2px solid',
//                   borderColor: isToday ? '#1976d2' : '#e0e0e0'
//                 }}
//               >
//                 <Box
//                   sx={{
//                     backgroundColor: isToday ? '#1976d2' : isPast ? '#9e9e9e' : '#4caf50',
//                     color: 'white',
//                     borderRadius: 2,
//                     p: 1,
//                     minWidth: '60px',
//                     textAlign: 'center',
//                     boxShadow: 2
//                   }}
//                 >
//                   <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
//                     {moment(dateKey).format('DD')}
//                   </Typography>
//                   <Typography variant="caption" sx={{ fontSize: '10px', lineHeight: 1 }}>
//                     {moment(dateKey).format('MMM')}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ flex: 1 }}>
//                   <Typography 
//                     variant="subtitle1" 
//                     sx={{ 
//                       fontWeight: 600,
//                       color: '#1976d2',
//                       fontSize: '15px'
//                     }}
//                   >
//                     {moment(dateKey).format('dddd')}
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     {isToday ? '• Today' : isPast ? '• Past' : '• Upcoming'}
//                   </Typography>
//                 </Box>
//               </Box>

//               {groupedEvents[dateKey].map((event, index) => (
//                 <Card 
//                   key={index}
//                   onClick={() => !isFieldsDisabled && handleEventClick(event)}
//                   sx={{ 
//                     mb: 1.5,
//                     cursor: isFieldsDisabled ? 'not-allowed' : 'pointer',
//                     opacity: isFieldsDisabled ? 0.7 : 1,
//                     borderLeft: '4px solid #0288d1',
//                     borderRadius: 2,
//                     // background: 'linear-gradient(to right, #e3f2fd 0%, #ffffff 15%)',
//                     boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//                     transition: 'all 0.3s ease',
//                     '&:hover': {
//                       boxShadow: isFieldsDisabled ? '0 2px 8px rgba(0,0,0,0.08)' : '0 4px 16px rgba(2,136,209,0.2)',
//                       transform: isFieldsDisabled ? 'none' : 'translateX(4px)',
//                     }
//                   }}
//                 >
//                   <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
//                       <Typography 
//                         variant="subtitle1" 
//                         sx={{ 
//                           fontWeight: 700,
//                           color: '#01579b',
//                           fontSize: '16px',
//                           flex: 1,
//                           pr: 1
//                         }}
//                       >
//                         {event.title}
//                       </Typography>
//                       <Chip 
//                         label={event.serviceType || 'Event'} 
//                         size="small"
//                         sx={{ 
//                           backgroundColor: '#0288d1',
//                           color: 'white',
//                           fontSize: '11px',
//                           fontWeight: 600,
//                           height: '24px',
//                           boxShadow: '0 2px 4px rgba(2,136,209,0.3)'
//                         }}
//                       />
//                     </Box>
                    
//                     <Box 
//                       sx={{ 
//                         display: 'flex', 
//                         gap: 2, 
//                         backgroundColor: 'rgba(2,136,209,0.05)',
//                         borderRadius: 1.5,
//                         p: 1.5,
//                         mb: event.description ? 1.5 : 0
//                       }}
//                     >
//                       <Box sx={{ flex: 1 }}>
//                         <Typography 
//                           variant="caption" 
//                           sx={{ 
//                             color: '#0288d1',
//                             fontWeight: 600,
//                             fontSize: '11px',
//                             display: 'block',
//                             mb: 0.5
//                           }}
//                         >
//                           🕐 START
//                         </Typography>
//                         <Typography variant="body2" sx={{ fontWeight: 600, color: '#01579b' }}>
//                           {moment(event.start).format('h:mm A')}
//                         </Typography>
//                       </Box>
//                       <Box 
//                         sx={{ 
//                           width: '2px', 
//                           backgroundColor: '#b3e5fc',
//                           my: 0.5
//                         }} 
//                       />
//                       <Box sx={{ flex: 1 }}>
//                         <Typography 
//                           variant="caption" 
//                           sx={{ 
//                             color: '#0288d1',
//                             fontWeight: 600,
//                             fontSize: '11px',
//                             display: 'block',
//                             mb: 0.5
//                           }}
//                         >
//                           🕐 END
//                         </Typography>
//                         <Typography variant="body2" sx={{ fontWeight: 600, color: '#01579b' }}>
//                           {moment(event.end).format('h:mm A')}
//                         </Typography>
//                       </Box>
//                       <Box sx={{ flex: 1, textAlign: 'center' }}>
//                         <Typography 
//                           variant="caption" 
//                           sx={{ 
//                             color: '#0288d1',
//                             fontWeight: 600,
//                             fontSize: '11px',
//                             display: 'block',
//                             mb: 0.5
//                           }}
//                         >
//                           ⏱️ DURATION
//                         </Typography>
//                         <Typography variant="body2" sx={{ fontWeight: 600, color: '#01579b' }}>
//                           {moment.duration(moment(event.end).diff(moment(event.start))).asHours().toFixed(1)}h
//                         </Typography>
//                       </Box>
//                     </Box>

//                     {event.description && (
//                       <Box
//                         sx={{
//                           backgroundColor: '#f5f5f5',
//                           borderRadius: 1.5,
//                           p: 1.5,
//                           borderLeft: '3px solid #b3e5fc'
//                         }}
//                       >
//                         <Typography 
//                           variant="body2" 
//                           color="text.secondary" 
//                           sx={{ fontSize: '13px', lineHeight: 1.5 }}
//                         >
//                           {event.description}
//                         </Typography>
//                       </Box>
//                     )}
//                   </CardContent>
//                 </Card>
//               ))}
//             </Box>
//           );
//         })
//       )}
//     </Box>
//   );

//   // ===== RENDER =====
//   return (
//     <Box 
//       bgcolor="#f9fafb" 
//       sx={{ 
//         p: { xs: 0.5, sm: 1 },
//         width: '100%',
//         overflowX: 'hidden'
//       }}
//     >
//       <Grid container spacing={{ xs: 0.5, sm: 1 }}>
//         {/* Left Sidebar */}
//         <Grid size={{ xs: 12, sm: 12, md: 4.5, lg: 3 }}>
//           <LeftSide />
//         </Grid>

//         {/* Main Content - Calendar for Desktop, Cards for Mobile */}
//         <Grid size={{ xs: 12, sm: 12, md: 7.5, lg: 9 }}>
//           {isMobile ? (
//             <Paper elevation={1} sx={{ borderRadius: 2 }}>
//               <MobileEventCards />
//             </Paper>
//           ) : (
//             <Paper 
//               elevation={2} 
//               sx={{
//                 ...calendarStyles,
//                 width: '100%',
//                 overflow: 'hidden',
//                 '& .rbc-calendar': {
//                   width: '100% !important'
//                 }
//               }}
//             >
//               <Calendar
//                 localizer={localizer}
//                 events={events}
//                 defaultView="week"
//                 views={["day", "week", "month", "agenda"]}
//                 onSelectEvent={handleEventClick}
//                 style={{ 
//                   height:"109vh"
//                 }}
//                 eventPropGetter={eventStyleGetter}
//                 components={{
//                   toolbar: (toolbarProps) => (
//                     <CustomToolbar
//                       {...toolbarProps}
//                       isFieldsDisabled={isFieldsDisabled}
//                       onShowBreak={handleShowBreakDialog}
//                       handleShowHolidayDialog={handleShowHolidayDialog}
//                     />
//                   ),
//                 }}
//               />
//             </Paper>
//           )}
//         </Grid>
//       </Grid>

//       {/* Dialogs */}
//       <EventDetailsDialog
//         open={open}
//         selectedEvent={selectedEvent}
//         onClose={handleClose}
//         router={router}
//       />
//       <BreakDialog />
//       <HolidayDialog />
//     </Box>
//   );
// }