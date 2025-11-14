import SectionHeader from "@/components/SectionHeader";
import { TimePickerPair } from "@/components/timePickerUtils";
import { Box, Typography } from "@mui/material";
import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function Holiday({ errors = {}, touched = {}, values, setFieldValue }) {
  return (
    <Box>
      <SectionHeader title="Holiday" />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* Date Picker */}
        <DesktopDatePicker
          minDate={dayjs().startOf("day")}
          label="Select Date"
          value={values.holidayDate}
          onChange={(newValue) => setFieldValue("holidayDate", newValue)}
          slotProps={{
            textField: {
              fullWidth: true,
              error: touched.holidayDate && Boolean(errors.holidayDate),
              helperText: touched.holidayDate && errors.holidayDate,
              margin: "normal",
              // sx: {
              //   mt: 1,
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

        {/* Time Pickers */}
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          {/* <TimePicker
            label="Start Time"
            value={values.holidayStartTime}
            onChange={(val) => setFieldValue("holidayStartTime", val)}
            slotProps={{
              textField: {
                fullWidth: true,
                error:
                  touched.holidayStartTime && Boolean(errors.holidayStartTime),
                helperText: touched.holidayStartTime && errors.holidayStartTime,
                // sx: {
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
            value={values.holidayEndTime}
            onChange={(val) => setFieldValue("holidayEndTime", val)}
            slotProps={{
              textField: {
                fullWidth: true,
                error: touched.holidayEndTime && Boolean(errors.holidayEndTime),
                helperText: touched.holidayEndTime && errors.holidayEndTime,
                // sx: {
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
          /> */}

          <TimePickerPair
            //  fullWidth={fullWidth}
            startValue={values.holidayStartTime}
            endValue={values.holidayEndTime}
            onStartChange={(val) => setFieldValue("holidayStartTime", val)}
            onEndChange={(val) => setFieldValue("holidayEndTime", val)}
            startError={touched.holidayStartTime && errors.holidayStartTime}
            endError={touched.holidayEndTime && errors.holidayEndTime}
          />
        </Box>

        <Typography
          sx={{
            color: "#757575",
            display: "block",
            mt: 1,
            fontSize: "0.875rem",
            fontStyle: "italic",
          }}
        />
      </LocalizationProvider>
    </Box>
  );
}

export default Holiday;
