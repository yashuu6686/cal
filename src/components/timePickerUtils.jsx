import React from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

/**
 * Common TimePicker component with consistent styling and error handling
 */
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

/**
 * Reusable time picker pair (Start & End)
 */
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
      />
      <CommonTimePicker
        label="End Time"
        value={endValue}
        onChange={onEndChange}
        error={endError}
        disabled={disabled}
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