import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { setBreaks } from "@/redux/store/slices/calendarSlice";
import { breakValidationSchema } from "@/components/calendar/validation/validation";

export const useBreakEditing = () => {
  const dispatch = useDispatch();
  const breaks = useSelector((state) => state.calendar.breaks);

  const [editingBreakIndex, setEditingBreakIndex] = useState(null);
  const [editBreakData, setEditBreakData] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleStartInlineEdit = (index, breakItem) => {
    setEditingBreakIndex(index);
    setEditBreakData({
      days: breakItem.days,
      startTime: breakItem.startTime
        ? dayjs(`2000-01-01 ${breakItem.startTime}`)
        : null,
      endTime: breakItem.endTime
        ? dayjs(`2000-01-01 ${breakItem.endTime}`)
        : null,
    });
    setFieldErrors({});
  };

  const handleSaveInlineEdit = async () => {
    if (editingBreakIndex !== null && editBreakData) {
      try {
        setFieldErrors({});

        const [actualBreakIndex, dayIndex] = editingBreakIndex
          .split("-")
          .map(Number);

        const breakItem = breaks[actualBreakIndex];
        const editedDay = breakItem.days[dayIndex];

        const newStartTime = editBreakData.startTime
          ? dayjs(editBreakData.startTime).format("HH:mm")
          : breakItem.startTime;
        const newEndTime = editBreakData.endTime
          ? dayjs(editBreakData.endTime).format("HH:mm")
          : breakItem.endTime;

        const dataToValidate = {
          breakSelectedDays: [editedDay],
          startTime:
            editBreakData.startTime ||
            dayjs(`2000-01-01 ${breakItem.startTime}`),
          endTime:
            editBreakData.endTime || dayjs(`2000-01-01 ${breakItem.endTime}`),
        };

        const breaksForValidation = breaks
          .map((b, idx) => {
            if (idx === actualBreakIndex) {
              return {
                ...b,
                days: b.days.filter((d, dIdx) => dIdx !== dayIndex),
              };
            }
            return b;
          })
          .filter((b) => b.days.length > 0);

        await breakValidationSchema.validate(dataToValidate, {
          context: {
            breaks: breaksForValidation,
            editIndex: actualBreakIndex,
          },
          abortEarly: false,
        });

        const updated = breaks.map((b, idx) => {
          if (idx === actualBreakIndex) {
            return {
              ...b,
              days: [...b.days],
            };
          }
          return { ...b, days: [...b.days] };
        });

        const currentBreak = updated[actualBreakIndex];

        const timeChanged =
          newStartTime !== breakItem.startTime ||
          newEndTime !== breakItem.endTime;

        if (timeChanged && currentBreak.days.length > 1) {
          currentBreak.days.splice(dayIndex, 1);
          updated.push({
            days: [editedDay],
            startTime: newStartTime,
            endTime: newEndTime,
          });
        } else if (timeChanged && currentBreak.days.length === 1) {
          updated[actualBreakIndex] = {
            ...currentBreak,
            startTime: newStartTime,
            endTime: newEndTime,
          };
        }

        dispatch(setBreaks(updated));
        setEditingBreakIndex(null);
        setEditBreakData(null);
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

  const handleCancelInlineEdit = () => {
    setEditingBreakIndex(null);
    setEditBreakData(null);
  };

  const handleDeleteDay = (breakIndex, dayIndex) => {
    const updated = breaks.map((b, idx) => ({
      ...b,
      days: [...b.days],
    }));

    const breakItem = updated[breakIndex];
    breakItem.days.splice(dayIndex, 1);

    const finalUpdated = updated.filter((b) => b.days.length > 0);
    dispatch(setBreaks(finalUpdated));
  };

  return {
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
  };
};
