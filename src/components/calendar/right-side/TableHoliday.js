"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Edit, Delete, Check, Close } from "@mui/icons-material";
import dayjs from "dayjs";

import { useHolidayEditing } from "@/hook/useHolidayEditing";
import { sortHolidaysByDateTime } from "@/components/calendar/utils/eventHelpers";

export default function HolidayTable() {
  const {
    holidays,
    editingHolidayIndex,
    editHolidayData,
    fieldErrors,
    handleStartHolidayInlineEdit,
    handleSaveHolidayInlineEdit,
    handleCancelHolidayInlineEdit,
    handleDeleteHoliday,
    setEditHolidayData,
    setFieldErrors,
  } = useHolidayEditing();

  const sortedHolidays = sortHolidaysByDateTime(holidays);

  return (
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
            <TableCell
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
              }}
              align="center"
            >
              📅 Date
            </TableCell>
            <TableCell
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
              }}
              align="center"
            >
              🕐 Start Time
            </TableCell>
            <TableCell
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
              }}
              align="center"
            >
              🕐 End Time
            </TableCell>
            <TableCell
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
              }}
              align="center"
            >
              ⚙️ Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedHolidays.map((holiday, index) => (
            <TableRow
              key={index}
              sx={{
                borderTop: "1px solid #e0e0e0",
                textAlign: "center",
              }}
            >
              {/* Date Column */}
              <TableCell
                sx={{
                  py: 1.5,
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                {editingHolidayIndex === index ? (
                  <DatePicker
                    value={editHolidayData?.date}
                    onChange={(newValue) => {
                      setEditHolidayData({
                        ...editHolidayData,
                        date: newValue,
                      });
                      if (fieldErrors.date) {
                        const { date, ...rest } = fieldErrors;
                        setFieldErrors(rest);
                      }
                    }}
                    slotProps={{
                      textField: {
                        error: !!fieldErrors.date,
                        helperText: fieldErrors.date,
                        size: "small",
                      },
                    }}
                  />
                ) : (
                  <Chip
                    label={
                      holiday.date
                        ? dayjs(holiday.date).format("MMM DD, YYYY")
                        : "No Date"
                    }
                    size="small"
                    color="primary"
                  />
                )}
              </TableCell>

              {/* Start Time Column */}
              <TableCell
                sx={{
                  py: 1.5,
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                {editingHolidayIndex === index ? (
                  <TimePicker
                    value={editHolidayData?.startTime}
                    onChange={(newValue) => {
                      setEditHolidayData({
                        ...editHolidayData,
                        startTime: newValue,
                      });
                      if (fieldErrors.startTime) {
                        const { startTime, ...rest } = fieldErrors;
                        setFieldErrors(rest);
                      }
                    }}
                    slotProps={{
                      textField: {
                        size: "small",
                        error: !!fieldErrors.startTime,
                        helperText: fieldErrors.startTime,
                      },
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      color: "#424242",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    }}
                  >
                    {holiday.startTime
                      ? dayjs(holiday.startTime, "HH:mm").format("hh:mm A")
                      : "Full Day"}
                  </Typography>
                )}
              </TableCell>

              {/* End Time Column */}
              <TableCell
                sx={{
                  py: 1.5,
                  padding: "5px",
                  textAlign: "center",
                }}
              >
                {editingHolidayIndex === index ? (
                  <TimePicker
                    value={editHolidayData?.endTime}
                    onChange={(newValue) => {
                      setEditHolidayData({
                        ...editHolidayData,
                        endTime: newValue,
                      });
                      if (fieldErrors.endTime) {
                        const { endTime, ...rest } = fieldErrors;
                        setFieldErrors(rest);
                      }
                    }}
                    slotProps={{
                      textField: {
                        size: "small",
                        error: !!fieldErrors.endTime,
                        helperText: fieldErrors.endTime,
                      },
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      color: "#424242",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    }}
                  >
                    {holiday.endTime
                      ? dayjs(holiday.endTime, "HH:mm").format("hh:mm A")
                      : "Full Day"}
                  </Typography>
                )}
              </TableCell>

              {/* Actions Column */}
              <TableCell align="center" sx={{ py: 1.5, textAlign: "center" }}>
                {editingHolidayIndex === index ? (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.5,
                      justifyContent: "center",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={handleSaveHolidayInlineEdit}
                      sx={{
                        color: "white",
                        bgcolor: "#4caf50",
                        "&:hover": { bgcolor: "#45a049" },
                      }}
                    >
                      <Check fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={handleCancelHolidayInlineEdit}
                      sx={{
                        color: "white",
                        bgcolor: "#f44336",
                        "&:hover": { bgcolor: "#da190b" },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.5,
                      justifyContent: "center",
                    }}
                  >
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() =>
                        handleStartHolidayInlineEdit(index, holiday)
                      }
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDeleteHoliday(index)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}