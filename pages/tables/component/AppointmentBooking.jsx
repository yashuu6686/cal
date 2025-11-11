import {
  Box,
  Checkbox,
  Chip,
  Divider,
  ListItemText,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  InputAdornment,
} from "@mui/material";
import React, { useState, useMemo } from "react";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CommonDialog from "@/components/CommonDialog";
import { validateSlotAndSave, validationSchema } from "./validation";
function AppointmentBooking({
  modalOpen,
  setModalOpen,
  newSlot,
  serviceOptions,
  selectedServices,
  weekDays,
  handleSave,
  schedule = [],
}) {
  const defaultSlot = { startTime: "", endTime: "", service: "", days: [] };
  const [values, setValues] = useState({ ...defaultSlot, ...newSlot });
  const [errors, setErrors] = useState({});
  const [openDays, setOpenDays] = useState(false);

  // Handle save
  const handleSubmit = async () => {
    validateSlotAndSave({
      values,
      validationSchema,
      selectedServices,
      schedule,
      setErrors,
      onSave: (slot) => handleSave("workingPlan", slot),
      setModalOpen,
    });
  };

  // Controlled inputs
  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleDay = (idx) => {
    if (values.days.includes(idx)) {
      handleChange(
        "days",
        values.days.filter((d) => d !== idx)
      );
    } else {
      handleChange("days", [...values.days, idx]);
    }
  };

  const toggleSelectAll = () => {
    if (values.days.length === weekDays.length) {
      handleChange("days", []);
    } else {
      handleChange(
        "days",
        weekDays.map((_, i) => i)
      );
    }
  };

  const startTimeValue = useMemo(
    () => (values.startTime ? dayjs(`1970-01-01T${values.startTime}`) : null),
    [values.startTime]
  );
  const endTimeValue = useMemo(
    () => (values.endTime ? dayjs(`1970-01-01T${values.endTime}`) : null),
    [values.endTime]
  );

  return (
    <CommonDialog
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      title="Add Working Plan"
      saveLabel="Add"
      onSave={handleSubmit}
      cancelLabel="Cancel"
    >
      <Box sx={{ m: 0 }}>
        {/* Service Type */}
        <TextField
          select
          label="Service Type"
          fullWidth
          name="service"
          value={values.service}
          onChange={(e) => handleChange("service", e.target.value)}
          error={Boolean(errors.service)}
          helperText={errors.service}
          sx={{ mt: 1, mb: 1 }}
          SelectProps={{
            renderValue: (selected) => {
              const sObj = selectedServices.find((s) => s.type === selected);
              return sObj ? `${selected} (${sObj.time})` : selected;
            },
          }}
        >
          {serviceOptions.map((option, idx) => {
            const sObj = selectedServices.find((s) => s.type === option);
            const duration = sObj ? ` (${sObj.time})` : "";
            return (
              <MenuItem key={idx} value={option}>
                {option + duration}
              </MenuItem>
            );
          })}
        </TextField>

        {/* Time Pickers */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box>
            <TimePicker
              label="Start Time"
              value={startTimeValue}
              onChange={(newValue) =>
                handleChange(
                  "startTime",
                  newValue ? dayjs(newValue).format("HH:mm") : ""
                )
              }
              slotProps={{
                textField: {
                  error: Boolean(errors.startTime),
                  helperText: errors.startTime,
                },
              }}
              sx={{
                mt: 0.5,
                mr: 0.8,
                ".MuiPickersInputBase-root": {
                  width: "277px",
                  height: "53px",
                  borderRadius: 5,
                  boxShadow:
                    "inset 4px 2px 8px rgba(95,157,231,.48), inset -4px -2px 8px #fff",
                },
              }}
            />
            <TimePicker
              label="End Time"
              value={endTimeValue}
              onChange={(newValue) =>
                handleChange(
                  "endTime",
                  newValue ? dayjs(newValue).format("HH:mm") : ""
                )
              }
              slotProps={{
                textField: {
                  error: Boolean(errors.endTime),
                  helperText: errors.endTime,
                },
              }}
              sx={{
                mt: 0.5,
                ".MuiPickersInputBase-root": {
                  width: "280px",
                  height: "53px",
                  borderRadius: 5,
                  boxShadow:
                    "inset 4px 2px 8px rgba(95,157,231,.48), inset -4px -2px 8px #fff",
                },
              }}
            />
          </Box>
        </LocalizationProvider>

        {/* Days Dropdown */}
        <FormControl fullWidth sx={{ mt: 1.5 }}>
          <InputLabel>Days</InputLabel>
          <Select
            multiple
            value={values.days}
            open={openDays}
            onClick={(e) => {
              e.stopPropagation();
              setOpenDays((prev) => !prev);
            }}
            onClose={() => setOpenDays(true)}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", gap: 0.3, flexWrap: "wrap" }}>
                {selected.map((i) => (
                  <Chip
                    key={i}
                    label={weekDays[i]}
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "white",
                      ".MuiChip-deleteIcon": {
                        color: "white",
                        ":hover": {
                          backgroundColor: "#1976d2",
                          color: "white",
                        },
                      },
                    }}
                    onDelete={() => toggleDay(i)}
                  />
                ))}
              </Box>
            )}
            displayEmpty
            error={Boolean(errors.days)}
          >
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                toggleSelectAll();
              }}
            >
              <Checkbox checked={values.days.length === weekDays.length} />
              <ListItemText primary="Select All" />
            </MenuItem>
            <Divider />
            {weekDays.map((day, idx) => (
              <MenuItem
                key={idx}
                onClick={(e) => {
                  e.stopPropagation(); // ✅ stops auto-close
                  toggleDay(idx);
                }}
              >
                <Checkbox checked={values.days.includes(idx)} />
                <ListItemText primary={day} />
              </MenuItem>
            ))}
          </Select>
          {errors.days && (
            <Box sx={{ color: "red", mt: 0.5 }}>{errors.days}</Box>
          )}
        </FormControl>
      </Box>
    </CommonDialog>
  );
}

export default AppointmentBooking;
