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

function Holiday({ holidayData, setHolidayData,holidayErrors }) {

  const getHolidayError = (field) => holidayErrors?.[field] || "";


   
 const { date, startTime, endTime } = holidayData;
//  console.log(holidayData);
 
   
  return (
    <Box>
      <SectionHeader title="Holiday" />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* Date Picker */}
        <DesktopDatePicker
          minDate={dayjs().startOf("day")}
          label="Select Date"
           value={date}
             onChange={(val) =>
            setHolidayData((prev) => ({ ...prev, date: val }))
          }
          slotProps={{
            textField: {
              fullWidth: true,
                error: Boolean(getHolidayError("holidayDate")),
      helperText: getHolidayError("holidayDate"),
             
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
          startValue={startTime}
            endValue={endTime}
            onStartChange={(val) =>
              setHolidayData((prev) => ({ ...prev, startTime: val }))
            }
            onEndChange={(val) =>
              setHolidayData((prev) => ({ ...prev, endTime: val }))
            }

            startError={getHolidayError("holidayStartTime")}
  endError={getHolidayError("holidayEndTime")}
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
