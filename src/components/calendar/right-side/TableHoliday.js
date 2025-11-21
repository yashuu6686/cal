"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import {
  TimePicker,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { TableActionButtons } from "@/components/TableActionButtons";
import {
  selectCalendar,
  updateHoliday,
  deleteHoliday,
} from "@/redux/store/slices/calendarSlice";

// ---------------------------------------------------------
// VALIDATION SCHEMA
// ---------------------------------------------------------
const holidayValidationSchema = yup.object().shape({
  date: yup
    .mixed()
    .required("Holiday date is required")
    .test("valid-date", "Invalid date", (value) =>
      value ? dayjs(value).isValid() : false
    ),

  startTime: yup
    .mixed()
    .nullable()
    .test("valid", "Invalid start time", (value) =>
      value ? dayjs(value).isValid() : true
    ),

  endTime: yup
    .mixed()
    .nullable()
    .test("valid", "Invalid end time", (value) =>
      value ? dayjs(value).isValid() : true
    )
    .test(
      "after-start",
      "End time must be after start time",
      function (value) {
        const { startTime } = this.parent;
        if (startTime && value) {
          return dayjs(value).isAfter(dayjs(startTime));
        }
        return true;
      }
    )
    .test(
      "no-overlap",
      "This holiday overlaps with existing holidays.",
      function (endTime) {
        const { startTime, date } = this.parent;
        const { existingHolidays, editIndex } = this.options.context;

        if (!date || !startTime || !endTime) return true;

        const newDate = dayjs(date).format("YYYY-MM-DD");
        const newStartTime = dayjs(startTime).format("HH:mm");
        const newEndTime = dayjs(endTime).format("HH:mm");

        const newStart = dayjs(`${newDate} ${newStartTime}`);
        const newEnd = dayjs(`${newDate} ${newEndTime}`);

        return !existingHolidays.some((h, i) => {
          if (i === editIndex) return false;

          if (!h.date || !h.startTime || !h.endTime) return false;

          const existingDate = dayjs(h.date).format("YYYY-MM-DD");
          if (existingDate !== newDate) return false;

          const existingStart = dayjs(`${existingDate} ${h.startTime}`);
          const existingEnd = dayjs(`${existingDate} ${h.endTime}`);

          return (
            newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart)
          );
        });
      }
    ),
});

// ---------------------------------------------------------

