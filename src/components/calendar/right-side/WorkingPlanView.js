"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormikContext, getIn } from "formik";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Chip,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CommonErrorDialogBox from "@/components/CommonDialogBox";

const days = [
  { short: "Sun", full: "Sunday" },
  { short: "Mon", full: "Monday" },
  { short: "Tue", full: "Tuesday" },
  { short: "Wed", full: "Wednesday" },
  { short: "Thu", full: "Thursday" },
  { short: "Fri", full: "Friday" },
  { short: "Sat", full: "Saturday" },
];

const WorkingPlanView = ({ disabled = false }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const [slotToDelete, setSlotToDelete] = React.useState(null);

  const dispatch = useDispatch();
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext();

  // Redux selectors
  const weekSchedule = useSelector((state) => state.calendar.weekSchedule);
  const selectedServices = useSelector(
    (state) => state.calendar.selectedServices
  );

  // Handlers
  const handleAddSlot = (day) => {
    const newSlot = {
      id: Date.now(),
      start: null,
      end: null,
      serviceType: "",
    };

    dispatch({
      type: "calendar/addSlotToDay",
      payload: { day, slot: newSlot },
    });
  };

  const handleDeleteSlot = (day, slotId) => {
    dispatch({
      type: "calendar/removeSlotFromDay",
      payload: { day, slotId },
    });
    dispatch({
      type: "calendar/updateEvents",
    });
    setOpenDelete(false);
    setSlotToDelete(null);
  };

  const handleSlotChange = (day, slotId, field, value) => {
    dispatch({
      type: "calendar/updateSlotInDay",
      payload: { day, slotId, field, value },

    });
    
  };

  const getDaySlots = (dayName) => {
    const dayData = weekSchedule.find((d) => d.day === dayName);
    return dayData ? dayData.slots : [];
  };

  // ✅ FIXED: Get error for specific slot field
  const getSlotError = (dayIndex, slotIndex, field) => {
    const errorPath = `weekSchedule[${dayIndex}].slots[${slotIndex}].${field}`;
    const touchPath = `weekSchedule[${dayIndex}].slots[${slotIndex}].${field}`;

    const error = errors[errorPath];
    const isTouched = touched[touchPath];

    // Return error if it exists (touched state is handled by validation trigger)
    return error || "";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* Header */}
        <Box
          sx={{
            background: "rgb(198, 228, 251)",
            p: 1,
            borderRadius: 3,
            border: "1px solid #90caf9",
            mb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#1565c0",
              fontWeight: 400,
            }}
          >
            Working Plan
          </Typography>
        </Box>

        {/* Days Container */}
        <Box>
          {days.map((day, dayIndex) => {
            const daySlots = getDaySlots(day.full);

            return (
              <Paper
                key={day.short}
                elevation={0}
                sx={{
                  mb: 1.5,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #e3f2fd",
                }}
              >
                {/* Day Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "#f5f9ff",
                    px: 2,
                    py: 1,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "#1565c0",
                      }}
                    >
                      {day.full}
                    </Typography>

                    {daySlots.length > 0 && (
                      <Chip
                        label={`${daySlots.length} slot${
                          daySlots.length > 1 ? "s" : ""
                        }`}
                        size="small"
                        sx={{
                          bgcolor: "#e3f2fd",
                          color: "#1565c0",
                          fontWeight: 500,
                          height: 24,
                        }}
                      />
                    )}
                  </Stack>

                  <Tooltip title="Add New Slot" arrow placement="left">
                    <IconButton
                      size="small"
                      disabled={disabled}
                      onClick={() => handleAddSlot(day.full)}
                      sx={{
                        bgcolor: "#1172BA",
                        color: "white",
                        width: 36,
                        height: 36,
                        "&:hover": {
                          bgcolor: "#1172BA",
                          transform: "rotate(90deg)",
                        },
                        "&:disabled": {
                          bgcolor: "#90caf9",
                          color: "white",
                        },
                        transition: "all 0.3s",
                      }}
                    >
                      <AddCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Slots Content */}
                <Box sx={{ p: 2 }}>
                  {daySlots.length === 0 ? (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#90a4ae",
                        textAlign: "center",
                        fontStyle: "italic",
                      }}
                    >
                      No slots added yet. Click + to add a slot.
                    </Typography>
                  ) : (
                    <Box>
                      {daySlots.map((slot, slotIndex) => {
                        const serviceTypeError = getSlotError(
                          dayIndex,
                          slotIndex,
                          "serviceType"
                        );
                        const startError = getSlotError(
                          dayIndex,
                          slotIndex,
                          "start"
                        );
                        const endError = getSlotError(
                          dayIndex,
                          slotIndex,
                          "end"
                        );

                        return (
                          <React.Fragment key={slot.id}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                p: 1,
                                borderRadius: "8px",
                              }}
                            >
                              {/* Row 1: Service Type + Delete Button */}
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 1,
                                }}
                              >
                                <TextField
                                  select
                                  disabled={disabled}
                                  label="Service Type"
                                  sx={{ flexGrow: 1 }}
                                  value={slot.serviceType || ""}
                                  error={Boolean(serviceTypeError)}
                                  helperText={serviceTypeError}
                                  onChange={(e) => {
                                    handleSlotChange(
                                      day.full,
                                      slot.id,
                                      "serviceType",
                                      e.target.value
                                    );
                                    // Mark field as touched
                                    //   setFieldTouched(
                                    //     `weekSchedule[${dayIndex}].slots[${slotIndex}].serviceType`,
                                    //     true
                                    //   );
                                    // }}
                                    // onBlur={() => {
                                    //   setFieldTouched(
                                    //     `weekSchedule[${dayIndex}].slots[${slotIndex}].serviceType`,
                                    //     true
                                    //   );
                                  }}
                                >
                                  {selectedServices.map((s) => (
                                    <MenuItem key={s.type} value={s.type}>
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                        }}
                                      >
                                        {" "}
                                        <span>{s.type}</span>
                                        <Chip
                                          color="primary"
                                          label={`${s.time} minutes`}
                                          size="small"
                                          sx={{
                                            height: 20,
                                            fontSize: "0.7rem",
                                            // bgcolor: "#e3f2fd",
                                            // color: "#1565c0",
                                          }}
                                        />
                                      </Stack>
                                    </MenuItem>
                                  ))}
                                </TextField>

                                <Tooltip title="Delete Slot" arrow>
                                  <IconButton
                                    disabled={disabled}
                                    onClick={() => {
                                      setSlotToDelete({
                                        day: day.full,
                                        slotId: slot.id,
                                        slotName:
                                          slot.serviceType || "this slot",
                                      });
                                      setOpenDelete(true);
                                    }}
                                    sx={{
                                      color: "#d32f2f",
                                      bgcolor: "#ffebee",
                                      "&:hover": {
                                        bgcolor: "#ffcdd2",
                                        transform: "scale(1.1)",
                                      },
                                      "&:disabled": {
                                        bgcolor: "#fce4ec",
                                        color: "#e57373",
                                      },
                                      transition: "all 0.2s",
                                    }}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>

                              {/* Row 2: Start Time + End Time */}
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  gap: 2,
                                }}
                              >
                                <TimePicker
                                  disabled={disabled}
                                  label="Start Time"
                                  value={slot.start ? dayjs(slot.start) : null}
                                  onChange={(newVal) => {
                                    handleSlotChange(
                                      day.full,
                                      slot.id,
                                      "start",
                                      newVal
                                    );
                                    // Mark as touched on change
                                    //   setFieldTouched(
                                    //     `weekSchedule[${dayIndex}].slots[${slotIndex}].start`,
                                    //     true
                                    //   );
                                    // }}
                                    // onClose={() => {
                                    //   // Mark as touched when picker closes
                                    //   setFieldTouched(
                                    //     `weekSchedule[${dayIndex}].slots[${slotIndex}].start`,
                                    //     true
                                    //   );
                                  }}
                                  slotProps={{
                                    textField: {
                                      error: Boolean(startError),
                                      helperText: startError,
                                      // onBlur: () => {
                                      //   setFieldTouched(
                                      //     `weekSchedule[${dayIndex}].slots[${slotIndex}].start`,
                                      //     true
                                      //   );
                                      // },
                                      // sx: {
                                      //   "& .MuiFormHelperText-root": {
                                      //     marginLeft: "0px",
                                      //     marginRight: "0px",
                                      //   },
                                      //   "& .MuiOutlinedInput-root": {
                                      //     borderRadius: 2.5,
                                      //     boxShadow:
                                      //       "0 2px 8px rgba(25, 118, 210, 0.12)",
                                      //     "&:hover fieldset": {
                                      //       borderColor: "#1976d2",
                                      //     },
                                      //     "&.Mui-focused fieldset": {
                                      //       borderColor: "#1976d2",
                                      //       borderWidth: 2,
                                      //     },
                                      //   },
                                      //   "& .MuiInputLabel-root.Mui-focused": {
                                      //     color: "#1976d2",
                                      //   },
                                      //   ".MuiPickersInputBase-root": {
                                      //     boxShadow:
                                      //       "inset 4px 2px 8px rgba(95, 157, 231, .48), inset -4px -2px 8px #fff",
                                      //     borderRadius: 3,
                                      //   },
                                      // },
                                    },
                                  }}
                                />

                                <TimePicker
                                  disabled={disabled}
                                  label="End Time"
                                  value={slot.end ? dayjs(slot.end) : null}
                                  onChange={(newVal) => {
                                    handleSlotChange(
                                      day.full,
                                      slot.id,
                                      "end",
                                      newVal
                                    );
                                    // Mark as touched on change
                                    //   setFieldTouched(
                                    //     `weekSchedule[${dayIndex}].slots[${slotIndex}].end`,
                                    //     true
                                    //   );
                                    // }}
                                    // onClose={() => {
                                    //   // Mark as touched when picker closes
                                    //   setFieldTouched(
                                    //     `weekSchedule[${dayIndex}].slots[${slotIndex}].end`,
                                    //     true
                                    //   );
                                  }}
                                  slotProps={{
                                    textField: {
                                      error: Boolean(endError),
                                      helperText: endError,
                                      // onBlur: () => {
                                      //   setFieldTouched(
                                      //     `weekSchedule[${dayIndex}].slots[${slotIndex}].end`,
                                      //     true
                                      //   );
                                      // },
                                      // sx: {
                                      //   "& .MuiFormHelperText-root": {
                                      //     marginLeft: "0px",
                                      //     marginRight: "0px",
                                      //   },
                                      //   "& .MuiOutlinedInput-root": {
                                      //     borderRadius: 2.5,
                                      //     boxShadow:
                                      //       "0 2px 8px rgba(25, 118, 210, 0.12)",
                                      //     "&:hover fieldset": {
                                      //       borderColor: "#1976d2",
                                      //     },
                                      //     "&.Mui-focused fieldset": {
                                      //       borderColor: "#1976d2",
                                      //       borderWidth: 2,
                                      //     },
                                      //   },
                                      //   "& .MuiInputLabel-root.Mui-focused": {
                                      //     color: "#1976d2",
                                      //   },
                                      //   ".MuiPickersInputBase-root": {
                                      //     boxShadow:
                                      //       "inset 4px 2px 8px rgba(95, 157, 231, .48), inset -4px -2px 8px #fff",
                                      //     borderRadius: 3,
                                      //   },
                                      // },
                                    },
                                  }}
                                />
                              </Box>
                            </Box>
                            {slotIndex < daySlots.length - 1 && (
                              <Divider sx={{ border: "1px solid #e3f2fd" }} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              </Paper>
            );
          })}
          <CommonErrorDialogBox
            open={openDelete}
            onClose={() => setOpenDelete(false)}
            onConfirm={() => {
              handleDeleteSlot(slotToDelete.day, slotToDelete.slotId);
            }}
            slotName={slotToDelete?.slotName}
            title="Delete Slot"
            message={`Are you sure you want to delete ${slotToDelete?.slotName}?`}
            confirmText="Delete"
            confirmColor="error"
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default WorkingPlanView;
