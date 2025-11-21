// "use client";
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useFormikContext, getIn } from "formik";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Tooltip,
//   TextField,
//   MenuItem,
//   Chip,
//   Stack,
//   Paper,
//   Divider,
// } from "@mui/material";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";
// // import CommonErrorDialogBox from "@/components/CommonDialogBox";
// import { toast } from "react-toastify";
// import CommonDialogBox from "@/components/CommonDialogBox";
// import {
//   getDoctorCalendar,
// } from "@/redux/store/slices/calendarSlice";
// import SectionHeader from "@/components/SectionHeader";
// import { TimePickerPair } from "@/components/timePickerUtils";

// const days = [
//   { short: "Sun", full: "Sunday" },
//   { short: "Mon", full: "Monday" },
//   { short: "Tue", full: "Tuesday" },
//   { short: "Wed", full: "Wednesday" },
//   { short: "Thu", full: "Thursday" },
//   { short: "Fri", full: "Friday" },
//   { short: "Sat", full: "Saturday" },
// ];

// const WorkingPlanView = ({ disabled = false }) => {
//   const [openDelete, setOpenDelete] = React.useState(false);
//   const [slotToDelete, setSlotToDelete] = React.useState(null);
//   const [openValidationDialog, setOpenValidationDialog] = React.useState(false);

//   const dispatch = useDispatch();
//   const { values, errors, touched, setFieldValue, setFieldTouched } =
//     useFormikContext();

//   // Redux selectors
//   const weekSchedule = useSelector((state) => state.calendar.weekSchedule);
//       const { calendar } = useSelector((state) => state.calendar);

//   const getDaySlots = (dayName) => {
//     const dayData = weekSchedule.find((d) => d.day === dayName);
//     return dayData ? dayData.slots : [];
//   };

//   //   Get error for specific slot field
//   const getSlotError = (dayIndex, slotIndex, field) => {
//     const errorPath = `weekSchedule[${dayIndex}].slots[${slotIndex}].${field}`;
//     const touchPath = `weekSchedule[${dayIndex}].slots[${slotIndex}].${field}`;

//     const error = errors[errorPath];
//     const isTouched = touched[touchPath];

//     // Return error if it exists (touched state is handled by validation trigger)
//     return error || "";
//   };

//   // Recursively flatten nested Formik errors
//   // const flattenErrors = (obj, result = []) => {
//   //   Object.values(obj).forEach((val) => {
//   //     if (typeof val === "string") {
//   //       result.push(val);
//   //     } else if (typeof val === "object" && val !== null) {
//   //       flattenErrors(val, result);
//   //     }
//   //   });
//   //   return result;
//   // };

//      useEffect(() => {
//     dispatch(getDoctorCalendar());
//   }, [dispatch]);

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Box>
//         {/* Header */}
//        <SectionHeader
//        title="Working Plan"
//        />

//         {/* Days Container */}
//         <Box>
//           {days.map((day, dayIndex) => {
//             const daySlots = getDaySlots(day.full);

//             return (
//               <Paper
//                 key={day.short}
//                 elevation={0}
//                 sx={{
//                   mb: 1.5,
//                   borderRadius: 2,
//                   overflow: "hidden",
//                   border: "1px solid #e3f2fd",
//                 }}
//               >
//                 {/* Day Header */}
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     bgcolor: "#f5f9ff",
//                     px: 1,
//                     py: 0.5,
//                   }}
//                 >
//                   <Stack direction="row" alignItems="center" spacing={2}>
//                     <Typography
//                       sx={{
//                         fontWeight: 600,
//                         fontSize: "1rem",
//                         color: "#1565c0",
//                       }}
//                     >
//                       {day.full}
//                     </Typography>

//                     {daySlots.length > 0 && (
//                       <Chip
//                         label={`${daySlots.length} slot${
//                           daySlots.length > 1 ? "s" : ""
//                         }`}
//                         size="small"
//                         sx={{
//                           bgcolor: "#e3f2fd",
//                           color: "#1565c0",
//                           fontWeight: 500,
//                           height: 24,
//                         }}
//                       />
//                     )}
//                   </Stack>

