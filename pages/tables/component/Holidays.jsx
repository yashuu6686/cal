import CommonCard from "@/components/CommonCard";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import {
  LocalizationProvider,
  DesktopDatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Image from "next/image";
import noData from "../../../public/noData.webp";
import CommonDialog from "@/components/CommonDialog";
import { timePickers, holidayData } from "./index";
import holidaysImage from "../../../public/holiday.png";
import { StyledDatePickerWrapper, commonShadow } from "./commonStyles";
import { validateHolidayAndSave, holidayValidationSchema } from "./validation";
import { useHolidayErrors } from "@/hook/useHolidayErrors";

function Holidays({
  holidayModalOpen,
  setHolidayModalOpen,
  holiday,
  setHoliday,
  holidays,
  setHolidays,
  editMode,
  setHolidayErrors
}) {
   const [errors, setErrors] = useHolidayErrors(setHolidayErrors);
  const [holidayValues, setHolidayValues] = React.useState({});
 
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setHolidayValues({ ...holiday, isAllDay: false });
    setErrors({});
  }, [holidayModalOpen]);

  const handleAddSave = async () => {
    await validateHolidayAndSave({
      values: holidayValues,
      validationSchema: holidayValidationSchema,
      holidays,
      setErrors: (newErrors) => setErrors({ ...errors, modal: newErrors }),
      onSave: (values) => {
        setHolidays((prev) => [...prev, values]);
        setHoliday({ date: null, startTime: "", endTime: "" });
        setHolidayModalOpen(false);
        setErrors({ ...errors, modal: {} });
      },
    });
  };

  const handleEditSave = async (index, updatedValues) => {
    await validateHolidayAndSave({
      values: updatedValues,
      validationSchema: holidayValidationSchema,
      holidays,
      setErrors: (newErrors) => setErrors({ ...errors, [index]: newErrors }),
      editing: index,
      setHolidays,
    });
  };

  const handleDelete = (index) => {
    setHolidays((prev) => prev.filter((_, i) => i !== index));
  };

  const renderHelperText = (text) => (
    <Typography
      color="error"
      variant="caption"
      sx={{ mt: 0.3, minHeight: "18px", textAlign: "center" ,fontSize:"0.65rem"}}
    >
      {text || ""}
    </Typography>
  );

  return (
    <>
      <CommonCard
        title={
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Image
              alt="Holiday"
              src={holidaysImage}
              height={25}
              width={25}
              style={{ objectFit: "contain" }}
            />
            Holiday
          </span>
        }
        actions={[
          {
            label: "Add Holiday",
            onClick: () => setHolidayModalOpen(true),
            variant: "contained",
            disabled: !editMode,
          },
        ]}
      >
        <TableContainer
          sx={{ borderRadius: "12px", overflow: "hidden", minWidth: "50vh" }}
        >
          <Table size="small" sx={{ mt: 1 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgb(198, 228, 251)" }}>
                {holidayData.map((item, idx) => (
                  <TableCell
                    key={idx}
                    sx={{
                      color: "black",
                      textAlign: "center",
                      ...(idx === 0 && {
                        borderTopLeftRadius: "8px",
                        borderBottomLeftRadius: "8px",
                      }),
                      ...(idx === holidayData.length - 1 && {
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
              {holidays.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{ borderBottom: "none" }}
                  >
                    <Image
                      alt="No Data Found"
                      src={noData}
                      height={123}
                      width={173}
                      style={{ objectFit: "contain" }}
                    />
                    <Typography>No data available.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                holidays.map((h, index) => (
                  <TableRow key={index}>
                    {/* Date */}
                    <TableCell sx={{ textAlign: "center" }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StyledDatePickerWrapper>
                          <DesktopDatePicker
                           minDate={dayjs().startOf("day")}
                            label={null}
                            disabled={!editMode}
                            sx={{
                              ".MuiPickersInputBase-root": {
                                borderRadius: 5,
                                width: "126px",
                                height: "40px",
                                ".MuiOutlinedInput-input": { display: "none" },
                              },
                            }}
                            value={h.date ? dayjs(h.date) : null}
                           
                            onChange={(newValue) =>
                              handleEditSave(index, { ...h, date: newValue })
                            }
                            slotProps={{
                              textField: {
                                error: Boolean(errors[index]?.date),
                                helperText: "",
                                placeholder: "",
                              },
                            }}
                          />
                        </StyledDatePickerWrapper>
                      </LocalizationProvider>
                      {renderHelperText(errors[index]?.date)}
                    </TableCell>

                    {/* Start & End Times */}
                    {timePickers.map((picker, i) => (
                      <TableCell key={i} sx={{ textAlign: "center" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <StyledDatePickerWrapper>
                          <TimePicker
                            disabled={!editMode}
                            sx={{
                              ".MuiSvgIcon-root":{
                                height:"0.60em",
                                width:"0.60em"
                              },
                              mt: 0.5,
                              gap: 3,
                              display: "flex",
                              justifyContent: "center",
                              flexDirection: "column",
                              alignItems: "center",
                              ".MuiPickersInputBase-root": {
                                width: "116px",
                                boxShadow:
                                  "inset 4px 2px 8px rgba(95, 157, 231, .48), inset -4px -2px 8px #fff",
                                borderRadius: 5,
                                height: "40px",
                              },
                            }}
                            value={
                              h[picker.field]
                                ? dayjs(`1970-01-01T${h[picker.field]}`)
                                : null
                            }
                            onChange={(newValue) => {
                              const updated = {
                                ...h,
                                [picker.field]: newValue
                                  ? dayjs(newValue).format("HH:mm")
                                  : "",
                              };
                              setHolidays((prev) =>
                                prev.map((item, i) => (i === index ? updated : item))
                              );
                              handleEditSave(index, updated);
                            }}
                            slotProps={{
                              textField: {
                                error: Boolean(errors[index]?.[picker.field]),
                                helperText: "",
                              },
                            }}
                          />
                          </StyledDatePickerWrapper>
                        </LocalizationProvider>
                        {renderHelperText(errors[index]?.[picker.field])}
                      </TableCell>
                    ))}

                    {/* Delete */}
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
        </TableContainer>
      </CommonCard>

      {/* Add Holiday Dialog */}
      <CommonDialog
        open={holidayModalOpen}
        onClose={() => setHolidayModalOpen(false)}
        title="Add Holiday"
        saveLabel="Save"
        cancelLabel="Cancel"
        onSave={handleAddSave}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker 
           minDate={dayjs().startOf("day")}      
            sx={{
              ...commonShadow,
              cursor: "pointer", // indicate it's clickable
              ".MuiInputBase-input": { pointerEvents: "none" },
            }}
           
            label="Select Date"
            value={holidayValues.date}
            onChange={(newValue) => {
              setHolidayValues((prev) => ({ ...prev, date: newValue }));
              setErrors((prev) => ({ ...prev, modal: { ...prev.modal, date: "" } }));
            }}
            onBlur={() => handleEditSave(index, h)}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                error: Boolean(errors.modal?.date),
                helperText: errors.modal?.date,
               
              },
            }}
          />

          <Box sx={{ display: "flex", mt: 1 }}>
            {timePickers.map((picker, index) => (
              <Box key={index} sx={{ mr: picker.mr }}>
                <TimePicker
                  disabled={holidayValues.isAllDay}
                  sx={{
                  ".MuiPickersInputBase-root": {
                    boxShadow:
                      "inset 4px 2px 8px rgba(95, 157, 231, .48), inset -4px -2px 8px #fff",
                    borderRadius: 5,
                    width: "277px",
                    height: "53px",
                     mr: 1.5,
                  },
                }}
                  label={picker.label}
                  value={
                    holidayValues[picker.field]
                      ? dayjs(`1970-01-01T${holidayValues[picker.field]}`)
                      : null
                  }
                  onChange={(newValue) => {
                    const timeString = newValue ? dayjs(newValue).format("HH:mm") : "";
                    setHolidayValues((prev) => ({ ...prev, [picker.field]: timeString }));
                    setErrors((prev) => ({ ...prev, modal: { ...prev.modal, [picker.field]: "" } }));
                  }}
                  slotProps={{
                    textField: {
                      error: Boolean(errors.modal?.[picker.field]),
                      helperText: errors.modal?.[picker.field],
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </LocalizationProvider>
      </CommonDialog>
    </>
  );
}

export default Holidays;
