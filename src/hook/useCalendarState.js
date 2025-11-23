import { useSelector } from "react-redux";


import { selectIsLoading } from "@/redux/store/slices/calendarSlice";

export const useCalendarState = () => {
  const isLoading = useSelector(selectIsLoading);

  const { isCalendarPublished, isEditMode, apiError, apiSuccess } = useSelector(
    (state) => state.calendar
  );

  const isFieldsDisabled = isCalendarPublished && !isEditMode;

  return {
    // UI state
    isLoading,
    isCalendarPublished,
    isEditMode,
    isFieldsDisabled,


  };
};
