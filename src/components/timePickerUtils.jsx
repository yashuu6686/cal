import React from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export const CommonTimePicker = ({
  label,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  fullWidth = true,
  size = "small",
}) => {
  return (
    <TimePicker
      disabled={disabled}
      label={label}
      value={value}
      sx={{
        borderRadius: "15px",
        background: "transparint",
        transition: "0.25s",
        
        ".MuiPickersOutlinedInput-root": {
          boxShadow:
            "inset 4px 2px 8px rgba(95, 157, 231, .48), inset -4px -100px 8px #fff",
          borderRadius: "15px",
        },
        
      }}
      onChange={onChange}
      slotProps={{
        textField: {
          fullWidth,
          size,
          error: Boolean(error),
          helperText: error || helperText,
        },
      }}
    />
  );
};

export const TimePickerPair = ({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  startError,
  endError,
  disabled = false,
}) => {
  return (
    <>
      <CommonTimePicker
        label="Start Time"
        value={startValue}
        onChange={onStartChange}
        error={startError}
        disabled={disabled}
        // size="small"
      />
      <CommonTimePicker
        label="End Time"
        value={endValue}
        onChange={onEndChange}
        error={endError}
        disabled={disabled}
        // size="small"
      />
    </>
  );
};

// Usage in Break.jsx or Holiday.jsx:
// <Box sx={{ display: "flex", gap: 2 }}>
//   <TimePickerPair
//     startValue={values.startTime}
//     endValue={values.endTime}
//     onStartChange={(val) => setFieldValue("startTime", val)}
//     onEndChange={(val) => setFieldValue("endTime", val)}
//     startError={touched.startTime && errors.startTime}
//     endError={touched.endTime && errors.endTime}
//   />
// </Box>
