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
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post("/createDoctorCalendar", payload);
      return res.data;  // here "data" = your full payload
    } catch (err) {
      return rejectWithValue(err.response?.data || "API Error");
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
  data:null,
  selectedServices: [],
  loading: false,
  error: null,

  events: [],
  weekSchedule: Object.keys(dayToNumber).map((day) => ({
    day,
    slots: [],
  })),

  // UI State
  openDialog: false,
  openHolidayDialog: false,
  isCalendarPublished: false,
  isEditMode: false,

  isLoading: false,
};

// ===== SLICE =====
const calendarScheduleSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    // // ===== UI STATE =====
    setOpenDialog: (state, action) => {
      state.openDialog = action.payload;
    },

    setOpenHolidayDialog: (state, action) => {
      state.openHolidayDialog = action.payload;
    },

    setIsCalendarPublished: (state, action) => {
      state.isCalendarPublished = action.payload;
    },

    setIsEditMode: (state, action) => {
      state.isEditMode = action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setSelectedServices: (state, action) => {
      state.selectedServices = action.payload;
    },
    // Action to toggle a service
    toggleService: (state, action) => {
      const serviceId = action.payload;
      const index = state.selectedServices.indexOf(serviceId);

      if (index > -1) {
        state.selectedServices.splice(index, 1);
      } else {
        state.selectedServices.push(serviceId);
      }
    },
  
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

      if (!state.holidays || !state.holidays[index]) {
        return;
      }

      state.holidays[index] = {
        ...state.holidays[index],
        date,
        startTime,
        endTime,
      };

    },
  },

  extraReducers: (builder) => {
    builder
     
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

        // Breaks mapping (existing code)
        state.breaks =
          action.payload?.availability?.flatMap((dayItem, dayIndex) =>
            dayItem.breaks.map((b, breakIndex) => ({
              ...b,
              day: dayItem.day,
              dayIndex,
              breakIndex,
            }))
          ) || [];

        // ⭐ NEW: weekSchedule ko API data se populate karein
        if (action.payload?.availability) {
          state.weekSchedule = action.payload.availability.map((dayItem) => ({
            day: dayItem.day,
            slots: dayItem.services.map((service) => ({
              id: nanoid(),
              start: dayjs(`2000-01-01 ${service.startTime}`), // dayjs object
              end: dayjs(`2000-01-01 ${service.endTime}`),
              serviceType: service.name,
              speciality: ["General"], // ya API se speciality lein agar available ho
              isDummy: false,
              duration: service.duration || 15,
              keyIdentifier: service.keyIdentifier,
              _id: service._id,
            })),
          }));
        }

        // Selected services IDs collect karein
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

        // ⭐ NEW: Events bhi update karein taaki calendar mein show ho
        const newEvents = [];
        state.weekSchedule.forEach((item) => {
          const dayNum = dayToNumber[item.day];
          const base = getNextDayOfWeek(dayNum);

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
              keyIdentifier: slot.keyIdentifier,
              specialities: Array.isArray(slot.speciality)
                ? slot.speciality
                : typeof slot.speciality === "string"
                ? slot.speciality.split(",").map((s) => s.trim())
                : [],
            });
          });
        });
        state.events = newEvents;
      })
      .addCase(getDoctorCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

        .addCase(createDoctorCalendar.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDoctorCalendar.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; 
      })
      .addCase(createDoctorCalendar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export Actions
export const {
  setOpenDialog,
  setOpenHolidayDialog,
  openAddSlotDialog,
  setIsCalendarPublished,
  setIsEditMode,
  // setCalendarId,
  setLoading,

  updateEvents,
  // resetSchedule,
  setSelectedServices,
  toggleService,
  clearSelectedServices,
  updateBreak,
  updateHoliday,
} = calendarScheduleSlice.actions;

export const selectIsLoading = (state) => state.calendar.isLoading;

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
         keyIdentifier: service.keyIdentifier, 
      }));
  }
);

export default calendarScheduleSlice.reducer;
