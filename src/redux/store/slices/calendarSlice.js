import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import moment from "moment";
// import {
//   video,
//   home,
//   clinic,
//   nuro,
//   gen,
//   ortho,
//   tooth,
//   cardio,
// } from "../../../../pages/tables";
import video from "../../../../public/Video_Call_Service.png"
import clinic from "../../../../public/Clinic_Visit_Service.png"
import home from "../../../../public/Home_Visit_Service.webp"
import tooth from "../../../../public/tooth 1.png"
import gen from "../../../../public/General.png"
import nuro from "../../../../public/Neurologist.png"
import ortho from "../../../../public/Orthopaedic.png"
import cardio from "../../../../public/cardiology.png"


import axios from "axios";

export const createDoctorCalendar = createAsyncThunk(
  "calendar/createDoctorCalendar",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().calendar;

      const payload = {
        routeName: "createDoctorCalendar",
        createdByKeyIdentifier: "DO",
        keyIdentifier: "DO",
        createdBy: "6673c2800c262f2a80430cc6",
        masterProfileId: "6673c2800c262f2a80430cc6",
        timezone: "America/New_York",
        advanceBookingDays: 15,
        checkInTime: 60,
        specialties: state.selectedSpecialities.map((s) => ({
          _id: s._id,
          name: s.type,
          keyIdentifier: s.keyIdentifier || "GN",
          imageUrl: s.imageUrl || "",
        })),
        services: state.selectedServices.map((s) => ({
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
        availability: state.weekSchedule.map((dayObj) => ({
          day: dayObj.day,
          breaks: state.breaks
            .filter((b) => b.days?.includes(dayObj.day))
            .map((b) => {
              const start = dayjs(b.startTime);
              const end = dayjs(b.endTime);
              return {
                breakStartTime:
                  b.startTime && start.isValid() ? start.format("HH:mm") : null,
                breakEndTime:
                  b.endTime && end.isValid() ? end.format("HH:mm") : null,
              };
            }),
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
        holidays: state.holidays.map((h) => ({
          date: h.date ? dayjs(h.date).format("YYYY-MM-DD") : null,
          startTime: h.startTime ? dayjs(h.startTime).format("HH:mm") : null,
          endTime: h.endTime ? dayjs(h.endTime).format("HH:mm") : null,
        })),
      };

      // ---- Make API Call ----
      const response = await axios.post(
        ` https://devapi.dequity.technology/createDoctorCalendar`,
        payload
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


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
  dataOfService: [
    { img: video, type: "Video Call", time: "15" },
    { img: home, type: "Home Visit", time: "90" },
    { img: clinic, type: "Clinic Visit", time: "15" },
  ],
  specialities: [
    { img: nuro, type: "Neurologist" },
    { img: gen, type: "General" },
    { img: ortho, type: "Orthopaedic" },
    { img: tooth, type: "Dental" },
    { img: cardio, type: "Cardiology" },
  ],
  selectedServices: [],
  selectedSpecialities: [],

  // Calendar Events
  events: [],
  weekSchedule: Object.keys(dayToNumber).map((day) => ({
    day,
    slots: [],
  })),

  // Form & Selection
  selectedDays: [],
  breakSelectedDays: [],
  selectedEvent: null,
  form: {},
  editingSlot: null,

  // Time
  startTime: null,
  endTime: null,
  step: 15,

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
  calendarId: null,
  isLoading: false,
  apiError: null,
  apiSuccess: null,

  openDialog: false,
  selectedDay: null,
};

// ✅ Calendar Slice
const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    // ===== SERVICE & SPECIALITY ACTIONS =====
    toggleService: (state, action) => {
      const service = action.payload;
      const exists = state.selectedServices.some(
        (s) => s.type === service.type && s.time === service.time
      );

      if (exists) {
        state.selectedServices = state.selectedServices.filter(
          (s) => !(s.type === service.type && s.time === service.time)
        );
      } else {
        state.selectedServices.push(service);
      }
    },

    toggleSpeciality: (state, action) => {
      const speciality = action.payload;
      const exists = state.selectedSpecialities.some(
        (s) => s.type === speciality.type
      );
      if (exists) {
        state.selectedSpecialities = state.selectedSpecialities.filter(
          (s) => s.type !== speciality.type
        );
      } else {
        state.selectedSpecialities.push(speciality);
      }
    },

    addNewService: (state, action) => {
      const { serviceName, duration, serviceType } = action.payload;
      const newService = {
        img:
          serviceType === "Video Call"
            ? video
            : serviceType === "Home Visit"
            ? home
            : clinic,
        type: serviceName,
        time: duration.toString(),
      };
      state.dataOfService.push(newService);
    },

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
      const { days, startTime, endTime, serviceType, speciality } =
        action.payload;

      const service = state.selectedServices.find(
        (s) => s.type === serviceType
      );
      const duration = service ? parseInt(service.time) : 15;
      const newSlotId = nanoid();

      const slotSpeciality = speciality ||
        state.selectedSpecialities.map((s) => s.type) || ["General"];

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
                  duration,
                },
              ],
            }
          : item
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
      if (state.editIndex !== null) {
        state.breaks[state.editIndex] = newBreak;
        state.editIndex = null;
      } else {
        state.breaks.push(newBreak);
      }
      state.breakSelectedDays = [];
      state.startTime = null;
      state.endTime = null;
    },

    setBreaks: (state, action) => {
      state.breaks = action.payload;
    },

    setEditIndex: (state, action) => {
      state.editIndex = action.payload;
    },

    // ===== HOLIDAY ACTIONS =====
    addHoliday: (state, action) => {
      const newHoliday = action.payload;
      if (state.holidayEditIndex !== null) {
        state.holidays[state.holidayEditIndex] = newHoliday;
        state.holidayEditIndex = null;
      } else {
        state.holidays.push(newHoliday);
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
      // console.log("+++++++++++++++++++",state.holidayValues);
    },

    setHolidayEditIndex: (state, action) => {
      state.holidayEditIndex = action.payload;
    },

    // ===== UI STATE =====

    setOpenHolidayDialog: (state, action) => {
      state.openHolidayDialog = action.payload;
    },

    setOpenDialog: (state, action) => {
      state.openDialog = action.payload;
    },

    setIsCalendarPublished: (state, action) => {
      state.isCalendarPublished = action.payload;
    },

    setIsEditMode: (state, action) => {
      state.isEditMode = action.payload;
    },

    // ===== API STATE =====
    setCalendarId: (state, action) => {
      state.calendarId = action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setApiError: (state, action) => {
      state.apiError = action.payload;
    },

    setApiSuccess: (state, action) => {
      state.apiSuccess = action.payload;
    },

    clearApiMessages: (state) => {
      state.apiError = null;
      state.apiSuccess = null;
    },

    // ===== EVENTS (Computed from weekSchedule) =====
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
    openAddSlotDialog: (state, action) => {
      state.openDialog = true;
      state.selectedDay = action.payload;
    },
    removeSlot: (state, action) => {
      const { day, slotId } = action.payload;
      state.weekSchedule[day] = state.weekSchedule[day].filter(
        (slot) => slot.id !== slotId
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
                  const updatedSlot = { ...slot, [field]: value };
                  // If updating serviceType, also set the duration
                  if (field === "serviceType") {
                    const service = state.selectedServices.find(
                      (s) => s.type === value
                    );
                    updatedSlot.duration = service
                      ? parseInt(service.time)
                      : 15;
                  }
                  return updatedSlot;
                }
                return slot;
              }),
            }
          : item
      );
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
      });
  },
});

