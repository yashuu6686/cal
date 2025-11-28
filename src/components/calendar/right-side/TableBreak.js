"use client";
import React, { useState, useEffect } from "react";
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

import { TableActionButtons } from "@/components/TableActionButtons";
import { useSelector, useDispatch } from "react-redux";
import { deleteBreak, updateBreak } from "@/redux/store/slices/calendarSlice";
import { breakValidationSchema } from "../validation/validation";

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

  const handleStartInlineEdit = (rowId, item) => {
    setEditingBreakIndex(rowId);

    const startTimeObj = item.breakStartTime
      ? dayjs(item.breakStartTime, "HH:mm")
      : null;
    const endTimeObj = item.breakEndTime
      ? dayjs(item.breakEndTime, "HH:mm")
      : null;

    setEditBreakData({
      startTime: startTimeObj,
      endTime: endTimeObj,
    });

    setFieldErrors({});
  };

  const handleCancelInlineEdit = () => {
    setEditingBreakIndex(null);
    setEditBreakData({ startTime: null, endTime: null });
    setFieldErrors({});
  };

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

      const startTimeFormatted = editBreakData.startTime.format("HH:mm");
      const endTimeFormatted = editBreakData.endTime.format("HH:mm");

      dispatch(
        updateBreak({
          breakIndex,
          dayIndex,
          startTime: startTimeFormatted,
          endTime: endTimeFormatted,
        })
      );

      handleCancelInlineEdit();
    } catch (err) {
      console.error(" Validation Failed:", err);
      let errors = {};
      if (err.inner) {
        err.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
      }

      setFieldErrors(errors);
    }
  };

  const handleDeleteBreak = (dayIndex, breakIndex) => {
  
    dispatch(deleteBreak({ dayIndex, breakIndex }));
  
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
              const isEditing = editingBreakIndex === rowId;
              return (
                <TableRow key={rowId} sx={{ borderTop: "1px solid #e0e0e0" }}>
                  {/* Day */}
                  <TableCell sx={cellStyle} align="center">
                    <Chip label={item.day} color="primary" size="small" />
                  </TableCell>

                  {/* Start Time */}
                  <TableCell sx={cellStyle} align="center">
                    {isEditing ? (
                      <TimePicker
                        value={editBreakData.startTime}
                        onChange={(val) => {
                         
                          setEditBreakData((prev) => ({
                            ...prev,
                            startTime: val,
                          }));
                        }}
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
                          ? dayjs(item.breakStartTime, "HH:mm").format(
                              "hh:mm A"
                            )
                          : "Not set"}
                      </Typography>
                    )}
                  </TableCell>

                  {/* End Time */}
                  <TableCell sx={cellStyle} align="center">
                    {isEditing ? (
                      <TimePicker
                        value={editBreakData.endTime}
                        onChange={(val) => {
                          
                          setEditBreakData((prev) => ({
                            ...prev,
                            endTime: val,
                          }));
                        }}
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
                      isEditing={isEditing}
                      onEdit={() => handleStartInlineEdit(rowId, item)}
                      onDelete={() => handleDeleteBreak(item.dayIndex, item.breakIndex)} 
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