//                   <Tooltip title="Add New Slot" arrow placement="left">
//                     <IconButton
//                       size="small"
//                       disabled={disabled}
//                       sx={{
//                         bgcolor: "#1172BA",
//                         color: "white",
//                         width: 33,
//                         height: 33,
//                         "&:hover": {
//                           bgcolor: "#1172BA",
//                           transform: "rotate(90deg)",
//                         },
//                         "&:disabled": {
//                           bgcolor: "#90caf9",
//                           color: "white",
//                         },
//                         transition: "all 0.3s",
//                       }}
//                     >
//                       <AddCircleOutlineIcon fontSize="small" />
//                     </IconButton>
//                   </Tooltip>
//                 </Box>

//                 {/* Slots Content */}
//                 <Box sx={{ p: 1 }}>
//                   {daySlots.length === 0 ? (
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         color: "#90a4ae",
//                         textAlign: "center",
//                         fontStyle: "italic",
//                       }}
//                     >
//                       No slots added yet. Click + to add a slot.
//                     </Typography>
//                   ) : (
//                     <Box>
//                       {daySlots.map((slot, slotIndex) => {
//                         const serviceTypeError = getSlotError(
//                           dayIndex,
//                           slotIndex,
//                           "serviceType"
//                         );
//                         const startError = getSlotError(
//                           dayIndex,
//                           slotIndex,
//                           "start"
//                         );
//                         const endError = getSlotError(
//                           dayIndex,
//                           slotIndex,
//                           "end"
//                         );

//                         return (
//                           <React.Fragment key={slot.id}>
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 gap: 1,
//                                 p: 1,
//                                 borderRadius: "8px",
//                               }}
//                             >
//                               {/* Row 1: Service Type + Delete Button */}
//                               <Box
//                                 sx={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "space-between",
//                                   gap: 1,
//                                 }}
//                               >
//                                 <TextField
//                                   select
//                                   disabled={disabled}
//                                   label="Service Type"
//                                   sx={{ flexGrow: 1 }}
//                                   value={slot.serviceType || ""}
//                                   error={Boolean(serviceTypeError)}
//                                   helperText={serviceTypeError}
//                                   onChange={(e) => {
//                                     handleSlotChange(
//                                       day.full,
//                                       slot.id,
//                                       "serviceType",
//                                       e.target.value
//                                     );
//                                     // Mark field as touched
//                                     //   setFieldTouched(
//                                     //     `weekSchedule[${dayIndex}].slots[${slotIndex}].serviceType`,
//                                     //     true
//                                     //   );
//                                     // }}
//                                     // onBlur={() => {
//                                     //   setFieldTouched(
//                                     //     `weekSchedule[${dayIndex}].slots[${slotIndex}].serviceType`,
//                                     //     true
//                                     //   );
//                                   }}
//                                 >
//                                   {selectedServices.map((s) => (
//                                     <MenuItem key={s.type} value={s.type}>
//                                       <Stack
//                                         direction="row"
//                                         spacing={1}
//                                         sx={{
//                                           display: "flex",
//                                           justifyContent: "space-between",
//                                           alignItems: "center",
//                                         }}
//                                       >
//                                         {" "}
//                                         <span>{s.type}</span>
//                                         <Chip
//                                           color="primary"
//                                           label={`${s.time} minutes`}
//                                           size="small"
//                                           sx={{
//                                             height: 20,
//                                             fontSize: "0.7rem",
//                                             // bgcolor: "#e3f2fd",
//                                             // color: "#1565c0",
//                                           }}
//                                         />
//                                       </Stack>
//                                     </MenuItem>
//                                   ))}
//                                 </TextField>

