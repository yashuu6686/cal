import { configureStore } from "@reduxjs/toolkit";
import calendarSchedule from "./slices/calendarSlice";
import serviceReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    calendar: calendarSchedule,
     ui: serviceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state for serialization checks
        // (dayjs objects are not serializable)
         ignoredActions: ['calendar/addSlotToDay'],
        ignoredPaths: ['calendar.events'],
        ignoredActions: [
          'calendar/setStartTime',
          'calendar/setEndTime',
          'calendar/setForm',
          'calendar/updateFormField',
          'calendar/addSlot',
          'calendar/setHolidayValues',
        ],
        ignoredPaths: [
          'calendar.events',
          'calendar.startTime',
          'calendar.endTime',
          'calendar.form',
          'calendar.holidayValues',
          'calendar.weekSchedule',
        ],
      },
    }),
});

export default store;