import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  setHolidays,
  deleteHoliday,
} from "@/redux/store/slices/calendarSlice";
import { holidayValidationSchema } from "@/components/calendar/validation/validation";

export const useHolidayEditing = () => {
  const dispatch = useDispatch();
  const holidays = useSelector((state) => state.calendar.holidays);
  const weekSchedule = useSelector((state) => state.calendar.weekSchedule);

  const [editingHolidayIndex, setEditingHolidayIndex] = useState(null);
  const [editHolidayData, setEditHolidayData] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleStartHolidayInlineEdit = (index, holiday) => {
    setEditingHolidayIndex(index);
    setEditHolidayData({
      date: holiday.date ? dayjs(holiday.date) : null,
      startTime: holiday.startTime
        ? dayjs.isDayjs(holiday.startTime)
          ? holiday.startTime
          : dayjs(`2000-01-01 ${holiday.startTime}`)
        : null,
      endTime: holiday.endTime
        ? dayjs.isDayjs(holiday.endTime)
          ? holiday.endTime
          : dayjs(`2000-01-01 ${holiday.endTime}`)
        : null,
    });
    setFieldErrors({}); //  Clear errors when starting edit
  };

  const handleSaveHolidayInlineEdit = async () => {
    console.log(" Save clicked");
    console.log(" Current editHolidayData:", editHolidayData);
    
    if (editingHolidayIndex !== null && editHolidayData) {
      try {
        setFieldErrors({});

        const dataToValidate = {
          date: editHolidayData.date,
          startTime: editHolidayData.startTime,
          endTime: editHolidayData.endTime,
        };

        console.log("Validating data:", dataToValidate);

        await holidayValidationSchema().validate(dataToValidate, {
          context: {
            existingHolidays: holidays.filter(
              (_, index) => index !== editingHolidayIndex
            ),
            weekSchedule,
            holidayEditIndex: editingHolidayIndex,
          },
          abortEarly: false,
        });

        console.log(" Validation passed");

        const updated = [...holidays];
        updated[editingHolidayIndex] = {
          date: editHolidayData.date
            ? dayjs(editHolidayData.date).format("YYYY-MM-DD")
            : null,
          startTime: editHolidayData.startTime
            ? dayjs(editHolidayData.startTime).format("HH:mm")
            : null,
          endTime: editHolidayData.endTime
            ? dayjs(editHolidayData.endTime).format("HH:mm")
            : null,
        };

        console.log(" Updating holiday:", updated[editingHolidayIndex]);

        dispatch(setHolidays(updated));
        setEditingHolidayIndex(null);
        setEditHolidayData(null);
        setFieldErrors({});
        
        console.log(" Holiday updated successfully");
      } catch (error) {
        if (error.name === "ValidationError" && error.inner) {
          const newErrors = {};
          error.inner.forEach((err) => {
            newErrors[err.path] = err.message;
          });
          setFieldErrors(newErrors);
        } else {
          // Handle unexpected errors
          setFieldErrors({
            general: error.message || "An unexpected error occurred"
          });
        }
      }
    } else {
      console.warn(" Cannot save: Missing index or data", {
        editingHolidayIndex,
        editHolidayData
      });
    }
  };

  const handleCancelHolidayInlineEdit = () => {
    console.log(" Cancel clicked");
    setEditingHolidayIndex(null);
    setEditHolidayData(null);
    setFieldErrors({}); //  Clear errors on cancel
  };

  const handleDeleteHoliday = (index) => {
    console.log(" Deleting holiday at index:", index);
    dispatch(deleteHoliday(index));
  };

  return {
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
  };
};