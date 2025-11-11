import { useState, useMemo } from "react";
import dayjs from "dayjs";

export function useSlotForm(initialValues = {}, weekDays = []) {
  const defaultSlot = { startTime: "", endTime: "", days: [], ...initialValues };

  const [values, setValues] = useState(defaultSlot);
  const [errors, setErrors] = useState({});
  const [openDays, setOpenDays] = useState(false);

  // Controlled input handler
  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Toggle a single day
  const toggleDay = (idx) => {
    if (values.days.includes(idx)) {
      handleChange("days", values.days.filter((d) => d !== idx));
    } else {
      handleChange("days", [...values.days, idx]);
    }
  };

  // Toggle select all days
  const toggleSelectAll = () => {
    if (values.days.length === weekDays.length) {
      handleChange("days", []);
    } else {
      handleChange("days", weekDays.map((_, i) => i));
    }
  };

  // Memoized start and end time values for MUI TimePicker
  const startTimeValue = useMemo(
    () => (values.startTime ? dayjs(`1970-01-01T${values.startTime}`) : null),
    [values.startTime]
  );
  const endTimeValue = useMemo(
    () => (values.endTime ? dayjs(`1970-01-01T${values.endTime}`) : null),
    [values.endTime]
  );

  return {
    values,
    setValues,
    errors,
    setErrors,
    openDays,
    setOpenDays,
    handleChange,
    toggleDay,
    toggleSelectAll,
    startTimeValue,
    endTimeValue,
  };
}