//                                 <Tooltip title="Delete Slot" arrow>
//                                   <IconButton
//                                     disabled={disabled}
//                                     onClick={() => {
//                                       setSlotToDelete({
//                                         day: day.full,
//                                         slotId: slot.id,
//                                         slotName:
//                                           slot.serviceType || "this slot",
//                                       });
//                                       setOpenDelete(true);
//                                     }}
//                                     sx={{
//                                       color: "#d32f2f",
//                                       bgcolor: "#ffebee",
//                                       "&:hover": {
//                                         bgcolor: "#ffcdd2",
//                                         transform: "scale(1.1)",
//                                       },
//                                       "&:disabled": {
//                                         bgcolor: "#fce4ec",
//                                         color: "#e57373",
//                                       },
//                                       transition: "all 0.2s",
//                                     }}
//                                   >
//                                     <DeleteOutlineIcon fontSize="small" />
//                                   </IconButton>
//                                 </Tooltip>
//                               </Box>

//                               {/* Row 2: Start Time + End Time */}
//                               <Box
//                                 sx={{
//                                   display: "flex",
//                                   justifyContent: "space-between",
//                                   gap: 2,
//                                 }}
//                               >
//                                 {/* <TimePicker
//                                   disabled={disabled}
//                                   label="Start Time"
//                                   value={slot.start ? dayjs(slot.start) : null}
//                                   onChange={(newVal) => {
//                                     handleSlotChange(
//                                       day.full,
//                                       slot.id,
//                                       "start",
//                                       newVal
//                                     );
//                                     // Mark as touched on change
//                                     //   setFieldTouched(
//                                     //     `weekSchedule[${dayIndex}].slots[${slotIndex}].start`,
//                                     //     true
//                                     //   );
//                                     // }}
//                                     // onClose={() => {
//                                     //   // Mark as touched when picker closes
//                                     //   setFieldTouched(
//                                     //     `weekSchedule[${dayIndex}].slots[${slotIndex}].start`,
//                                     //     true
//                                     //   );
//                                   }}
//                                   slotProps={{
//                                     textField: {
//                                       error: Boolean(startError),
//                                       helperText: startError,
//                                       // onBlur: () => {
//                                       //   setFieldTouched(
//                                       //     `weekSchedule[${dayIndex}].slots[${slotIndex}].start`,
//                                       //     true
//                                       //   );
//                                       // },
//                                       // sx: {
//                                       //   "& .MuiFormHelperText-root": {
//                                       //     marginLeft: "0px",
//                                       //     marginRight: "0px",
//                                       //   },
//                                       //   "& .MuiOutlinedInput-root": {
//                                       //     borderRadius: 2.5,
//                                       //     boxShadow:
//                                       //       "0 2px 8px rgba(25, 118, 210, 0.12)",
//                                       //     "&:hover fieldset": {
//                                       //       borderColor: "#1976d2",
//                                       //     },
//                                       //     "&.Mui-focused fieldset": {
//                                       //       borderColor: "#1976d2",
//                                       //       borderWidth: 2,
//                                       //     },
//                                       //   },
//                                       //   "& .MuiInputLabel-root.Mui-focused": {
//                                       //     color: "#1976d2",
//                                       //   },
//                                       //   ".MuiPickersInputBase-root": {
//                                       //     boxShadow:
//                                       //       "inset 4px 2px 8px rgba(95, 157, 231, .48), inset -4px -2px 8px #fff",
//                                       //     borderRadius: 3,
//                                       //   },
//                                       // },
//                                     },
//                                   }}
//                                 />

