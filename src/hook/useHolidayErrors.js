import { useState, useEffect } from "react";

export function useHolidayErrors(setHolidayErrors) {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (setHolidayErrors) {
      setHolidayErrors(errors);
    }
  }, [errors, setHolidayErrors]);

  return [errors, setErrors];
}
