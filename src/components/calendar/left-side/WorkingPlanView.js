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
  selectServiceTypesForDropdown, //  Import selector
} from "@/redux/store/slices/calendarSlice";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { TimePickerPair } from "@/components/timePickerUtils";

export default function WorkingPlanView({ slots, setSlots, days ,wpErrors }) {


   const getError = (dayIndex, slotIndex, field) => {
    const key = `weekSchedule[${dayIndex}].slots[${slotIndex}].${field}`;
    return wpErrors?.[key] || "";
  };
 

  const { calendar } = useSelector((state) => state.calendar);
  const serviceTypes = useSelector(selectServiceTypesForDropdown);

  useEffect(() => {
    if (!calendar?.availability || calendar.availability.length === 0) {
      return;
    }

    const mappedSlots = days.reduce((acc, d) => ({ ...acc, [d]: [] }), {});

    calendar.availability.forEach((item) => {
      const dayName = item.day;

      if (item.services && item.services.length > 0) {
        mappedSlots[dayName] = item.services.map((srv) => ({
          serviceType: {
            name: srv.name,
            keyIdentifier: srv.keyIdentifier,
            duration: srv.duration,
          },
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
      [day]: [
        ...prev[day],
        { serviceType: "", startTime: null, endTime: null },
      ],
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{}}>
        {days.map((day,dayIndex) => (
          <Box
            key={day}
            sx={{ mb: 1, border: "1px solid #e3f2fd", borderRadius: 2 }}
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
                    label={`${slots[day].length} slot${
                      slots[day].length > 1 ? "s" : ""
                    }`}
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
                    "&:hover": {
                      bgcolor: "#1172BA",
                      transform: "rotate(90deg)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  <AddCircleOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {slots[day].length === 0 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ fontSize: "14px", color: "gray", mt: 1 }}>
                  No slots added yet. Click + to add a slot.
                </Typography>
              </Box>
            )}

            {slots[day].map((slot, index) => (
              <Box key={index} sx={{ mt: 1, p: 1, m: 0.5, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    select
                    label="Service Type"
                    value={slot.serviceType?.name || ""}
                    onChange={(e) => {
                      const selected = serviceTypes.find(
                        (s) => s.value === e.target.value
                      );
                      //  console.log("this is selected",selected);

                      handleChange(day, index, "serviceType", {
                        name: selected.label,
                        keyIdentifier: selected.keyIdentifier,
                        duration: selected.duration,
                      });
                    }}
                    sx={{ flex: 1, mr: 1 }}
                    error={Boolean(getError(dayIndex, index, "serviceType"))}
                  helperText={getError(dayIndex, index, "serviceType")}
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
                  <TimePickerPair
        startValue={slot.startTime}
        endValue={slot.endTime}
        onStartChange={(val) => handleChange(day, index, "startTime", val)}
        onEndChange={(val) => handleChange(day, index, "endTime", val)}
        startError={getError(dayIndex, index, "start")}
        endError={getError(dayIndex, index, "end")}
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