export default function HolidayTable() {
  const dispatch = useDispatch();

  const calendar = useSelector(selectCalendar);
  const holidays = calendar?.holidays || [];

  const [editingHolidayIndex, setEditingHolidayIndex] = useState(null);
  const [editHolidayData, setEditHolidayData] = useState({
    date: null,
    startTime: null,
    endTime: null,
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleStartHolidayInlineEdit = (index, holiday) => {
    setEditingHolidayIndex(index);

    setEditHolidayData({
      date: holiday.date ? dayjs(holiday.date) : null,
      startTime: holiday.startTime
        ? dayjs(holiday.startTime, "HH:mm")
        : null,
      endTime: holiday.endTime ? dayjs(holiday.endTime, "HH:mm") : null,
    });

    setFieldErrors({});
  };

  const handleCancelHolidayInlineEdit = () => {
    setEditingHolidayIndex(null);
    setEditHolidayData({ date: null, startTime: null, endTime: null });
    setFieldErrors({});
  };

  const handleSaveHolidayInlineEdit = async () => {
  console.log("Save clicked");
  console.log("editHolidayData:", editHolidayData);
  console.log("editingHolidayIndex:", editingHolidayIndex);
  
  try {
    await holidayValidationSchema.validate(editHolidayData, {
      abortEarly: false,
      context: {
        existingHolidays: holidays,
        editIndex: editingHolidayIndex,
      },
    });

    console.log("Validation passed");

    const payload = {
      index: editingHolidayIndex,
      date: editHolidayData.date?.format("YYYY-MM-DD") ?? null,
      startTime: editHolidayData.startTime
        ? editHolidayData.startTime.format("HH:mm")
        : null,
      endTime: editHolidayData.endTime
        ? editHolidayData.endTime.format("HH:mm")
        : null,
    };
    
    console.log("Dispatching payload:", payload);

    dispatch(updateHoliday(payload));

    handleCancelHolidayInlineEdit();
  } catch (err) {
    console.log("Validation error:", err);
    let errors = {};
    if (err.inner) {
      err.inner.forEach((e) => {
        errors[e.path] = e.message;
      });
    }
    setFieldErrors(errors);
  }
};

  const handleDeleteHoliday = (index) => {
    dispatch(deleteHoliday(index));
  };

  if (!calendar) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography>Loading holidays...</Typography>
      </Box>
    );
  }

  if (holidays.length === 0) {
    return (
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          border: "1px solid #e0e0e0",
          borderRadius: 2,
        }}
      >
        <Typography color="text.secondary">
          No holidays added yet. Click "Add Holiday" to create one.
        </Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TableContainer
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e0e0e0",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#1172BA" }}>
              <TableCell sx={headStyle}>📅 Date</TableCell>
              <TableCell sx={headStyle}>🕐 Start Time</TableCell>
              <TableCell sx={headStyle}>🕐 End Time</TableCell>
              <TableCell sx={headStyle}>⚙️ Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {holidays.map((holiday, index) => (
              <TableRow key={index} sx={{ borderTop: "1px solid #e0e0e0" }}>
                {/* Date */}
                <TableCell sx={cellStyle} align="center">
                  {editingHolidayIndex === index ? (
                    <DatePicker
                      value={editHolidayData.date}
                      onChange={(val) =>
                        setEditHolidayData({
                          ...editHolidayData,
                          date: val,
                        })
                      }
                      slotProps={{
                        textField: {
                          size: "small",
                          error: !!fieldErrors.date,
                          helperText: fieldErrors.date,
                          sx: pickerInputStyle,
                        },
                      }}
                    />
                  ) : (
                    <Chip
                      label={dayjs(holiday.date).format("MMM DD, YYYY")}
                      size="small"
                      color="primary"
                    />
                  )}
                </TableCell>

                {/* Start Time */}
                <TableCell sx={cellStyle} align="center">
                  {editingHolidayIndex === index ? (
                    <TimePicker
                      value={editHolidayData.startTime}
                      onChange={(val) =>
                        setEditHolidayData({
                          ...editHolidayData,
                          startTime: val,
                        })
                      }
                      slotProps={{
                        textField: {
                          size: "small",
                          error: !!fieldErrors.startTime,
                          helperText: fieldErrors.startTime,
                          sx: pickerInputStyle,
                        },
                      }}
                    />
                  ) : (
                    <Typography sx={textStyle}>
                      {holiday.startTime
                        ? dayjs(holiday.startTime, "HH:mm").format("hh:mm A")
                        : "Full Day"}
                    </Typography>
                  )}
                </TableCell>

                {/* End Time */}
                <TableCell sx={cellStyle} align="center">
                  {editingHolidayIndex === index ? (
                    <TimePicker
                      value={editHolidayData.endTime}
                      onChange={(val) =>
                        setEditHolidayData({
                          ...editHolidayData,
                          endTime: val,
                        })
                      }
                      slotProps={{
                        textField: {
                          size: "small",
                          error: !!fieldErrors.endTime,
                          helperText: fieldErrors.endTime,
                          sx: pickerInputStyle,
                        },
                      }}
                    />
                  ) : (
                    <Typography sx={textStyle}>
                      {holiday.endTime
                        ? dayjs(holiday.endTime, "HH:mm").format("hh:mm A")
                        : "Full Day"}
                    </Typography>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell align="center" sx={cellStyle}>
                  <TableActionButtons
                    isEditing={editingHolidayIndex === index}
                    onEdit={() =>
                      handleStartHolidayInlineEdit(index, holiday)
                    }
                    onDelete={() => handleDeleteHoliday(index)}
                    onSave={handleSaveHolidayInlineEdit}
                    onCancel={handleCancelHolidayInlineEdit}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </LocalizationProvider>
  );
}

// -----------------------------------
// STYLES
// -----------------------------------
const headStyle = {
  color: "#fff",
  fontWeight: 700,
  fontSize: "1rem",
  textAlign: "center",
};

const cellStyle = { 
  py: 1,
  px: 1,
};

const textStyle = {
  color: "#424242",
  fontWeight: 500,
  fontSize: "0.95rem",
};

// Edit mode picker input style - removes extra padding
const pickerInputStyle = {
  "& .MuiInputBase-root": {
    py: 0,
  },
  "& .MuiInputBase-input": {
    py: "6px",
    px: "10px",
  },
  "& .MuiOutlinedInput-root": {
    minHeight: "36px",
  },
};