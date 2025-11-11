import CommonCard from "@/components/CommonCard";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Image from "next/image";
import noData from "../../../public/noData.webp";
import free from "../../../public/free.png";
import { data, weekDays } from "./index";
import AddBreak from "./AddBreak";
import * as Yup from "yup";
import { useBreakErrors } from "@/hook/useBreakErrors";

function Break({
  breaks,
  setBreaks,
  breakModalOpen,
  setBreakModalOpen,
  editMode,
  setBreakErrors
}) {
  const [newBreak, setNewBreak] = useState({
    day: [],
    startTime: "",
    endTime: "",
  });
  const { errors, setErrors, editErrors, setEditErrors } = useBreakErrors(setBreakErrors);

  const breakSchema = Yup.object().shape({
    day: Yup.array()
      .min(1, "Please select at least one day")
      .required("Day is required"),
    startTime: Yup.string().required("Start time is required"),
    endTime: Yup.string()
      .required("End time is required")
      .test(
        "different-time",
        "Start and End time cannot be same",
        function (value) {
          const { startTime } = this.parent;
          return startTime !== value;
        }
      )
      .test("time-order", "End time must be after start time", function (value) {
        const { startTime } = this.parent;
        if (!startTime || !value) return true;
        return dayjs(`1970-01-01T${value}`).isAfter(
          dayjs(`1970-01-01T${startTime}`)
        );
      }),
  });

  const validateNewBreak = async () => {
    try {
      await breakSchema.validate(newBreak, { abortEarly: false });

      // Check for time conflicts with existing breaks
      const allBreaks = breaks.map((b) => ({
        day: b.day,
        start: dayjs(`1970-01-01T${b.startTime}`),
        end: dayjs(`1970-01-01T${b.endTime}`),
      }));
      const newStart = dayjs(`1970-01-01T${newBreak.startTime}`);
      const newEnd = dayjs(`1970-01-01T${newBreak.endTime}`);

      const hasConflict = newBreak.day.some((dayIdx) =>
        allBreaks.some((b) => {
          if (b.day !== dayIdx) return false;
          return (
            (newStart.isBefore(b.end) && newEnd.isAfter(b.start)) ||
            (newStart.isSame(b.start) && newEnd.isSame(b.end))
          );
        })
      );

      if (hasConflict) {
        setErrors({ startTime: "This time slot is already booked." });
        return false;
      }

      setErrors({});
      return true;
    } catch (validationError) {
      const errs = {};
      validationError.inner.forEach((err) => {
        errs[err.path] = err.message;
      });
      setErrors(errs);
      return false;
    }
  };

  const handleAddBreak = async () => {
    const isValid = await validateNewBreak();
    if (!isValid) return;

    const newBreaks = newBreak.day.map((dayIdx) => ({
      day: dayIdx,
      startTime: newBreak.startTime,
      endTime: newBreak.endTime,
    }));
    setBreaks((prev) => [...prev, ...newBreaks]);
    setNewBreak({ day: [], startTime: "", endTime: "" });
    setErrors({});
    setBreakModalOpen(false);
  };

  const validateEditedBreak = (breakItem, index) => {
    try {
      breakSchema.validateSync(
        {
          day: [breakItem.day], // single day as array for validation
          startTime: breakItem.startTime,
          endTime: breakItem.endTime,
        },
        { abortEarly: false }
      );

      // Check for time conflicts with existing breaks
      const allBreaks = breaks.map((b, i) => ({
        day: b.day,
        start: dayjs(`1970-01-01T${b.startTime}`),
        end: dayjs(`1970-01-01T${b.endTime}`),
      }));

      const newStart = dayjs(`1970-01-01T${breakItem.startTime}`);
      const newEnd = dayjs(`1970-01-01T${breakItem.endTime}`);

      const hasConflict = allBreaks.some((b, i) => {
        if (i === index) return false; // skip current break
        if (b.day !== breakItem.day) return false;
        return (
          (newStart.isBefore(b.end) && newEnd.isAfter(b.start)) ||
          (newStart.isSame(b.start) && newEnd.isSame(b.end))
        );
      });

      if (hasConflict) {
        return { startTime: "This time slot is already booked." };
      }

      return {};
    } catch (validationError) {
      const errs = {};
      validationError.inner.forEach((err) => {
        errs[err.path] = err.message;
      });
      return errs;
    }
  };

  const handleDelete = (index) => {
    setBreaks(breaks.filter((_, i) => i !== index));
    setEditErrors((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  return (
    <>
      <CommonCard
        title={
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Image src={free} height={25} width={25} alt="Break" />
            Break
          </span>
        }
        actions={[
          {
            label: "Add Break",
            onClick: () => setBreakModalOpen(true),
            variant: "contained",
            disabled: !editMode,
          },
        ]}
      >
        <Table size="small" sx={{ mt: 1 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "rgb(198, 228, 251)" }}>
              {data.map((item, idx) => (
                <TableCell
                  key={idx}
                  align="center"
                  sx={{
                    color: "black",
                    textAlign: "center",
                    ...(idx === 0 && {
                      borderTopLeftRadius: "8px",
                      borderBottomLeftRadius: "8px",
                    }),
                    ...(idx === data.length - 1 && {
                      borderTopRightRadius: "8px",
                      borderBottomRightRadius: "8px",
                    }),
                  }}
                >
                  {item.type}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {breaks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{ borderBottom: "none" }}
                >
                  <Image src={noData} height={123} width={173} alt="No Data" />
                  <Typography>No data available.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              breaks.map((b, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{weekDays[b.day]}</TableCell>
                  <TableCell align="center">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        disabled={!editMode}
                        sx={{
                          mt: 0.5,
                          gap: 3,
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          alignItems: "center",
                         
                          ".MuiPickersInputBase-root": {
                            width: "136px",
                            boxShadow:
                              "inset 4px 2px 8px rgba(95, 157, 231, .48), inset -4px -2px 8px #fff",
                            borderRadius: 5,
                            height: "40px",
                          },
                        }}
                        value={
                          b.startTime
                            ? dayjs(`1970-01-01T${b.startTime}`)
                            : null
                        }
                        onChange={(newValue) => {
                          const updated = [...breaks];
                          updated[index].startTime = newValue
                            ? dayjs(newValue).format("HH:mm")
                            : "";

                          const errs = validateEditedBreak(
                            updated[index],
                            index
                          );
                          setEditErrors((prev) => ({ ...prev, [index]: errs }));

                          if (Object.keys(errs).length === 0)
                            setBreaks(updated);
                        }}
                        slotProps={{
                          textField: {
                            error: Boolean(editErrors[index]?.startTime),
                            helperText: "",
                          },
                        }}
                      />
                      {editErrors[index]?.startTime && (
                        <Typography color="error" variant="caption" sx={{ 
                            fontSize:"0.69rem"
                          }}>
                          {editErrors[index].startTime}
                        </Typography>
                      )}
                    </LocalizationProvider>
                  </TableCell>
                  <TableCell align="center">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        disabled={!editMode}
                        sx={{
                          mt: 0.5,
                          gap: 3,
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          alignItems: "center",
                          ".MuiPickersInputBase-root": {
                            width: "136px",
                            boxShadow:
                              "inset 4px 2px 8px rgba(95, 157, 231, .48), inset -4px -2px 8px #fff",
                            borderRadius: 5,
                            height: "40px",
                          },
                        }}
                        value={
                          b.endTime ? dayjs(`1970-01-01T${b.endTime}`) : null
                        }
                        onChange={(newValue) => {
                          const updated = [...breaks];
                          updated[index].endTime = newValue
                            ? dayjs(newValue).format("HH:mm")
                            : "";

                          const errs = validateEditedBreak(
                            updated[index],
                            index
                          );
                          setEditErrors((prev) => ({ ...prev, [index]: errs }));

                          if (Object.keys(errs).length === 0)
                            setBreaks(updated);
                        }}
                        slotProps={{
                          textField: {
                            error: Boolean(editErrors[index]?.endTime),
                            helperText: "",
                          },
                        }}
                      />
                      {editErrors[index]?.endTime && (
                        <Typography color="error" variant="caption"  sx={{ 
                            fontSize:"0.69rem"
                          }}>
                          {editErrors[index].endTime}
                        </Typography>
                      )}
                    </LocalizationProvider>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                    disabled={!editMode}
                      size="small"
                      sx={{ color: "#d32f2f" }}
                      onClick={() => handleDelete(index)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CommonCard>

      <AddBreak
        breakModalOpen={breakModalOpen}
        setBreakModalOpen={setBreakModalOpen}
        handleAddBreak={handleAddBreak}
        newBreak={newBreak}
        setNewBreak={setNewBreak}
        errors={errors}
        setErrors={setErrors}
      />
    </>
  );
}

export default Break;
