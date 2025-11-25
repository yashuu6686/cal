"use client";
import SectionHeader from "@/components/SectionHeader";
import { TimePickerPair } from "@/components/timePickerUtils";
import {
  Box,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
  Autocomplete,
  Chip,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function Break({setBreakData,breakData}) {

  const { selectedDays, breakStartTime, breakEndTime } = breakData;
 

  const allSelected = selectedDays.length === days.length;

  // console.log(breakData);
  


    const handleSelectDays = (event, newValue) => {
    if (newValue.includes("Select All")) {
      setBreakData((prev) => ({
        ...prev,
        selectedDays: days,
      }));
    } else {
      setBreakData((prev) => ({
        ...prev,
        selectedDays: newValue,
      }));
    }
  };

  return (
    <Box>
      <SectionHeader title="Break" />

      <Box sx={{ mt: 2 }}>
        <Autocomplete
          sx={{
            mb: 2,
            cursor: "pointer",
            ".MuiAutocomplete-inputRoot": {
              paddingRight: "15px !important",
            },
          }}
          multiple
           value={selectedDays}
          onChange={handleSelectDays}
          disableCloseOnSelect
          options={["Select All", ...days]}
          getOptionLabel={(option) => option}
          renderOption={(props, option, { selected }) => {
            const isSelectAll = option === "Select All";

            return (
              <li {...props} key={option}>
                <Checkbox
                  checked={isSelectAll ? allSelected : selected}
                  indeterminate={
                    isSelectAll &&
                    selectedDays.length > 0 &&
                    selectedDays.length < days.length
                  }
                  sx={{
                    color: "#1976d2",
                    "&.Mui-checked": {
                      color: "#1976d2",
                    },
                    "&.MuiCheckbox-indeterminate": {
                      color: "#1976d2",
                    },
                  }}
                />
                {option}
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Days"
              fullWidth
              // placeholder={
              //   values.breakSelectedDays?.length === 0 ? "Select days" : ""
              // }
              sx={{
                cursor: "pointer",
                "& .MuiOutlinedInput-root": {
                  // borderRadius: 2.5,
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1976d2",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#1976d2",
                },
                "& .MuiAutocomplete-input": {
                  minWidth: "0 !important",
                  width: "0 !important",
                },
              }}
              inputProps={{
                ...params.inputProps,
                readOnly: true,
              }}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                key={option}
                sx={{
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  padding: "2px 0px",
                  "& .MuiChip-deleteIcon": {
                    color: "white",
                    "&:hover": {
                      color: "white",
                    },
                  },
                }}
              />
            ))
          }
        />

        {/* Time Pickers */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 1 }}
          >
            {/* <TimePicker
              label="Start Time"
              value={values.startTime}
              onChange={(val) => setFieldValue("startTime", val)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: touched.startTime && Boolean(errors.startTime),
                  helperText: touched.startTime && errors.startTime,
                  sx: {
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2.5,
                      boxShadow: "0 2px 8px rgba(25, 118, 210, 0.12)",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1976d2",
                    },
                    ".MuiPickersInputBase-root": {
                      boxShadow:
                        "inset 4px 2px 8px rgba(95, 157, 231, .48), inset -4px -2px 8px #fff",
                      borderRadius: 3,
                    },
                  },
                },
              }}
            />
            <TimePicker
              label="End Time"
              value={values.endTime}
              onChange={(val) => setFieldValue("endTime", val)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: touched.endTime && Boolean(errors.endTime),
                  helperText: touched.endTime && errors.endTime,
                  sx: {
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2.5,
                      boxShadow: "0 2px 8px rgba(25, 118, 210, 0.12)",
                      "&:hover fieldset": {
                        borderColor: "#1976d2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1976d2",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1976d2",
                    },
                    ".MuiPickersInputBase-root": {
                      boxShadow:
                        "inset 4px 2px 8px rgba(95, 157, 231, .48), inset -4px -2px 8px #fff",
                      borderRadius: 3,
                    },
                  },
                },
              }}
            /> */}
             <TimePickerPair
              startValue={breakStartTime}
              endValue={breakEndTime}
              onStartChange={(val) =>
                setBreakData((prev) => ({ ...prev, breakStartTime: val }))
              }
              onEndChange={(val) =>
                setBreakData((prev) => ({ ...prev, breakEndTime: val }))
              }
            />
          </Box>
        </LocalizationProvider>
      </Box>
    </Box>
  );
}

export default Break;
