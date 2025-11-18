import { useSelector } from "react-redux";

// Redux Selectors
import {
  
  
 
  selectWeekSchedule,
  selectBreaks,
  selectHolidays,
  selectIsLoading,
} from "@/redux/store/slices/calendarSlice";


import {selectAllServices,selectSelectedServices, selectSpecialities,
  selectSelectedSpecialities,} from '@/redux/store/slices/uiSlice'


export const useCalendarState = () => {
  // Service-related state
  const dataOfService = useSelector(selectAllServices);
  const selectedServices = useSelector(selectSelectedServices);
  
  // Speciality-related state
  const specialities = useSelector(selectSpecialities);
  const selectedSpecialities = useSelector(selectSelectedSpecialities);
  
  // Schedule-related state
  const weekSchedule = useSelector(selectWeekSchedule);
  const breaks = useSelector(selectBreaks);
  const holidays = useSelector(selectHolidays);
  
  // Loading state
  const isLoading = useSelector(selectIsLoading);

  // Additional calendar state (from main calendar slice)
  const {
    isCalendarPublished,
    isEditMode,
    breakSelectedDays,
    startTime,
    endTime,
    holidayValues,
    holidayEditIndex,
    editIndex,
    apiError,
    apiSuccess,
  } = useSelector((state) => state.calendar);

  // Computed state - determine if fields should be disabled
  const isFieldsDisabled = isCalendarPublished && !isEditMode;

  // Return complete calendar state
  return {
    // Service data
    dataOfService,
    selectedServices,
    
    // Speciality data
    specialities,
    selectedSpecialities,
    
    // Schedule data
    weekSchedule,
    breaks,
    holidays,
    
    // Break form state
    breakSelectedDays,
    startTime,
    endTime,
    editIndex,
    
    // Holiday form state
    holidayValues,
    holidayEditIndex,
    
    // UI state
    isLoading,
    isCalendarPublished,
    isEditMode,
    isFieldsDisabled,
    
    // API feedback
    apiError,
    apiSuccess,
  };
};