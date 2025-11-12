// import React, { useState, useMemo } from "react";
// import CommonCard from "@/components/CommonCard";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Typography,
//   Select,
//   MenuItem,
//   Box,
  
//   TextField,
// } from "@mui/material";
// import { Delete } from "@mui/icons-material";
// import dayjs from "dayjs";
// import Image from "next/image";
// import noData from "../../../public/noData.webp";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { validateSlotAndSave, validationSchema } from "./validation";
// import { timePickarStyle } from "./commonStyles";
// import { useWorkingPlanErrors } from "@/hook/useWorkingPlanErrors";

// function WorkingPlan({
//   data,
//   deleteSlot,
//   openModal,
//   schedule = [],
//   weekDays,
//   editMode,
//   selectedServices,
//   setSchedule,
//   setWorkingPlanErrors,
// }) {
//  const [errors, setErrors] = useWorkingPlanErrors(setWorkingPlanErrors);
 

//   const hasData =
//     Array.isArray(schedule) &&
//     schedule.some((daySlots) => Array.isArray(daySlots) && daySlots.length > 0);

  

//   const activeDays = useMemo(
//     () => weekDays.filter((day, idx) => (schedule[idx]?.length || 0) > 0),
//     [weekDays, schedule]
//   );

//   const validateAndSave = async (dayIndex, slot) => {
//     const key = `${dayIndex}-${slot.id}`;

//     await validateSlotAndSave({
//       values: { ...slot, days: [dayIndex] },
//       validationSchema,
//       selectedServices,
//       schedule,
//       setErrors: (newErrors) =>
//         setErrors((prev) => ({
//           ...prev,
//           [key]: newErrors,
//         })),
//       editing: { dayIndex, slotId: slot.id },
//       setSchedule,
//       onSave: (slot) => handleSave("workingPlan", slot),
//     });
//   };
//   const renderHelperText = (text) => (
//     <Typography
//       color="error"
//       variant="caption"
//       sx={{  minHeight: "18px", textAlign: "center" }}
//     >
//       {text}
//     </Typography>
//   );

//   return (
//     <CommonCard
//       title={
//         <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <CalendarMonthIcon sx={{ color: "#1976d2", width: 25, height: 25 }} />
//           Working Plan
//         </span>
//       }
//       actions={[
//         {
//           label: "Add",
//           onClick: openModal,
//           variant: "contained",
//           disabled: !editMode,
//         },
//       ]}
//     >
//       <TableContainer>
//         <Table size="small" sx={{ mt: 1 }}>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: "rgb(198, 228, 251)" }}>
//               {data.map((item, index) => (
//                 <TableCell
//                   key={index}
//                   align="center"
//                   sx={{
//                     color: "black",
//                     textAlign: "center",
//                     ...(index === 0 && {
//                       borderTopLeftRadius: "8px",
//                       borderBottomLeftRadius: "8px",
//                     }),
//                     ...(index === data.length - 1 && {
//                       borderTopRightRadius: "8px",
//                       borderBottomRightRadius: "8px",
//                     }),
//                   }}
//                 >
//                   {item.type}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {!hasData ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={data.length}
//                   align="center"
//                   sx={{ borderBottom: "none" }}
//                 >
//                   <Image
//                     alt="No data available"
//                     src={noData}
//                     height={139}
//                     width={176}
//                     style={{ objectFit: "contain" }}
//                   />
//                   <Typography>No data available.</Typography>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               activeDays.map((day) => {
//                 const dayIndex = weekDays.indexOf(day);
//                 return schedule[dayIndex].map((slot, slotIndex) => {
//                   const errorKey = `${dayIndex}-${slot.id}`;
//                   const slotErrors = errors[errorKey] || {};

//                   return (
//                     <TableRow
//                       key={slot.id}
//                       sx={{
//                         position: "sticky",
//                         "&:hover": {
//                           backgroundColor: editMode
//                             ? "rgb(198 228 251 / 25%)"
//                             : "none",
//                         },
//                       }}
//                     >
//                       {slotIndex === 0 && (
//                         <TableCell
//                           sx={{
//                             textAlign: "center",
//                             borderRight: "1px solid #cfcfcf",
//                           }}
//                           rowSpan={schedule[dayIndex].length}
//                         >
//                           {day}
//                         </TableCell>
//                       )}

//                       {/* Service */}