//                                 <TimePicker
//                                   disabled={disabled}
//                                   label="End Time"
//                                   value={slot.end ? dayjs(slot.end) : null}
//                                   onChange={(newVal) => {
//                                     handleSlotChange(
//                                       day.full,
//                                       slot.id,
//                                       "end",
//                                       newVal
//                                     );
//                                     // Mark as touched on change
//                                     //   setFieldTouched(
//                                     //     `weekSchedule[${dayIndex}].slots[${slotIndex}].end`,
//                                     //     true
//                                     //   );
//                                     // }}
//                                     // onClose={() => {
//                                     //   // Mark as touched when picker closes
//                                     //   setFieldTouched(
//                                     //     `weekSchedule[${dayIndex}].slots[${slotIndex}].end`,
//                                     //     true
//                                     //   );
//                                   }}
//                                   slotProps={{
//                                     textField: {
//                                       error: Boolean(endError),
//                                       helperText: endError,
//                                       // onBlur: () => {
//                                       //   setFieldTouched(
//                                       //     `weekSchedule[${dayIndex}].slots[${slotIndex}].end`,
//                                       //     true
//                                       //   );
//                                       // },
//                                       // sx: {
//                                       //   "& .MuiFormHelperText-root": {
//                                       //     marginLeft: "0px",
//                                       //     marginRight: "0px",
//                                       //   },
//                                       //   "& .MuiOutlinedInput-root": {
//                                       //     borderRadius: 2.5,
//                                       //     boxShadow:
//                                       //       "0 2px 8px rgba(25, 118, 210, 0.12)",
//                                       //     "&:hover fieldset": {
//                                       //       borderColor: "#1976d2",
//                                       //     },
//                                       //     "&.Mui-focused fieldset": {
//                                       //       borderColor: "#1976d2",
//                                       //       borderWidth: 2,
//                                       //     },
//                                       //   },
//                                       //   "& .MuiInputLabel-root.Mui-focused": {
//                                       //     color: "#1976d2",
//                                       //   },
//                                       //   ".MuiPickersInputBase-root": {
//                                       //     boxShadow:
//                                       //       "inset 4px 2px 8px rgba(95, 157, 231, .48), inset -4px -2px 8px #fff",
//                                       //     borderRadius: 3,
//                                       //   },
//                                       // },
//                                     },
//                                   }}
//                                 /> */}
//                                 <TimePickerPair
//   disabled={disabled}
//   startValue={slot.start ? dayjs(slot.start) : null}
//   endValue={slot.end ? dayjs(slot.end) : null}
//   onStartChange={(newVal) =>
//     handleSlotChange(day.full, slot.id, "start", newVal)
//   }
//   onEndChange={(newVal) =>
//     handleSlotChange(day.full, slot.id, "end", newVal)
//   }
//   startError={startError}
//   endError={endError}
// />

//                               </Box>
//                             </Box>
//                             {slotIndex < daySlots.length - 1 && (
//                               <Divider sx={{ border: "1px solid #e3f2fd" }} />
//                             )}
//                           </React.Fragment>
//                         );
//                       })}
//                     </Box>
//                   )}
//                 </Box>
//               </Paper>
//             );
//           })}
//           <CommonDialogBox
//             open={openDelete}
//             onClose={() => setOpenDelete(false)}
//             onConfirm={() => {
//               handleDeleteSlot(slotToDelete.day, slotToDelete.slotId);
//             }}
//             slotName={slotToDelete?.slotName}
//             title="Delete Slot"
//             message={`Are you sure you want to delete ${slotToDelete?.slotName}?`}
//             confirmText="Delete"
//             confirmColor="primary"
//           />
//           <CommonDialogBox
//             open={openValidationDialog}
//             onClose={() => setOpenValidationDialog(false)}
//             onConfirm={() => setOpenValidationDialog(false)}
//             title="Error"
//             message="Please select Specialities and Service Type before adding a slot."
//             confirmText="Got it"
//             confirmColor="primary"
//             hideCancel={true}
//           />
//         </Box>
//       </Box>
//     </LocalizationProvider>
//   );
// };

// export default WorkingPlanView;import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Chip,
  Tooltip,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch, useSelector } from "react-redux";
