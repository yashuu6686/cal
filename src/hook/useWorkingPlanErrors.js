import { useState, useEffect } from "react";

export function useWorkingPlanErrors(setWorkingPlanErrors) {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (setWorkingPlanErrors) {
      setWorkingPlanErrors(errors);
    }
  }, [errors, setWorkingPlanErrors]);

  return [errors, setErrors];
}
