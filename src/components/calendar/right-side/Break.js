"use client";
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

function Break({ errors = {}, touched = {}, values, setFieldValue }) {
  const allSelected = values.breakSelectedDays?.length === days.length;

  return (
    <Box>
      <Box
        sx={{
          background: "rgb(198, 228, 251)",
          p: 1,
          borderRadius: 3,
          border: "1px solid #90caf9",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "#1565c0", fontWeight: 600 }}>
          Break
        </Typography>
      </Box>

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
          disableCloseOnSelect
          options={["Select All", ...days]}
          value={values.breakSelectedDays || []}
          onChange={(event, newValue) => {
            if (newValue.includes("Select All")) {
              if (values.breakSelectedDays?.length === days.length) {
                setFieldValue("breakSelectedDays", []);
              } else {
                setFieldValue("breakSelectedDays", days);
              }
            } else {
              setFieldValue("breakSelectedDays", newValue);
            }
          }}
          getOptionLabel={(option) => option}
          renderOption={(props, option, { selected }) => {
            const isSelectAll = option === "Select All";

            return (
              <li {...props} key={option}>
                <Checkbox
                  checked={isSelectAll ? allSelected : selected}
                  indeterminate={
                    isSelectAll &&
                    values.breakSelectedDays?.length > 0 &&
                    values.breakSelectedDays?.length < days.length
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
              placeholder={
                values.breakSelectedDays?.length === 0 ? "Select days" : ""
              }
              error={
                touched.breakSelectedDays && Boolean(errors.breakSelectedDays)
              }
              helperText={touched.breakSelectedDays && errors.breakSelectedDays}
              // sx={{
              //   cursor: "pointer",
              //   "& .MuiOutlinedInput-root": {
              //     borderRadius: 2.5,
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
              //   "& .MuiAutocomplete-input": {
              //     minWidth: "0 !important",
              //     width: "0 !important",
              //   },
              // }}
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
            <TimePicker
              label="Start Time"
              value={values.startTime}
              onChange={(val) => setFieldValue("startTime", val)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: touched.startTime && Boolean(errors.startTime),
                  helperText: touched.startTime && errors.startTime,
                  // sx: {
                  //   flex: 1,
                  //   "& .MuiOutlinedInput-root": {
                  //     borderRadius: 2.5,
                  //     boxShadow: "0 2px 8px rgba(25, 118, 210, 0.12)",
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
              label="End Time"
              value={values.endTime}
              onChange={(val) => setFieldValue("endTime", val)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: touched.endTime && Boolean(errors.endTime),
                  helperText: touched.endTime && errors.endTime,
                  // sx: {
                  //   flex: 1,
                  //   "& .MuiOutlinedInput-root": {
                  //     borderRadius: 2.5,
                  //     boxShadow: "0 2px 8px rgba(25, 118, 210, 0.12)",
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
        </LocalizationProvider>
      </Box>
    </Box>
  );
}

export default Break;
