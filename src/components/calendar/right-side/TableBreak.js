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
import { Edit, Delete, Check, Close } from "@mui/icons-material";
import dayjs from "dayjs";

import { useBreakEditing } from "@/hook/useBreakEditing";
import { sortBreaksByDayAndTime } from "@/components/calendar/utils/eventHelpers";

export default function BreakTable() {
  const {
    breaks,
    editingBreakIndex,
    editBreakData,
    fieldErrors,
    handleStartInlineEdit,
    handleSaveInlineEdit,
    handleCancelInlineEdit,
    handleDeleteDay,
    setEditBreakData,
    setFieldErrors,
  } = useBreakEditing();

  const sortedBreaks = sortBreaksByDayAndTime(breaks);

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
                textAlign: "center",
              }}
            >
              📅 Days
            </TableCell>
            <TableCell
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              🕐 Start Time
            </TableCell>
            <TableCell
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              🕐 End Time
            </TableCell>
            <TableCell
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                textAlign: "center",
              }}
              align="center"
            >
              ⚙️ Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedBreaks.map((item) => (
            <TableRow
              key={`${item.breakIndex}-${item.dayIndex}`}
              sx={{ borderTop: "1px solid #e0e0e0" }}
            >
              {/* Day Column */}
              <TableCell sx={{ py: 1.5, textAlign: "center" }}>
                <Chip label={item.day} size="small" color="primary" />
              </TableCell>

              {/* Start Time Column */}
              <TableCell sx={{ py: 1.5, textAlign: "center" }}>
                {editingBreakIndex === `${item.breakIndex}-${item.dayIndex}` ? (
                  <TimePicker
                    value={editBreakData?.startTime}
                    onChange={(newValue) => {
                      setEditBreakData({
                        ...editBreakData,
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
                        fullWidth: true,
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
                    {item.startTime
                      ? dayjs(item.startTime, "HH:mm").format("hh:mm A")
                      : "Not set"}
                  </Typography>
                )}
              </TableCell>

              {/* End Time Column */}
              <TableCell sx={{ py: 1.5, textAlign: "center" }}>
                {editingBreakIndex === `${item.breakIndex}-${item.dayIndex}` ? (
                  <TimePicker
                    value={editBreakData?.endTime}
                    onChange={(newValue) => {
                      setEditBreakData({
                        ...editBreakData,
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
                        fullWidth: true,
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
                    {item.endTime
                      ? dayjs(item.endTime, "HH:mm").format("hh:mm A")
                      : "Not set"}
                  </Typography>
                )}
              </TableCell>

              {/* Actions Column */}
              <TableCell align="center" sx={{ py: 1.5, textAlign: "center" }}>
                {editingBreakIndex === `${item.breakIndex}-${item.dayIndex}` ? (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.5,
                      justifyContent: "center",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleSaveInlineEdit(item.breakIndex, item.dayIndex)
                      }
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
                      onClick={handleCancelInlineEdit}
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
                        handleStartInlineEdit(
                          `${item.breakIndex}-${item.dayIndex}`,
                          item
                        )
                      }
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() =>
                        handleDeleteDay(item.breakIndex, item.dayIndex)
                      }
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