
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
        ? dayjs(`2000-01-01 ${holiday.startTime}`)
        : null,
      endTime: holiday.endTime ? dayjs(`2000-01-01 ${holiday.endTime}`) : null,
    });
  };

  const handleSaveHolidayInlineEdit = async () => {
    if (editingHolidayIndex !== null && editHolidayData) {
      try {
        setFieldErrors({});

        const dataToValidate = {
          date: editHolidayData.date,
          startTime: editHolidayData.startTime,
          endTime: editHolidayData.endTime,
        };

        await holidayValidationSchema.validate(dataToValidate, {
          context: {
            existingHolidays: holidays.filter(
              (_, index) => index !== editingHolidayIndex
            ),
            weekSchedule,
          },
          abortEarly: false,
        });

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

        dispatch(setHolidays(updated));
        setEditingHolidayIndex(null);
        setEditHolidayData(null);
        setFieldErrors({});
      } catch (error) {
        if (error.name === "ValidationError" && error.inner) {
          const newErrors = {};
          error.inner.forEach((err) => {
            newErrors[err.path] = err.message;
          });
          setFieldErrors(newErrors);
        }
      }
    }
  };

  const handleCancelHolidayInlineEdit = () => {
    setEditingHolidayIndex(null);
    setEditHolidayData(null);
  };

  const handleDeleteHoliday = (index) => {
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