import { 
  getDoctorCalendar,
  selectCalendar,
  selectServiceTypesForDropdown // ⭐ Import selector
} from "@/redux/store/slices/calendarSlice";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function WeeklySlotsUI() {
  const [slots, setSlots] = useState(
    days.reduce((acc, day) => ({ ...acc, [day]: [] }), {})
  );

  const dispatch = useDispatch();
  
  // ⭐ Use selectors
  const {calendar} = useSelector(state=>state.calendar);
  const serviceTypes = useSelector(selectServiceTypesForDropdown);

  // console.log(calendar);
  

  // Fetch calendar data
  useEffect(() => {
    dispatch(getDoctorCalendar());
  }, [dispatch]);

  // Map slots from calendar data
  useEffect(() => {
    if (!calendar?.availability || calendar.availability.length === 0) {
      return;
    }

    const mappedSlots = days.reduce((acc, d) => ({ ...acc, [d]: [] }), {});

    calendar.availability.forEach((item) => {
      const dayName = item.day;
      
      if (item.services && item.services.length > 0) {
        mappedSlots[dayName] = item.services.map((srv) => ({
          serviceType: srv.name || "",
          startTime: srv.startTime ? dayjs(srv.startTime, "HH:mm") : null,
          endTime: srv.endTime ? dayjs(srv.endTime, "HH:mm") : null,
        }));
      }
    });

    setSlots(mappedSlots);
  }, [calendar]);

  const handleAddSlot = (day) => {
    setSlots((prev) => ({
      ...prev,
      [day]: [...prev[day], { serviceType: "", startTime: null, endTime: null }],
    }));
  };

  const handleChange = (day, index, field, value) => {
    const updated = [...slots[day]];
    updated[index][field] = value;
    setSlots((prev) => ({ ...prev, [day]: updated }));
  };

  const removeSlot = (day, index) => {
    const updated = [...slots[day]];
    updated.splice(index, 1);
    setSlots((prev) => ({ ...prev, [day]: updated }));
  };

  if (!calendar) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading calendar data...</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{}}>
        {days.map((day) => (
          <Box
            key={day}
            sx={{ mb: 1, border:"1px solid #e3f2fd", borderRadius: 2 }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f5f9ff",
                padding: "4px 8px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 700, color: "#1565c0" }}>
                  {day}
                </Typography>

                {slots[day].length > 0 && (
                  <Chip
                    label={`${slots[day].length} slot${slots[day].length > 1 ? "s" : ""}`}
                    size="small"
                    sx={{
                      bgcolor: "#e3f2fd",
                      color: "#1565c0",
                      fontWeight: 600,
                      height: 22,
                    }}
                  />
                )}
              </Box>

              <Tooltip title="Add New Slot" arrow placement="left">
                <IconButton
                  size="small"
                  onClick={() => handleAddSlot(day)}
                  sx={{
                    bgcolor: "#1172BA",
                    color: "white",
                    width: 33,
                    height: 33,
                    "&:hover": { bgcolor: "#1172BA", transform: "rotate(90deg)" },
                    transition: "all 0.3s",
                  }}
                >
                  <AddCircleOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {slots[day].length === 0 && (
              <Box sx={{display:'flex',alignItems:'center',textAlign:'center',justifyContent:'center'}}>
                <Typography sx={{ fontSize: "14px", color: "gray", mt: 1 }}>
                  No slots added yet. Click + to add a slot.
                </Typography>
              </Box>
            )}

            {slots[day].map((slot, index) => (
              <Box key={index} sx={{ mt: 1, p: 1, m:0.5, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    select
                    label="Service Type"
                    value={slot.serviceType}
                    onChange={(e) =>
                      handleChange(day, index, "serviceType", e.target.value)
                    }
                    sx={{ flex: 1, mr: 1 }}
                  >
                    {serviceTypes.length === 0 ? (
                      <MenuItem disabled>No services selected</MenuItem>
                    ) : (
                      serviceTypes.map((s) => (
                        <MenuItem key={s.id} value={s.value}>
                          {s.label} ({s.duration} min)
                        </MenuItem>
                      ))
                    )}
                  </TextField>

                  <IconButton
                    onClick={() => removeSlot(day, index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Box sx={{ display: "flex", mt: 2, gap: 1 }}>
                  <TimePicker
                    label="Start Time"
                    value={slot.startTime}
                    onChange={(newValue) =>
                      handleChange(day, index, "startTime", newValue)
                    }
                    slotProps={{ textField: { sx: { flex: 1 } } }}
                  />
                  <TimePicker
                    label="End Time"
                    value={slot.endTime}
                    onChange={(newValue) =>
                      handleChange(day, index, "endTime", newValue)
                    }
                    slotProps={{ textField: { sx: { flex: 1 } } }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </LocalizationProvider>
  );
}