//                       <TableCell align="center">
//                         <Select
//                           disabled={!editMode}
//                           sx={{
//                             height: "40px",
//                             gap: 3,
//                             minWidth: "199px",
//                             maxWidth: "140px",
//                             ".MuiSelect-select": {
//                               display: "flex",
//                               alignItems: "center",
//                               overflow: "visible !important",
//                               textOverflow: "unset",
//                               whiteSpace: "normal",
//                             },
//                           }}
//                           size="small"
//                           name="service"
//                           value={slot.service}
//                           onChange={(e) => {
//                             const updatedSlot = {
//                               ...slot,
//                               service: e.target.value,
//                             };
//                             setSchedule((prev) => {
//                               const updated = [...prev];
//                               updated[dayIndex][slotIndex] = updatedSlot;
//                               return updated;
//                             });
//                             validateAndSave(dayIndex, updatedSlot);
//                           }}
//                           error={Boolean(slotErrors.service)}
//                         >
//                           {selectedServices.map((service) => (
//                             <MenuItem key={service.type} value={service.type}>
//                               <Box
//                                 sx={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "space-between", // 👈 text left, icon right
//                                   // width: "100%",
//                                 }}
//                               >
//                                 {/* Text Left */}
//                                 <Box component="span" sx={{ fontSize: "14px" }}>
//                                   {service.type} ({service.time})
//                                 </Box>

//                                 {/* Icon Right */}
//                                 <Box component="span" sx={{ color: "#1976d2" }}>
//                                   {service.icon}
//                                 </Box>
//                               </Box>
//                             </MenuItem>
//                           ))}
//                         </Select>
//                         {renderHelperText(slotErrors.service)}
//                       </TableCell>

//                       {/* Start Time */}
//                       <TableCell align="center" sx={{}}>
//                           <LocalizationProvider dateAdapter={AdapterDayjs}>
//                             <TimePicker
//                               disabled={!editMode}
//                               sx={timePickarStyle}
//                               value={dayjs(`1970-01-01T${slot.startTime}`)}
//                               onChange={(newValue) => {
//                                 const updatedSlot = {
//                                   ...slot,
//                                   startTime: newValue
//                                     ? dayjs(newValue).format("HH:mm")
//                                     : "",
//                                 };
//                                 setSchedule((prev) => {
//                                   const updated = [...prev];
//                                   updated[dayIndex][slotIndex] = updatedSlot;
//                                   return updated;
//                                 });
//                                 validateAndSave(dayIndex, updatedSlot);
//                               }}
//                               slotProps={{
//                                 textField: {
//                                   size: "small",
//                                   error: Boolean(slotErrors.startTime), // Added error prop for red border on error
//                                 },
//                               }}
//                             />
//                             {renderHelperText(slotErrors.startTime)}
//                           </LocalizationProvider>
//                       </TableCell>

//                       {/* End Time */}
//                       <TableCell align="center" sx={{}}>
//                           <LocalizationProvider dateAdapter={AdapterDayjs}>
//                             <TimePicker
//                               disabled={!editMode}
//                               sx={timePickarStyle}
//                               value={dayjs(`1970-01-01T${slot.endTime}`)}
//                               onChange={(newValue) => {
//                                 const updatedSlot = {
//                                   ...slot,
//                                   endTime: newValue
//                                     ? dayjs(newValue).format("HH:mm")
//                                     : "",
//                                 };
//                                 setSchedule((prev) => {
//                                   const updated = [...prev];
//                                   updated[dayIndex][slotIndex] = updatedSlot;
//                                   return updated;
//                                 });
//                                 validateAndSave(dayIndex, updatedSlot);
//                               }}
//                               slotProps={{
//                                 textField: {
//                                   size: "small",
//                                   error: Boolean(slotErrors.endTime), // Added error prop for red border on error
//                                 },
//                               }}
//                             />
//                             {renderHelperText(slotErrors.endTime)}
//                           </LocalizationProvider>
//                       </TableCell>

//                       {/* Actions */}
//                       <TableCell align="center">
//                         <IconButton
//                           size="small"
//                           disabled={!editMode}
//                           sx={{ color: "#d32f2f" }}
//                           onClick={() => deleteSlot(dayIndex, slot.id)}
//                         >
//                           <Delete />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 });
//               })
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </CommonCard>
//   );
// }

// export default WorkingPlan;