// ✅ Export Actions
export const {
  toggleService,
  toggleSpeciality,
  addNewService,
  setSelectedDays,
  setBreakSelectedDays,
  setForm,
  updateFormField,
  resetForm,
  setStartTime,
  setEndTime,
  setStep,
  addSlot,
  setEditingSlot,
  setSelectedEvent,
  addBreak,
  setBreaks,
  setEditIndex,
  addHoliday,
  setHolidays,
  deleteHoliday,
  setHolidayValues,
  setHolidayEditIndex,
  setOpenDialog,
  setOpenHolidayDialog,
  setIsCalendarPublished,
  setIsEditMode,
  setCalendarId,
  setLoading,
  setApiError,
  setApiSuccess,
  clearApiMessages,
  updateEvents,
  openAddSlotDialog,
  removeSlot,
  updateSlotInDay,
  removeSlotFromDay,
  addSlotToDay,
} = calendarSlice.actions;

// ✅ Selectors
export const selectAllServices = (state) => state.calendar.dataOfService;
export const selectSelectedServices = (state) =>
  state.calendar.selectedServices;
export const selectSpecialities = (state) => state.calendar.specialities;
export const selectSelectedSpecialities = (state) =>
  state.calendar.selectedSpecialities;
export const selectEvents = (state) => state.calendar.events;
export const selectWeekSchedule = (state) => state.calendar.weekSchedule;
export const selectForm = (state) => state.calendar.form;
export const selectSelectedDays = (state) => state.calendar.selectedDays;
export const selectBreaks = (state) => state.calendar.breaks;
export const selectHolidays = (state) => state.calendar.holidays;
export const selectIsLoading = (state) => state.calendar.isLoading;

export default calendarSlice.reducer;
