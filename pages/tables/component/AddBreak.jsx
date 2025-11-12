// import React, { useState, useMemo } from "react";
// import {
//   Box,
//   Checkbox,
//   Chip,
//   Divider,
//   FormControl,
//   FormHelperText,
//   InputLabel,
//   ListItemText,
//   MenuItem,
//   Select,
// } from "@mui/material";
// import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";
// import CancelIcon from "@mui/icons-material/Cancel";
// import CommonDialog from "@/components/CommonDialog";
// import { weekDays, timePickers } from "./index";

// function AddBreak({
//   breakModalOpen,
//   setBreakModalOpen,
//   handleAddBreak,
//   newBreak,
//   setNewBreak,
//   errors,
//   setErrors,
// }) {
//   const [openDays, setOpenDays] = useState(false);

//   const handleChange = (field, value) => {
//     setNewBreak((prev) => ({ ...prev, [field]: value }));
//     setErrors((prev) => ({ ...prev, [field]: "" }));
//   };

//   const toggleDay = (idx) => {
//     handleChange(
//       "day",
//       newBreak.day.includes(idx)
//         ? newBreak.day.filter((d) => d !== idx)
//         : [...newBreak.day, idx]
//     );
//   };

//   const toggleSelectAll = () => {
//     handleChange(
//       "day",
//       newBreak.day.length === weekDays.length ? [] : weekDays.map((_, i) => i)
//     );
//   };

//   // Memoized time values
//   const timeValues = {};
//   timePickers.forEach((picker) => {
//     timeValues[picker.field] = useMemo(
//       () =>
//         newBreak[picker.field]
//           ? dayjs(`1970-01-01T${newBreak[picker.field]}`)
//           : null,
//       [newBreak[picker.field]]
//     );
//   });

//   return (
//     <CommonDialog
//       open={breakModalOpen}
//       onClose={() => {
//         setBreakModalOpen(false);
//         setNewBreak({ day: [], startTime: "", endTime: "" });
//         setErrors({});
//       }}
//       title="Add Break"
//       saveLabel="Save"
//       cancelLabel="Cancel"
//       onSave={handleAddBreak}
//     >
//       {/* Days Dropdown */}
//       <FormControl fullWidth sx={{ mt: 1.5 }}>
//         <InputLabel>Days</InputLabel>
//         <Select
//           multiple
//           value={newBreak.day}
//           open={openDays}
//           onClick={(e) => {
//             e.stopPropagation();
//             setOpenDays((prev) => !prev);
//           }}
//           onClose={() => setOpenDays(true)}
//           renderValue={(selected) => (
//             <Box sx={{ display: "flex", gap: 0.3, flexWrap: "wrap" }}>
//               {selected.map((i) => (
//                 <Chip
//                   key={i}
//                   label={weekDays[i]}
//                   onDelete={() => toggleDay(i)}
//                   deleteIcon={<CancelIcon />}
//                   sx={{
//                     backgroundColor: "#1976d2",
//                     color: "white",
//                     ".MuiChip-deleteIcon": { color: "white" },
//                   }}
//                 />
//               ))}
//             </Box>
//           )}
//           displayEmpty
//           error={Boolean(errors.day)}
//         >
//           <MenuItem onClick={toggleSelectAll}>
//             <Checkbox checked={newBreak.day.length === weekDays.length} />
//             <ListItemText primary="Select All" />
//           </MenuItem>
//           <Divider />
//           {weekDays.map((day, idx) => (
//             <MenuItem
//               key={idx}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 toggleDay(idx);
//               }}
//             >
//               <Checkbox checked={newBreak.day.includes(idx)} />
//               <ListItemText primary={day} />
//             </MenuItem>
//           ))}
//         </Select>
//         {errors.day && <FormHelperText error>{errors.day}</FormHelperText>}
//       </FormControl>

//       {/* Time Pickers */}
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
//           {timePickers.map((picker, idx) => (
//             <Box key={idx}>
//               <TimePicker
              
//                 label={picker.label}
//                 value={timeValues[picker.field]}
//                 onChange={(newValue) => {
//                   const timeString = newValue
//                     ? dayjs(newValue).format("HH:mm")
//                     : "";
//                   handleChange(picker.field, timeString);
//                 }}
//                 slotProps={{
//                   textField: {
//                     error: Boolean(errors[picker.field]),
//                     helperText: "",
//                   },
//                 }}
//                 sx={{
//                   ".MuiPickersInputBase-root": {
//                     boxShadow:
//                       "inset 4px 2px 8px rgba(95, 157, 231, .48), inset -4px -2px 8px #fff",
//                     borderRadius: 5,
//                     width: "277px",
//                     height: "53px",
                   
//                   },
//                 }}
//               />
//               {errors[picker.field] && (
//                 <FormHelperText error sx={{ ml: "8px" }}>
//                   {errors[picker.field]}
//                 </FormHelperText>
//               )}
//             </Box>
//           ))}
//         </Box>
//       </LocalizationProvider>
//     </CommonDialog>
//   );
// }

// export default AddBreak;
