import { useDispatch } from "react-redux";
import { useEffect } from "react";
import dayjs from "dayjs";

// Redux Actions
import {
  addNewService,
  addBreak,
  addHoliday,
  setIsCalendarPublished,
  setIsEditMode,
  clearApiMessages,
  updateEvents,
  createDoctorCalendar,
} from "@/redux/store/slices/calendarSlice";

import {
  publishCalendar,
  updateCalendar,
} from "@/components/calendar/services/calendarService";

import { generateCalendarPayload } from "@/components/calendar/config/payload";

import { useCalendarState } from "./useCalendarState";
export const useCalendarAPI = (setStep) => {
  const dispatch = useDispatch();

  const {
    selectedServices,
    selectedSpecialities,
    weekSchedule,
    breaks,
    holidays,
    isCalendarPublished,
    apiSuccess,
    apiError,
  } = useCalendarState();

  useEffect(() => {
    if (apiSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearApiMessages());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [apiSuccess, dispatch]);

  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => {
        dispatch(clearApiMessages());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [apiError, dispatch]);

  const handleStep1Submit = async (values, { setSubmitting }) => {
    try {
      setStep(2);
    } catch (error) {
      // console.error("Step 1 validation error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep2Submit = async (values, { setSubmitting }) => {
    try {
      // Save breaks if provided
      if (
        values.breakSelectedDays?.length > 0 &&
        values.startTime &&
        values.endTime
      ) {
        const newBreak = {
          days: values.breakSelectedDays,
          startTime: values.startTime, // Pass the dayjs object
          endTime: values.endTime,
        };
        dispatch(addBreak(newBreak));
      }

      // Save holidays if provided
      if (
        values.holidayDate &&
        values.holidayStartTime &&
        values.holidayEndTime
      ) {
        const newHoliday = {
          date: values.holidayDate,
          startTime: values.holidayStartTime,
          endTime: values.holidayEndTime,
        };
        dispatch(addHoliday(newHoliday));
      }

      dispatch(updateEvents());

      const payload = generateCalendarPayload({
        selectedServices,
        selectedSpecialities,
        weekSchedule,
        breaks,
        holidays,
        breakSelectedDays: values.breakSelectedDays,
        startTime: values.startTime,
        endTime: values.endTime,
        holidayValues: {
          date: values.holidayDate,
          startTime: values.holidayStartTime,
          endTime: values.holidayEndTime,
        },
      });

      // Call appropriate API based on calendar state
      let result;
      if (isCalendarPublished) {
        result = await updateCalendar(payload, dispatch);
      } else {
        result = await publishCalendar(payload, dispatch);
      }

      if (result.success) {
        dispatch(setIsCalendarPublished(true));
        dispatch(setIsEditMode(false));
        dispatch(createDoctorCalendar());
        setStep(1);
      }
    } catch (error) {
      // console.error("Step 2 submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddServiceSubmit = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    try {
      dispatch(
        addNewService({
          serviceName: values.name,
          duration: values.duration,
          serviceType: values.type,
        })
      );

      resetForm();
      return { success: true };
    } catch (error) {
      // console.error("Add service error:", error);
      return { success: false };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    handleStep1Submit,
    handleStep2Submit,
    handleAddServiceSubmit,
  };
};
