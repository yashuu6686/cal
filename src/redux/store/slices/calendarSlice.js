import {
  createAsyncThunk,
  createSelector,
  createSlice,
  nanoid,
} from "@reduxjs/toolkit";
import dayjs from "dayjs";
import moment from "moment";
import axios from "axios";
import api from "@/components/calendar/utils/axios";

export const createDoctorCalendar = createAsyncThunk(
  "calendar/createDoctorCalendar",
  async (_, { getState, rejectWithValue }) => {
    try {
      const scheduleState = getState().calendar;
      const servicesState = getState().ui;

      // Helper function to safely format time
      const safeFormatTime = (time) => {
        if (!time) return null;
        if (typeof time === "string" && /^\d{2}:\d{2}$/.test(time)) {
          return time;
        }
        const dayjsTime = dayjs(time);
        return dayjsTime.isValid() ? dayjsTime.format("HH:mm") : null;
      };

      // Helper function to safely format date
      const safeFormatDate = (date) => {
        if (!date) return null;
        if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return date;
        }
        const dayjsDate = dayjs(date);
        return dayjsDate.isValid() ? dayjsDate.format("YYYY-MM-DD") : null;
      };

      const payload = {
        routeName: "createDoctorCalendar",
        createdByKeyIdentifier: "DO",
        keyIdentifier: "DO",
        createdBy: "6673c2800c262f2a80430cc6",
        masterProfileId: "6673c2800c262f2a80430cc6",
        timezone: "America/New_York",
        advanceBookingDays: 15,
        checkInTime: 60,
        specialties: servicesState.selectedSpecialities.map((s) => ({
          _id: s._id,
          name: s.type,
          keyIdentifier: s.keyIdentifier || "GN",
          imageUrl: s.imageUrl || "",
        })),
        services: servicesState.selectedServices.map((s) => ({
          keyIdentifier:
            s.type === "Video Call"
              ? "VC"
              : s.type === "Home Visit"
              ? "HV"
              : "CV",
          duration: Number(s.time),
          name: s.type,
          addressId:
            s.type === "Clinic Visit" ? "65f42bc48bbf7b96f8837f23" : null,
        })),
        availability: scheduleState.weekSchedule.map((dayObj) => ({
          day: dayObj.day,
          breaks: scheduleState.breaks
            .filter((b) => b.days?.includes(dayObj.day))
            .map((b) => ({
              breakStartTime: safeFormatTime(b.startTime),
              breakEndTime: safeFormatTime(b.endTime),
            })),
          services: dayObj.slots.map((slot) => ({
            keyIdentifier:
              slot.serviceType === "Video Call"
                ? "VC"
                : slot.serviceType === "Home Visit"
                ? "HV"
                : "CV",
            name: slot.serviceType,
            startTime: slot.start ? dayjs(slot.start).format("HH:mm") : "00:00",
            endTime: slot.end ? dayjs(slot.end).format("HH:mm") : "00:00",
          })),
        })),
        holidays: scheduleState.holidays.map((h) => ({
          date: safeFormatDate(h.date),
          startTime: safeFormatTime(h.startTime),
          endTime: safeFormatTime(h.endTime),
        })),
      };

      console.log("📤 API Payload:", JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `https://devapi.dequity.technology/createDoctorCalendar` ||
          `${userApi}/createDoctorCalendar`,
        payload
      );

      return response.data;
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getSpecialtyMaster = createAsyncThunk(
  "specialtyMaster/getSpecialtyMaster",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/specialty-master");
      return res.data.data; // return only array
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getServiceMaster = createAsyncThunk(
  "serviceMaster/getServiceMaster",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/service-master");
      return res.data.data; // just the array
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getDoctorCalendar = createAsyncThunk(
  "doctorCalendar/getDoctorCalendar",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/doctor-calendar");
      return response.data.data; // only data object return
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const selectTotalUsedMinutes = (state) => {
  return state.calendar.weekSchedule.reduce((sum, day) => {
    return (
      sum +
      day.slots.reduce((subSum, slot) => subSum + Number(slot.duration || 0), 0)
    );
  }, 0);
};

export const selectTotalSlots = (state) => {
  return state.calendar.weekSchedule.reduce(
    (count, day) => count + day.slots.length,
    0
  );
};

const dayToNumber = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const getNextDayOfWeek = (dayNum) => {
  const now = moment();
  const currentDay = now.day();
  let daysToAdd = dayNum - currentDay;
  if (daysToAdd < 0) daysToAdd += 7;
  return now.clone().add(daysToAdd, "days");
};

const initialState = {
  calendar: null,
  specialties: [],
  services: [],
  selectedServices: [],
  loading: false,
  error: null,

  events: [],
  weekSchedule: Object.keys(dayToNumber).map((day) => ({
    day,
    slots: [],
  })),

  selectedDays: [],
  breakSelectedDays: [],
  selectedEvent: null,
  selectedDay: null,
  // form: {},
  editingSlot: null,

  // Time
  startTime: null,
  endTime: null,
  // step: 15,

  // Breaks & Holidays
  breaks: [],
  holidays: [],
  holidayValues: {
    date: null,
    startTime: null,
    endTime: null,
  },
  editIndex: null,
  holidayEditIndex: null,

  // UI State
  openDialog: false,
  openHolidayDialog: false,
  isCalendarPublished: false,
  isEditMode: false,

  // API State
  // calendarId: null,
  isLoading: false,
  // apiError: null,
  // apiSuccess: null,
};

// ===== SLICE =====
const calendarScheduleSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    // ===== DAYS SELECTION =====
    setSelectedDays: (state, action) => {
      state.selectedDays = action.payload;
    },

    setBreakSelectedDays: (state, action) => {
      state.breakSelectedDays = action.payload;
    },

    // ===== FORM ACTIONS =====
    setForm: (state, action) => {
      state.form = action.payload;
    },

    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },

    resetForm: (state) => {
      state.form = {};
    },

    // ===== TIME ACTIONS =====
    setStartTime: (state, action) => {
      state.startTime = action.payload;
    },

    setEndTime: (state, action) => {
      state.endTime = action.payload;
    },

    setStep: (state, action) => {
      state.step = action.payload;
    },

    // ===== SLOT ACTIONS =====
    addSlot: (state, action) => {
      const { days, startTime, endTime, serviceType, speciality, duration } =
        action.payload;

      const newSlotId = nanoid();
      const slotSpeciality = speciality || ["General"];

      // FIX: Make sure duration is properly set
      const slotDuration = duration ? Number(duration) : 15;

      console.log(
        `Adding slot: ${serviceType}, Duration: ${slotDuration} minutes`
      );

      state.weekSchedule = state.weekSchedule.map((item) =>
        days.includes(item.day)
          ? {
              ...item,
              slots: [
                ...item.slots,
                {
                  id: newSlotId,
                  start: dayjs(startTime),
                  end: dayjs(endTime),
                  serviceType,
                  speciality: slotSpeciality,
                  isDummy: false,
                  duration: slotDuration, // IMPORTANT: Store as number
                },
              ],
            }
          : item
      );
    },

    addSlotToDay: (state, action) => {
      const { day, slot } = action.payload;
      state.weekSchedule = state.weekSchedule.map((item) =>
        item.day === day
          ? {
              ...item,
              slots: [...item.slots, slot],
            }
          : item
      );
    },

    removeSlotFromDay: (state, action) => {
      const { day, slotId } = action.payload;
      state.weekSchedule = state.weekSchedule.map((item) =>
        item.day === day
          ? {
              ...item,
              slots: item.slots.filter((slot) => slot.id !== slotId),
            }
          : item
      );
    },

    updateSlotInDay: (state, action) => {
      const { day, slotId, field, value } = action.payload;
      state.weekSchedule = state.weekSchedule.map((item) =>
        item.day === day
          ? {
              ...item,
              slots: item.slots.map((slot) => {
                if (slot.id === slotId) {
                  return { ...slot, [field]: value };
                }
                return slot;
              }),
            }
          : item
      );
    },

    removeSlotsByServiceType: (state, action) => {
      const serviceType = action.payload;

      state.weekSchedule = state.weekSchedule.map((dayItem) => ({
        ...dayItem,
        slots: dayItem.slots.filter((slot) => slot.serviceType !== serviceType),
      }));

      state.events = state.events.filter(
        (event) => event.serviceType !== serviceType
      );
    },

    setEditingSlot: (state, action) => {
      state.editingSlot = action.payload;
    },

    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },

    // ===== BREAK ACTIONS =====
    addBreak: (state, action) => {
      const newBreak = action.payload;
      const breakToAdd = {
        ...newBreak,
        startTime: newBreak.startTime
          ? dayjs(newBreak.startTime).format("HH:mm")
          : null,
        endTime: newBreak.endTime
          ? dayjs(newBreak.endTime).format("HH:mm")
          : null,
      };
      if (state.editIndex !== null) {
        state.breaks[state.editIndex] = breakToAdd;
        state.editIndex = null;
      } else {
        state.breaks.push(breakToAdd);
      }
      state.breakSelectedDays = [];
      state.startTime = null;
      state.endTime = null;
    },

    setBreaks: (state, action) => {
      state.breaks = action.payload;
    },

    deleteBreak: (state, action) => {
      const index = action.payload;
      state.breaks = state.breaks.filter((_, i) => i !== index);
    },

    setEditIndex: (state, action) => {
      state.editIndex = action.payload;
    },

    // ===== HOLIDAY ACTIONS =====
    addHoliday: (state, action) => {
      const newHoliday = action.payload;
      const holidayToAdd = {
        ...newHoliday,
        startTime: newHoliday.startTime
          ? dayjs(newHoliday.startTime).format("HH:mm")
          : null,
        endTime: newHoliday.endTime
          ? dayjs(newHoliday.endTime).format("HH:mm")
          : null,
      };
      if (state.holidayEditIndex !== null) {
        state.holidays[state.holidayEditIndex] = holidayToAdd;
        state.holidayEditIndex = null;
      } else {
        state.holidays.push(holidayToAdd);
      }
      state.holidayValues = { date: null, startTime: null, endTime: null };
    },

    setHolidays: (state, action) => {
      state.holidays = action.payload;
    },

    deleteHoliday: (state, action) => {
      const index = action.payload;
      state.holidays = state.holidays.filter((_, i) => i !== index);
    },

    setHolidayValues: (state, action) => {
      state.holidayValues = action.payload;
    },

    setHolidayEditIndex: (state, action) => {
      state.holidayEditIndex = action.payload;
    },

    // ===== UI STATE =====
    setOpenDialog: (state, action) => {
      state.openDialog = action.payload;
    },

    setOpenHolidayDialog: (state, action) => {
      state.openHolidayDialog = action.payload;
    },

    openAddSlotDialog: (state, action) => {
      state.openDialog = true;
      state.selectedDay = action.payload;
    },

    setIsCalendarPublished: (state, action) => {
      state.isCalendarPublished = action.payload;
    },

    setIsEditMode: (state, action) => {
      state.isEditMode = action.payload;
    },

    // ===== API STATE =====
    // setCalendarId: (state, action) => {
    //   state.calendarId = action.payload;
    // },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // setApiError: (state, action) => {
    //   state.apiError = action.payload;
    // },

    // setApiSuccess: (state, action) => {
    //   state.apiSuccess = action.payload;
    // },

    // clearApiMessages: (state) => {
    //   state.apiError = null;
    //   state.apiSuccess = null;
    // },

    updateEvents: (state) => {
      const newEvents = [];
      state.weekSchedule.forEach((item) => {
        const base = getNextDayOfWeek(dayToNumber[item.day]);
        item.slots.forEach((slot) => {
          const specialitiesText = Array.isArray(slot.speciality)
            ? slot.speciality.join(", ")
            : slot.speciality || "";
          newEvents.push({
            id: slot.id,
            title: `${slot.serviceType} ${specialitiesText}`,
            start: slot.start
              ? base
                  .clone()
                  .set({
                    hour: dayjs(slot.start).hour(),
                    minute: dayjs(slot.start).minute(),
                  })
                  .toDate()
              : null,
            end: slot.end
              ? base
                  .clone()
                  .set({
                    hour: dayjs(slot.end).hour(),
                    minute: dayjs(slot.end).minute(),
                  })
                  .toDate()
              : null,
            serviceType: slot.serviceType,
            duration: slot.duration,
            specialities: Array.isArray(slot.speciality)
              ? slot.speciality
              : typeof slot.speciality === "string"
              ? slot.speciality.split(",").map((s) => s.trim())
              : [],
          });
        });
      });
      state.events = newEvents;
    },

    resetSchedule: (state) => {
      state.weekSchedule = Object.keys(dayToNumber).map((day) => ({
        day,
        slots: [],
      }));
      state.events = [];
      state.breaks = [];
      state.holidays = [];
    },

    setSelectedServices: (state, action) => {
      state.selectedServices = action.payload;
    },
    // ⭐ Action to toggle a service
    toggleService: (state, action) => {
      const serviceId = action.payload;
      const index = state.selectedServices.indexOf(serviceId);

      if (index > -1) {
        state.selectedServices.splice(index, 1);
      } else {
        state.selectedServices.push(serviceId);
      }
    },
    // ⭐ Action to clear selected services
    clearSelectedServices: (state) => {
      state.selectedServices = [];
    },
    updateBreak: (state, action) => {
      const { breakIndex, dayIndex, startTime, endTime } = action.payload;

      const target = state.breaks.find(
        (x) => x.breakIndex === breakIndex && x.dayIndex === dayIndex
      );

      if (target) {
        target.breakStartTime = startTime;
        target.breakEndTime = endTime;
      }
    },
    updateHoliday: (state, action) => {
      const { index, date, startTime, endTime } = action.payload;

      console.log("REDUCER - Before:", JSON.stringify(state.holidays));

      if (!state.holidays || !state.holidays[index]) {
        console.log("REDUCER - holidays not found or invalid index");
        return;
      }

      state.holidays[index] = {
        ...state.holidays[index],
        date,
        startTime,
        endTime,
      };

      console.log("REDUCER - After:", JSON.stringify(state.holidays));
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createDoctorCalendar.pending, (state) => {
        state.isLoading = true;
        state.apiError = null;
        state.apiSuccess = null;
      })
      .addCase(createDoctorCalendar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.apiSuccess = "Doctor calendar created successfully!";
        state.calendarId = action.payload?.calendarId || null;
      })
      .addCase(createDoctorCalendar.rejected, (state, action) => {
        state.isLoading = false;
        state.apiError = action.payload || "Failed to create calendar.";
      })
      .addCase(getServiceMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(getServiceMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSpecialtyMaster.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSpecialtyMaster.fulfilled, (state, action) => {
        state.loading = false;
        state.specialties = action.payload;
      })
      .addCase(getSpecialtyMaster.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDoctorCalendar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.calendar = action.payload;
        state.holidays = action.payload?.holidays || [];

        state.breaks =
          action.payload?.availability?.flatMap((dayItem, dayIndex) =>
            dayItem.breaks.map((b, breakIndex) => ({
              ...b,
              day: dayItem.day,
              dayIndex,
              breakIndex,
            }))
          ) || [];

        const activeServiceIds = new Set();

        if (action.payload?.availability) {
          action.payload.availability.forEach((item) => {
            if (item.services && item.services.length > 0) {
              item.services.forEach((srv) => {
                if (srv._id) {
                  activeServiceIds.add(srv._id);
                }
              });
            }
          });
        }

        state.selectedServices = Array.from(activeServiceIds);
      })
      .addCase(getDoctorCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export Actions
export const {
  setSelectedDays,
  setBreakSelectedDays,
  setForm,
  updateFormField,
  resetForm,
  setStartTime,
  setEndTime,
  setStep,
  addSlot,
  addSlotToDay,
  removeSlotFromDay,
  updateSlotInDay,
  removeSlotsByServiceType,
  setEditingSlot,
  setSelectedEvent,
  addBreak,
  setBreaks,
  deleteBreak,
  setEditIndex,
  addHoliday,
  setHolidays,
  deleteHoliday,
  setHolidayValues,
  setHolidayEditIndex,
  setOpenDialog,
  setOpenHolidayDialog,
  openAddSlotDialog,
  setIsCalendarPublished,
  setIsEditMode,
  // setCalendarId,
  setLoading,
  // setApiError,
  // setApiSuccess,
  // clearApiMessages,
  updateEvents,
  resetSchedule,
  setSelectedServices,
  toggleService,
  clearSelectedServices,
  updateBreak,
  updateHoliday,
} = calendarScheduleSlice.actions;

// Selectors
export const selectEvents = (state) => state.calendar.events;
export const selectWeekSchedule = (state) => state.calendar.weekSchedule;
export const selectForm = (state) => state.calendar.form;
export const selectSelectedDays = (state) => state.calendar.selectedDays;
export const selectBreaks = (state) => state.calendar.breaks;
export const selectHolidays = (state) => state.calendar.holidays;
export const selectIsLoading = (state) => state.calendar.isLoading;
export const selectApiError = (state) => state.calendar.apiError;
export const selectApiSuccess = (state) => state.calendar.apiSuccess;

// redux/store/slices/calendarSlice.js (same file में add करें)

// ⭐ Basic Selectors
export const selectCalendar = (state) => state.calendar.calendar;
export const selectServices = (state) => state.calendar.services;
export const selectSelectedServices = (state) =>
  state.calendar.selectedServices;
export const selectLoading = (state) => state.calendar.loading;
export const selectError = (state) => state.calendar.error;

export const selectServiceTypesForDropdown = createSelector(
  [
    (state) => state.calendar.services,
    (state) => state.calendar.selectedServices,
  ],
  (services, selectedIds) => {
    return services
      .filter((service) => selectedIds.includes(service._id))
      .map((service) => ({
        label: service.name,
        value: service.name,
        duration: service.duration,
        id: service._id,
      }));
  }
);

export default calendarScheduleSlice.reducer;
