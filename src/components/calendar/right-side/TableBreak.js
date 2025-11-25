"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Box,
} from "@mui/material";

import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import * as yup from "yup";

import { TableActionButtons } from "@/components/TableActionButtons";
import { useSelector, useDispatch } from "react-redux";
import { updateBreak } from "@/redux/store/slices/calendarSlice";

// ----------------------------------------
// VALIDATION SCHEMA
// ----------------------------------------
const breakValidationSchema = yup.object().shape({
  startTime: yup.mixed().required("Break start time is required"),
  endTime: yup
    .mixed()
    .required("Break end time is required")
    .test("is-after", "End time must be after start time", function (value) {
      const { startTime } = this.parent;
      return value && startTime
        ? dayjs(value).isAfter(dayjs(startTime))
        : true;
    })
    .test(
      "no-overlap",
      "This time slot overlaps with existing break.",
      function (endTime) {
        const { startTime } = this.parent;
        const { breaks, currentDay, editIndex } = this.options.context;

        if (!startTime || !endTime) return true;

        const newStart = dayjs(startTime).format("HH:mm");
        const newEnd = dayjs(endTime).format("HH:mm");

        const today = dayjs().format("YYYY-MM-DD");

        const breakStart = dayjs(`${today} ${newStart}`, "YYYY-MM-DD HH:mm");
        const breakEnd = dayjs(`${today} ${newEnd}`, "YYYY-MM-DD HH:mm");

        return !breaks.some((b, i) => {
          if (i === editIndex) return false; // skip self while editing
          if (b.day !== currentDay) return false;

          const existingStart = dayjs(
            `${today} ${b.breakStartTime}`,
            "YYYY-MM-DD HH:mm"
          );
          const existingEnd = dayjs(
            `${today} ${b.breakEndTime}`,
            "YYYY-MM-DD HH:mm"
          );

          return (
            breakStart.isBefore(existingEnd) && breakEnd.isAfter(existingStart)
          );
        });
      }
    ),
});

export default function BreakTable() {
  const dispatch = useDispatch();
  const breaks = useSelector((state) => state.calendar.breaks);

  // -------------------------------
  // INLINE EDIT STATES
  // -------------------------------
  const [editingBreakIndex, setEditingBreakIndex] = useState(null);
  const [editBreakData, setEditBreakData] = useState({
    startTime: null,
    endTime: null,
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // -------------------------------
  // START EDIT
  // -------------------------------
  const handleStartInlineEdit = (rowId, item) => {
    setEditingBreakIndex(rowId);

    setEditBreakData({
      startTime: item.breakStartTime
        ? dayjs(item.breakStartTime, "HH:mm")
        : null,
      endTime: item.breakEndTime ? dayjs(item.breakEndTime, "HH:mm") : null,
    });

    setFieldErrors({});
  };

  // -------------------------------
  // CANCEL EDIT
  // -------------------------------
  const handleCancelInlineEdit = () => {
    setEditingBreakIndex(null);
    setEditBreakData({ startTime: null, endTime: null });
    setFieldErrors({});
  };

  // -------------------------------
  // SAVE INLINE EDIT
  // -------------------------------
  const handleSaveInlineEdit = async (breakIndex, dayIndex, day) => {
    try {
      // Validate using Yup Schema
      await breakValidationSchema.validate(editBreakData, {
        abortEarly: false,
        context: {
          breaks,
          currentDay: day,
          editIndex: breakIndex,
        },
      });

      // If valid -> update redux
      dispatch(
        updateBreak({
          breakIndex,
          dayIndex,
          startTime: editBreakData.startTime.format("HH:mm"),
          endTime: editBreakData.endTime.format("HH:mm"),
        })
      );

      handleCancelInlineEdit();
    } catch (err) {
      let errors = {};
      if (err.inner) {
        err.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
      }
      setFieldErrors(errors);
    }
  };

  // -------------------------------
  // DELETE BREAK
  // -------------------------------
  const handleDeleteDay = (breakIndex, dayIndex) => {
    // console.log("Delete row:", breakIndex, dayIndex);
  };

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
              <TableCell sx={headStyle}>📅 Days</TableCell>
              <TableCell sx={headStyle}>🕐 Start Time</TableCell>
              <TableCell sx={headStyle}>🕐 End Time</TableCell>
              <TableCell sx={headStyle}>⚙️ Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {breaks.map((item) => {
              const rowId = `${item.breakIndex}-${item.dayIndex}`;

              return (
                <TableRow key={rowId} sx={{ borderTop: "1px solid #e0e0e0" }}>
                  {/* Day */}
                  <TableCell sx={cellStyle} align="center">
                    <Chip label={item.day} color="primary" size="small" />
                  </TableCell>

                  {/* Start Time */}
                  <TableCell sx={cellStyle} align="center">
                    {editingBreakIndex === rowId ? (
                      <TimePicker
                        value={editBreakData.startTime}
                        onChange={(val) =>
                          setEditBreakData({
                            ...editBreakData,
                            startTime: val,
                          })
                        }
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            error: !!fieldErrors.startTime,
                            helperText: fieldErrors.startTime,
                          },
                        }}
                      />
                    ) : (
                      <Typography sx={textStyle}>
                        {item.breakStartTime
                          ? dayjs(item.breakStartTime, "HH:mm").format("hh:mm A")
                          : "Not set"}
                      </Typography>
                    )}
                  </TableCell>

                  {/* End Time */}
                  <TableCell sx={cellStyle} align="center">
                    {editingBreakIndex === rowId ? (
                      <TimePicker
                        value={editBreakData.endTime}
                        onChange={(val) =>
                          setEditBreakData({
                            ...editBreakData,
                            endTime: val,
                          })
                        }
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            error: !!fieldErrors.endTime,
                            helperText: fieldErrors.endTime,
                          },
                        }}
                      />
                    ) : (
                      <Typography sx={textStyle}>
                        {item.breakEndTime
                          ? dayjs(item.breakEndTime, "HH:mm").format("hh:mm A")
                          : "Not set"}
                      </Typography>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    <TableActionButtons
                      isEditing={editingBreakIndex === rowId}
                      onEdit={() => handleStartInlineEdit(rowId, item)}
                      onDelete={() =>
                        handleDeleteDay(item.breakIndex, item.dayIndex)
                      }
                      onSave={() =>
                        handleSaveInlineEdit(
                          item.breakIndex,
                          item.dayIndex,
                          item.day
                        )
                      }
                      onCancel={handleCancelInlineEdit}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
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

const cellStyle = { py: 1.5 };

const textStyle = {
  color: "#424242",
  fontWeight: 500,
  fontSize: "0.95rem",
};
